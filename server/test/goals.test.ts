import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { MAX_ACTIVE_GOALS } from '../src/domain/goalRules.js'
import { todayInAppZone } from '../src/utils/goalValidation.js'
import { app, loggedInAgent, prisma, resetDatabase } from './helpers.js'

const validGoal = {
  title: 'Bieganie 3 razy w tygodniu',
  description: 'Zaczynam od zera, po kontuzji kolana.',
  category: 'sport',
  type: 'weekly_count',
  targetValue: 3,
  targetDate: '2027-03-01',
  isPublic: true,
}

function addYears(day: string, years: number) {
  return `${Number(day.slice(0, 4)) + years}${day.slice(4)}`
}

beforeEach(resetDatabase)
afterAll(() => prisma.$disconnect())

describe('POST /api/goals (US02)', () => {
  it('scenariusz 1: zapisuje publiczny cel, pokazuje go na liście i tworzy post w feedzie', async () => {
    const { agent, userId } = await loggedInAgent()

    const res = await agent.post('/api/goals').send(validGoal)

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      title: validGoal.title,
      description: validGoal.description,
      category: 'sport',
      type: 'weekly_count',
      targetValue: 3,
      targetDate: '2027-03-01T00:00:00.000Z',
      isPublic: true,
      status: 'active',
    })
    expect(res.body).not.toHaveProperty('userId')

    const list = await agent.get('/api/goals')
    expect(list.status).toBe(200)
    expect(list.body.map((g: { id: string }) => g.id)).toEqual([res.body.id])

    const posts = await prisma.post.findMany({ where: { goalId: res.body.id } })
    expect(posts).toHaveLength(1)
    expect(posts[0]).toMatchObject({ type: 'goal', authorId: userId })
  })

  it('cel prywatny nie tworzy posta', async () => {
    const { agent } = await loggedInAgent()

    const res = await agent.post('/api/goals').send({ ...validGoal, isPublic: false })

    expect(res.status).toBe(201)
    expect(await prisma.post.count()).toBe(0)
  })

  it('same pole nazwy wystarcza: reszta dostaje wartości domyślne', async () => {
    const { agent } = await loggedInAgent()

    const res = await agent.post('/api/goals').send({ title: '  Bez cukru  ' })

    expect(res.status).toBe(201)
    expect(res.body).toMatchObject({
      title: 'Bez cukru',
      description: null,
      category: 'inne',
      type: 'daily_streak',
      targetValue: null,
      targetDate: null,
      isPublic: true,
    })
  })

  it.each([undefined, '', '   ', 42])(
    'scenariusz 2: bez nazwy (%j) zwraca 400 i nic nie zapisuje',
    async (title) => {
      const { agent } = await loggedInAgent()

      const res = await agent.post('/api/goals').send({ ...validGoal, title })

      expect(res.status).toBe(400)
      expect(res.body).toEqual({
        error: 'Popraw zaznaczone pola',
        fields: { title: 'Podaj nazwę celu' },
      })
      expect(await prisma.goal.count()).toBe(0)
    }
  )

  it('zbyt długa nazwa i opis dają oba błędy naraz', async () => {
    const { agent } = await loggedInAgent()

    const res = await agent
      .post('/api/goals')
      .send({ ...validGoal, title: 'a'.repeat(101), description: 'b'.repeat(1001) })

    expect(res.status).toBe(400)
    expect(res.body.fields).toEqual({
      title: 'Nazwa może mieć najwyżej 100 znaków',
      description: 'Opis może mieć najwyżej 1000 znaków',
    })
  })

  it('odrzuca kategorię i typ spoza listy', async () => {
    const { agent } = await loggedInAgent()

    const res = await agent
      .post('/api/goals')
      .send({ ...validGoal, category: 'nauka', type: 'monthly' })

    expect(res.status).toBe(400)
    expect(res.body.fields).toEqual({
      category: 'Wybierz kategorię z listy',
      type: 'Wybierz typ celu',
    })
  })

  it.each([
    ['amount', undefined, 'Podaj kwotę większą od zera'],
    ['amount', 0, 'Podaj kwotę większą od zera'],
    ['amount', '500', 'Podaj kwotę większą od zera'],
    ['amount', 10_000_001, 'Kwota może wynosić najwyżej 10 000 000 zł'],
    ['weekly_count', 8, 'Podaj liczbę od 1 do 7'],
    ['weekly_count', 2.5, 'Podaj liczbę od 1 do 7'],
  ])('typ %s z targetValue %j zwraca 400', async (type, targetValue, message) => {
    const { agent } = await loggedInAgent()

    const res = await agent.post('/api/goals').send({ ...validGoal, type, targetValue })

    expect(res.status).toBe(400)
    expect(res.body.fields).toEqual({ targetValue: message })
  })

  it('cel kwotowy zapisuje kwotę zaokrągloną do groszy', async () => {
    const { agent } = await loggedInAgent()

    const res = await agent
      .post('/api/goals')
      .send({ ...validGoal, type: 'amount', targetValue: 1500.555 })

    expect(res.status).toBe(201)
    expect(res.body.targetValue).toBe(1500.56)
  })

  it('seria dzienna pomija targetValue zamiast zwracać błąd', async () => {
    const { agent } = await loggedInAgent()

    const res = await agent
      .post('/api/goals')
      .send({ ...validGoal, type: 'daily_streak', targetValue: 5 })

    expect(res.status).toBe(201)
    expect(res.body.targetValue).toBeNull()
  })

  it.each([
    ['2026-02-30', 'Podaj poprawną datę'],
    ['01.03.2027', 'Podaj poprawną datę'],
    ['2020-01-01', 'Termin nie może być w przeszłości'],
    [addYears(todayInAppZone(), 6), 'Termin może być najpóźniej za 5 lat'],
  ])('termin %s zwraca 400', async (targetDate, message) => {
    const { agent } = await loggedInAgent()

    const res = await agent.post('/api/goals').send({ ...validGoal, targetDate })

    expect(res.status).toBe(400)
    expect(res.body.fields).toEqual({ targetDate: message })
  })

  it('przyjmuje dzisiejszą datę jako termin', async () => {
    const { agent } = await loggedInAgent()
    const today = todayInAppZone()

    const res = await agent.post('/api/goals').send({ ...validGoal, targetDate: today })

    expect(res.status).toBe(201)
    expect(res.body.targetDate).toBe(`${today}T00:00:00.000Z`)
  })

  it('odrzuca widoczność, która nie jest true/false', async () => {
    const { agent } = await loggedInAgent()

    const res = await agent.post('/api/goals').send({ ...validGoal, isPublic: 'tak' })

    expect(res.status).toBe(400)
    expect(res.body.fields).toEqual({ isPublic: 'Wybierz widoczność' })
  })

  it('ignoruje userId i status z treści: właściciel z tokenu, status active', async () => {
    const { agent, userId } = await loggedInAgent()
    const other = await loggedInAgent('inny@secretgoals.pl')

    const res = await agent
      .post('/api/goals')
      .send({ ...validGoal, userId: other.userId, status: 'completed' })

    expect(res.status).toBe(201)
    expect(res.body.status).toBe('active')
    const saved = await prisma.goal.findUniqueOrThrow({ where: { id: res.body.id } })
    expect(saved.userId).toBe(userId)
  })

  it(`pozwala mieć najwyżej ${MAX_ACTIVE_GOALS} aktywnych celów`, async () => {
    const { agent } = await loggedInAgent()
    for (let i = 0; i < MAX_ACTIVE_GOALS; i++) {
      const res = await agent.post('/api/goals').send({ title: `Cel ${i + 1}` })
      expect(res.status).toBe(201)
    }

    const res = await agent.post('/api/goals').send({ title: 'Jeden za dużo' })

    expect(res.status).toBe(409)
    expect(res.body.error).toMatch(/najwyżej 5 aktywnych celów/)
    expect(await prisma.goal.count()).toBe(MAX_ACTIVE_GOALS)
  })

  it('bez zalogowania zwraca 401', async () => {
    const res = await request(app).post('/api/goals').send(validGoal)

    expect(res.status).toBe(401)
  })
})

