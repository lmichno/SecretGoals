import request from 'supertest'
import { app } from '../src/app.js'
import prisma from '../src/prisma.js'

/** Usuwa wszystkich użytkowników; cele, posty i reszta znikają kaskadowo (ADR-011) */
export async function resetDatabase() {
  await prisma.user.deleteMany()
}

/**
 * Rejestruje nowe konto i zwraca agenta Supertest z ciasteczkiem sg_token,
 * więc kolejne żądania idą jako zalogowany użytkownik.
 */
export async function loggedInAgent(email = 'test@secretgoals.pl') {
  const agent = request.agent(app)
  const res = await agent.post('/api/auth/register').send({ email, password: 'haslo1234' })
  if (res.status !== 201) throw new Error(`Rejestracja w teście nie powiodła się: ${res.status}`)
  return { agent, userId: res.body.id as string }
}

export { app, prisma }
