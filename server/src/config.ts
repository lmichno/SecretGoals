import dotenv from 'dotenv'

dotenv.config()

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Brak zmiennej środowiskowej ${name}. Uzupełnij server/.env (wzór: .env.example).`
    )
  }
  return value
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  isProduction: process.env.NODE_ENV === 'production',
  jwtSecret: requireEnv('JWT_SECRET'),
  /** Czas ważności tokenu i ciasteczka (ADR-008: 7 dni) */
  authTokenMaxAgeMs: 7 * 24 * 60 * 60 * 1000,
}
