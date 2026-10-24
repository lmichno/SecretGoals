import prisma from '../prisma.js'

export async function listGoals(req, res) {
  try {
    const goals = await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json(goals)
  } catch (error) {
    console.error('Błąd pobierania celów:', error)
    res.status(500).json({ error: 'Nie udało się pobrać celów' })
  }
}

export async function createGoal(req, res) {
  try {
    const { title, description, isPublic, targetDate } = req.body
    if (!title) {
      return res.status(400).json({ error: 'Tytuł celu jest wymagany' })
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        isPublic: isPublic ?? true,
        targetDate: targetDate ? new Date(targetDate) : null,
      },
    })

    res.status(201).json(goal)
  } catch (error) {
    console.error('Błąd tworzenia celu:', error)
    res.status(500).json({ error: 'Nie udało się utworzyć celu' })
  }
}
