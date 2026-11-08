import request from 'supertest'
import { afterAll, beforeEach, describe, expect, it } from 'vitest'
import { app, prisma, resetDatabase } from './helpers.js'

const credentials = { email: 'test@secretgoals.pl', password: 'haslo1234' }

beforeEach(resetDatabase)
afterAll(() => prisma.$disconnect())

// Podstawowe scenariusze US01, żeby aktualizacje bibliotek (Prisma, Express) nie zepsuły logowania
describe('US01: rejestracja i logowanie', () => {
  it('rejestruje konto z aliasem i nie zwraca hasła', async () => {
    const res = await request(app).post('/api/auth/register').send(credentials)

    expect(res.status).toBe(201)
    expect(res.body.alias).toEqual(expect.any(String))
    expect(res.body).not.toHaveProperty('passwordHash')
    expect(res.headers['set-cookie']?.[0]).toMatch(/^sg_token=/)
  })

  it('zajęty e-mail zwraca 409', async () => {
    await request(app).post('/api/auth/register').send(credentials)

    const res = await request(app).post('/api/auth/register').send(credentials)

    expect(res.status).toBe(409)
  })

  it('loguje i zwraca dane w /api/auth/me', async () => {
    await request(app).post('/api/auth/register').send(credentials)
    const agent = request.agent(app)

    const login = await agent.post('/api/auth/login').send(credentials)
    const me = await agent.get('/api/auth/me')

    expect(login.status).toBe(200)
    expect(me.status).toBe(200)
    expect(me.body.email).toBe(credentials.email)
  })

  it('złe hasło zwraca 401', async () => {
    await request(app).post('/api/auth/register').send(credentials)

    const res = await request(app)
      .post('/api/auth/login')
      .send({ ...credentials, password: 'zlehaslo1' })

    expect(res.status).toBe(401)
  })

  it('niepoprawny JSON zwraca 400 w formacie API', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email":')

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: 'Niepoprawny format danych (JSON)' })
  })

  it('nieznana ścieżka pod /api zwraca 404', async () => {
    const res = await request(app).get('/api/nie-ma')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ error: 'Nie znaleziono' })
  })
})
