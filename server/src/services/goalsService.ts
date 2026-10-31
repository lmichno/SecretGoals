import prisma from '../prisma.js'

export interface CreateGoalInput {
  title: string
  description?: string
  isPublic?: boolean
  targetDate?: Date | null
}

export function findGoalsByUser(userId: string) {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export function createGoal(userId: string, input: CreateGoalInput) {
  return prisma.goal.create({
    data: {
      userId,
      title: input.title,
      description: input.description,
      isPublic: input.isPublic ?? true,
      targetDate: input.targetDate ?? null,
    },
  })
}
