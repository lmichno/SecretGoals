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
    // Szczegóły tylko w logach serwera (ADR-006)
    console.error('Błąd połączenia z bazą:', error)
    res.status(500).json({ status: 'error', error: 'Błąd połączenia z bazą SQLite' })
  }
}
