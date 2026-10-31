import type { NextFunction, Request, Response } from 'express'
import { verifyAuthToken } from '../services/authService.js'
import { AUTH_COOKIE_NAME, clearAuthCookie } from '../utils/authCookie.js'
import { HttpError } from '../utils/httpError.js'

declare global {
  namespace Express {
    interface Request {
      /** Id zalogowanego użytkownika, ustawiane przez requireAuth */
      userId?: string
    }
  }
}

/**
 * Wpuszcza tylko zalogowanych (ADR-008). Sprawdza JWT z ciasteczka i ustawia req.userId.
 * Podpinamy go w plikach routes/ do tras, które wymagają logowania.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const cookies = req.cookies as Record<string, unknown> | undefined
  const token = cookies?.[AUTH_COOKIE_NAME]
  const userId = typeof token === 'string' ? verifyAuthToken(token) : null

  if (!userId) {
    if (token !== undefined) clearAuthCookie(res)
    next(new HttpError(401, 'Musisz się zalogować'))
    return
  }

  req.userId = userId
  next()
}

/** Id zalogowanego użytkownika w kontrolerze za requireAuth. */
export function getAuthUserId(req: Request): string {
  if (!req.userId) throw new HttpError(401, 'Musisz się zalogować')
  return req.userId
}
