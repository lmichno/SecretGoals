import type { Credentials } from '../services/authService.js'
import { HttpError } from './httpError.js'

// Prosty, celowo niezbyt restrykcyjny wzór: coś@coś.domena, bez spacji
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const EMAIL_MAX_LENGTH = 254
export const PASSWORD_MIN_LENGTH = 8
// bcrypt bierze pod uwagę tylko pierwsze 72 bajty hasła
const PASSWORD_MAX_BYTES = 72

/**
 * Sprawdza e-mail i hasło z body (ADR-008, ADR-009). E-mail przycinamy i zamieniamy na małe
 * litery, hasła nie zmieniamy. Przy błędach rzuca 400 z polami do wyświetlenia pod formularzem.
 */
export function parseCredentials(
  body: unknown,
  options: { checkPasswordRules: boolean }
): Credentials {
  const data = (typeof body === 'object' && body !== null ? body : {}) as Record<string, unknown>
  const fields: Record<string, string> = {}

  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : ''
  if (!email) {
    fields.email = 'Podaj adres e-mail'
  } else if (email.length > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.test(email)) {
    fields.email = 'Podaj poprawny adres e-mail'
  }

  const password = typeof data.password === 'string' ? data.password : ''
  if (!password) {
    fields.password = 'Podaj hasło'
  } else if (options.checkPasswordRules) {
    if (password.length < PASSWORD_MIN_LENGTH) {
      fields.password = `Hasło musi mieć co najmniej ${PASSWORD_MIN_LENGTH} znaków`
    } else if (Buffer.byteLength(password, 'utf8') > PASSWORD_MAX_BYTES) {
      fields.password = 'Hasło jest za długie (maksymalnie 72 znaki)'
    }
  }

  if (Object.keys(fields).length > 0) {
    throw new HttpError(400, 'Popraw zaznaczone pola', fields)
  }

  return { email, password }
}
