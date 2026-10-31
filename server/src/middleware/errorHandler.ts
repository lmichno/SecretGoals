import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../utils/httpError.js'

/** Nieznana ścieżka pod /api */
export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, 'Nie znaleziono'))
}

/**
 * Ostatni middleware w łańcuchu (ADR-006). Zamienia każdy błąd na { error, fields? }.
 * Szczegóły techniczne trafiają tylko do logów serwera.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof HttpError) {
    res
      .status(err.status)
      .json(err.fields ? { error: err.message, fields: err.fields } : { error: err.message })
    return
  }

  // Niepoprawny JSON w treści żądania (express.json)
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ error: 'Niepoprawny format danych (JSON)' })
    return
  }

  console.error('Nieobsłużony błąd:', err)
  res.status(500).json({ error: 'Wystąpił błąd serwera. Spróbuj ponownie później.' })
}
