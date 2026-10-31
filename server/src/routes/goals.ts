import { Router } from 'express'
import { createGoal, listGoals } from '../controllers/goalsController.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(listGoals))
router.post('/', asyncHandler(createGoal))

export default router
