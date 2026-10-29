import prisma from '../prisma.js'

export interface CreateGoalInput {
  title: string
  description?: string
  isPublic?: boolean
  targetDate?: Date | null
}

export function findAllGoals() {
  return prisma.goal.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export function createGoal(input: CreateGoalInput) {
  return prisma.goal.create({
    data: {
      title: input.title,
      description: input.description,
      isPublic: input.isPublic ?? true,
      targetDate: input.targetDate ?? null,
    },
  })
}
