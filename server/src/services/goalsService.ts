import type { Prisma } from '@prisma/client'
import { MAX_ACTIVE_GOALS, type GoalCategory, type GoalType } from '../domain/goalRules.js'
import prisma from '../prisma.js'
import { HttpError } from '../utils/httpError.js'

export interface CreateGoalInput {
  title: string
  description: string | null
  category: GoalCategory
  type: GoalType
  /** null dla serii dziennej, kwota w PLN albo liczba razy w tygodniu */
  targetValue: number | null
  /** Sam dzień, zapisany jako północ UTC */
  targetDate: Date | null
  isPublic: boolean
}

/** Pola celu zwracane klientowi. Bez userId: właścicielem jest zawsze zalogowany (ADR-008). */
export const goalSelect = {
  id: true,
  title: true,
  description: true,
  category: true,
  type: true,
  targetValue: true,
  targetDate: true,
  isPublic: true,
  status: true,
  createdAt: true,
} satisfies Prisma.GoalSelect

/** Cele zalogowanego, najnowsze pierwsze, bez zarchiwizowanych */
export function findGoalsByUser(userId: string) {
  return prisma.goal.findMany({
    where: { userId, status: { not: 'archived' } },
    orderBy: { createdAt: 'desc' },
    select: goalSelect,
  })
}

/** Jeden cel zalogowanego albo null (także gdy cel należy do kogoś innego) */
export function findOwnGoal(userId: string, goalId: string) {
  return prisma.goal.findFirst({ where: { id: goalId, userId }, select: goalSelect })
}

/**
 * Wpis "Nowy cel" w Społeczności (ADR-011: post typu goal tworzy serwis, nie klient).
 * Treść posta bierzemy z celu przy odczycie feedu, więc content zostaje pusty.
 * Osobna funkcja, bo użyje jej też późniejsza zmiana widoczności celu.
 */
export function createGoalPost(tx: Prisma.TransactionClient, userId: string, goalId: string) {
  return tx.post.create({ data: { type: 'goal', authorId: userId, goalId } })
}

/**
 * Tworzy cel (US02). Cel i jego post zapisujemy w jednej transakcji, żeby publiczny cel
 * nigdy nie został bez wpisu w feedzie. Rzuca 409 po przekroczeniu limitu aktywnych celów.
 */
export function createGoal(userId: string, input: CreateGoalInput) {
  return prisma.$transaction(async (tx) => {
    const activeGoals = await tx.goal.count({ where: { userId, status: 'active' } })
    if (activeGoals >= MAX_ACTIVE_GOALS) {
      throw new HttpError(
        409,
        `Możesz mieć najwyżej ${MAX_ACTIVE_GOALS} aktywnych celów. Zakończ albo zarchiwizuj któryś, żeby dodać nowy.`
      )
    }

    const goal = await tx.goal.create({
      data: { userId, status: 'active', ...input },
      select: goalSelect,
    })

    if (goal.isPublic) await createGoalPost(tx, userId, goal.id)

    return goal
  })
}
