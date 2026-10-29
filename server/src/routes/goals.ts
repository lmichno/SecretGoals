import { Router } from 'express'
import { createGoal, listGoals } from '../controllers/goalsController.js'

const router = Router()

router.get('/', listGoals)
router.post('/', createGoal)

export default router
