import type { CookieOptions, Response } from 'express'
import { config } from '../config.js'

export const AUTH_COOKIE_NAME = 'sg_token'

const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: config.isProduction,
  path: '/',
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, { ...cookieOptions, maxAge: config.authTokenMaxAgeMs })
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, cookieOptions)
}
