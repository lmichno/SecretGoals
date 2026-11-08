import { apiRequest } from './client'

export type GoalCategory = 'nalog' | 'finanse' | 'sport' | 'kariera' | 'zdrowie' | 'inne'
export type GoalType = 'daily_streak' | 'amount' | 'weekly_count'
export type GoalStatus = 'active' | 'completed' | 'archived'

export interface Goal {
  id: string
  title: string
  description: string | null
  category: GoalCategory
  type: GoalType
  targetValue: number | null
  targetDate: string | null
  isPublic: boolean
  status: GoalStatus
  createdAt: string
}

export interface CreateGoalInput {
  title: string
  description?: string | null
  targetDate?: string | null
  isPublic?: boolean
  category?: GoalCategory
  type?: GoalType
  targetValue?: number | null
}

export const CATEGORY_LABELS: Record<GoalCategory, string> = {
  nalog: 'Nałóg',
  finanse: 'Finanse',
  sport: 'Sport',
  kariera: 'Kariera',
  zdrowie: 'Zdrowie',
  inne: 'Inne',
}

export const TYPE_LABELS: Record<GoalType, string> = {
  daily_streak: 'Seria dzienna',
  amount: 'Cel kwotowy',
  weekly_count: 'Licznik tygodniowy',
}

/**
 * GET /api/goals: zwraca listę aktywnych i zakończonych celów zalogowanego użytkownika (US02)
 */
export function apiGetGoals(): Promise<Goal[]> {
  return apiRequest<Goal[]>('/api/goals', {
    method: 'GET',
  })
}

/**
 * POST /api/goals: tworzy nowy cel (US02)
 */
export function apiCreateGoal(input: CreateGoalInput): Promise<Goal> {
  return apiRequest<Goal>('/api/goals', {
    method: 'POST',
    body: input,
  })
}

/**
 * GET /api/goals/:id: pobiera jeden cel zalogowanego użytkownika
 */
export function apiGetGoal(id: string): Promise<Goal> {
  return apiRequest<Goal>(`/api/goals/${encodeURIComponent(id)}`, {
    method: 'GET',
  })
}
