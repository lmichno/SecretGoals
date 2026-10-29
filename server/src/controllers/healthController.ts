import type { Request, Response } from 'express'
import prisma from '../prisma.js'

export async function getHealth(_req: Request, res: Response) {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({
      status: 'ok',
      message: 'Serwer Express i baza SQLite działają poprawnie',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Database connection error:', error)
    res.status(500).json({
      status: 'error',
      message: 'Błąd połączenia z bazą SQLite',
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
