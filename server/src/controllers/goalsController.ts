import type { Request, Response } from 'express'
import { getAuthUserId } from '../middleware/requireAuth.js'
import * as goalsService from '../services/goalsService.js'
import { HttpError } from '../utils/httpError.js'

/** GET /api/goals: cele zalogowanego użytkownika */
export async function listGoals(req: Request, res: Response) {
  const goals = await goalsService.findGoalsByUser(getAuthUserId(req))
  res.json(goals)
}

/** POST /api/goals: właściciel zawsze z tokenu, nigdy z body (ADR-008) */
export async function createGoal(req: Request, res: Response) {
  const { title, description, isPublic, targetDate } = req.body as Record<string, unknown>
  if (typeof title !== 'string' || !title.trim()) {
    throw new HttpError(400, 'Popraw zaznaczone pola', { title: 'Tytuł celu jest wymagany' })
  }

  const goal = await goalsService.createGoal(getAuthUserId(req), {
    title: title.trim(),
    description: typeof description === 'string' ? description : undefined,
    isPublic: typeof isPublic === 'boolean' ? isPublic : undefined,
    targetDate: typeof targetDate === 'string' ? new Date(targetDate) : null,
  })

  res.status(201).json(goal)
}