describe('GET /api/goals', () => {
  it('zwraca tylko moje cele, bez zarchiwizowanych, najnowsze pierwsze', async () => {
    const me = await loggedInAgent()
    const other = await loggedInAgent('inny@secretgoals.pl')
    await other.agent.post('/api/goals').send({ title: 'Cudzy cel' })
    const first = await me.agent.post('/api/goals').send({ title: 'Pierwszy' })
    const second = await me.agent.post('/api/goals').send({ title: 'Drugi' })
    const archived = await me.agent.post('/api/goals').send({ title: 'Stary' })
    await prisma.goal.update({ where: { id: archived.body.id }, data: { status: 'archived' } })

    const res = await me.agent.get('/api/goals')

    expect(res.status).toBe(200)
    expect(res.body.map((g: { id: string }) => g.id)).toEqual([second.body.id, first.body.id])
    expect(res.body[0]).not.toHaveProperty('userId')
  })
})

describe('GET /api/goals/:id', () => {
  it('zwraca mój cel', async () => {
    const { agent } = await loggedInAgent()
    const created = await agent.post('/api/goals').send(validGoal)

    const res = await agent.get(`/api/goals/${created.body.id}`)

    expect(res.status).toBe(200)
    expect(res.body).toEqual(created.body)
  })

  it('cudzy albo nieistniejący cel daje 404', async () => {
    const owner = await loggedInAgent()
    const created = await owner.agent.post('/api/goals').send(validGoal)
    const other = await loggedInAgent('inny@secretgoals.pl')

    const foreign = await other.agent.get(`/api/goals/${created.body.id}`)
    const missing = await owner.agent.get('/api/goals/nie-ma-takiego')

    expect(foreign.status).toBe(404)
    expect(missing.status).toBe(404)
    expect(foreign.body).toEqual({ error: 'Nie znaleziono celu' })
  })
})
