import { compare, hash, hashSync } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Prisma } from '@prisma/client'
import { config } from '../config.js'
import prisma from '../prisma.js'
import { HttpError } from '../utils/httpError.js'
import { generateUniqueAlias } from './aliasService.js'

const BCRYPT_COST = 10

/** Dane zalogowanego o sobie. Jedyne miejsce, w którym zwracamy e-mail (ADR-007). */
const currentUserSelect = {
  id: true,
  alias: true,
  email: true,
} satisfies Prisma.UserSelect

export type CurrentUser = Prisma.UserGetPayload<{ select: typeof currentUserSelect }>

// Porównujemy hasło także wtedy, gdy konta nie ma, żeby czas odpowiedzi nie zdradzał,
// czy e-mail jest zarejestrowany.
const DUMMY_PASSWORD_HASH = hashSync('secretgoals-dummy-password', BCRYPT_COST)

export interface Credentials {
  email: string
  password: string
}

export async function registerUser({ email, password }: Credentials): Promise<CurrentUser> {
  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existing) {
    throw new HttpError(409, 'Konto z tym adresem e-mail już istnieje', {
      email: 'Ten adres e-mail jest już zajęty',
    })
  }

  const passwordHash = await hash(password, BCRYPT_COST)

  for (let attempt = 0; attempt < 3; attempt++) {
    const alias = await generateUniqueAlias()
    try {
      return await prisma.user.create({
        data: { email, passwordHash, alias },
        select: currentUserSelect,
      })
    } catch (error) {
      if (!isUniqueConstraintError(error)) throw error
      const target = error.meta?.target
      const fields = Array.isArray(target) ? target : [String(target)]
      // Ktoś w tym samym momencie zarejestrował ten e-mail
      if (fields.some((field) => String(field).includes('email'))) {
        throw new HttpError(409, 'Konto z tym adresem e-mail już istnieje', {
          email: 'Ten adres e-mail jest już zajęty',
        })
      }
      // Kolizja aliasu: losujemy jeszcze raz
    }
  }
  throw new Error('Nie udało się utworzyć konta z unikalnym aliasem')
}

/** Zwraca użytkownika, gdy e-mail i hasło pasują, w przeciwnym razie null. */
export async function verifyCredentials({
  email,
  password,
}: Credentials): Promise<CurrentUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { ...currentUserSelect, passwordHash: true },
  })

  const passwordMatches = await compare(password, user?.passwordHash ?? DUMMY_PASSWORD_HASH)
  if (!user || !user.passwordHash || !passwordMatches) return null

  return { id: user.id, alias: user.alias, email: user.email }
}

export function findCurrentUser(userId: string): Promise<CurrentUser | null> {
  return prisma.user.findUnique({ where: { id: userId }, select: currentUserSelect })
}

export function signAuthToken(userId: string): string {
  return jwt.sign({}, config.jwtSecret, {
    subject: userId,
    expiresIn: Math.floor(config.authTokenMaxAgeMs / 1000),
    algorithm: 'HS256',
  })
}

/** Zwraca id użytkownika z poprawnego tokenu albo null (zły podpis, wygasł, zły format). */
export function verifyAuthToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] })
    if (typeof payload === 'string' || typeof payload.sub !== 'string') return null
    return payload.sub
  } catch {
    return null
  }
}

function isUniqueConstraintError(error: unknown): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}
