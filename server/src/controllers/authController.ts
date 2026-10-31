import type { Request, Response } from 'express'
import { getAuthUserId } from '../middleware/requireAuth.js'
import * as authService from '../services/authService.js'
import { clearAuthCookie, setAuthCookie } from '../utils/authCookie.js'
import { HttpError } from '../utils/httpError.js'
import { parseCredentials } from '../utils/validation.js'

/** POST /api/auth/register: tworzy konto z aliasem i od razu loguje (US01) */
export async function register(req: Request, res: Response) {
  const credentials = parseCredentials(req.body, { checkPasswordRules: true })
  const user = await authService.registerUser(credentials)

  setAuthCookie(res, authService.signAuthToken(user.id))
  res.status(201).json(user)
}

/** POST /api/auth/login */
export async function login(req: Request, res: Response) {
  // Przy logowaniu nie sprawdzamy reguł hasła, tylko czy pasuje
  const credentials = parseCredentials(req.body, { checkPasswordRules: false })
  const user = await authService.verifyCredentials(credentials)
  if (!user) {
    // Ten sam komunikat dla złego e-maila i hasła (ADR-008)
    throw new HttpError(401, 'Nieprawidłowy e-mail lub hasło')
  }

  setAuthCookie(res, authService.signAuthToken(user.id))
  res.json(user)
}

/** POST /api/auth/logout */
export async function logout(_req: Request, res: Response) {
  clearAuthCookie(res)
  res.status(204).end()
}

/** GET /api/auth/me: dane zalogowanego o sobie (jedyne miejsce z e-mailem) */
export async function me(req: Request, res: Response) {
  const user = await authService.findCurrentUser(getAuthUserId(req))
  if (!user) {
    // Token poprawny, ale konto zostało usunięte
    clearAuthCookie(res)
    throw new HttpError(401, 'Musisz się zalogować')
  }

  res.json(user)
}
