import type { Request, Response } from 'express'
import { getAuthUserId } from '../middleware/requireAuth.js'
import * as goalsService from '../services/goalsService.js'
import { parseGoalInput } from '../utils/goalValidation.js'
import { HttpError } from '../utils/httpError.js'

/** GET /api/goals: cele zalogowanego użytkownika (bez zarchiwizowanych) */
export async function listGoals(req: Request, res: Response) {
  const goals = await goalsService.findGoalsByUser(getAuthUserId(req))
  res.json(goals)
}

/** GET /api/goals/:id: cudzy cel daje 404, żeby nie zdradzać, że istnieje */
export async function getGoal(req: Request, res: Response) {
  const goal = await goalsService.findOwnGoal(getAuthUserId(req), String(req.params.id))
  if (!goal) throw new HttpError(404, 'Nie znaleziono celu')
  res.json(goal)
}

/** POST /api/goals (US02): właściciel zawsze z tokenu, nigdy z body (ADR-008) */
export async function createGoal(req: Request, res: Response) {
  const input = parseGoalInput(req.body)
  const goal = await goalsService.createGoal(getAuthUserId(req), input)
  res.status(201).json(goal)
}
