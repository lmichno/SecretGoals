import type { Request, Response } from 'express'
import * as goalsService from '../services/goalsService.js'

export async function listGoals(_req: Request, res: Response) {
  try {
    const goals = await goalsService.findAllGoals()
    res.json(goals)
  } catch (error) {
    console.error('Błąd pobierania celów:', error)
    res.status(500).json({ error: 'Nie udało się pobrać celów' })
  }
}

export async function createGoal(req: Request, res: Response) {
  try {
    const { title, description, isPublic, targetDate } = req.body as Record<string, unknown>
    if (typeof title !== 'string' || !title.trim()) {
      res.status(400).json({ error: 'Tytuł celu jest wymagany' })
      return
    }

    const goal = await goalsService.createGoal({
      title: title.trim(),
      description: typeof description === 'string' ? description : undefined,
      isPublic: typeof isPublic === 'boolean' ? isPublic : undefined,
      targetDate: typeof targetDate === 'string' ? new Date(targetDate) : null,
    })

    res.status(201).json(goal)
  } catch (error) {
    console.error('Błąd tworzenia celu:', error)
    res.status(500).json({ error: 'Nie udało się utworzyć celu' })
  }
}
