import { Router } from 'express'
import { createGoal, getGoal, listGoals } from '../controllers/goalsController.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { asyncHandler } from '../utils/asyncHandler.js'

const router = Router()

router.use(requireAuth)

router.get('/', asyncHandler(listGoals))
router.post('/', asyncHandler(createGoal))
router.get('/:id', asyncHandler(getGoal))

export default router
