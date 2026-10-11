import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import prisma from './prisma.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      message: 'Serwer Express i baza SQLite działają poprawnie',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Błąd połączenia z bazą SQLite',
      error: error.message
    })
  }
})

// Przykładowe endpointy dla SecretGoals
app.get('/api/goals', async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' }
    })
    res.json(goals)
  } catch (error) {
    console.error('Błąd pobierania celów:', error)
    res.status(500).json({ error: 'Nie udało się pobrać celów' })
  }
})

app.post('/api/goals', async (req, res) => {
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
        targetDate: targetDate ? new Date(targetDate) : null
      }
    })

    res.status(201).json(goal)
  } catch (error) {
    console.error('Błąd tworzenia celu:', error)
    res.status(500).json({ error: 'Nie udało się utworzyć celu' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Serwer Express działa na porcie http://localhost:${PORT}`)
})
