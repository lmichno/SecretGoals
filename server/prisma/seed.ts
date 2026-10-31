// Dane testowe do demonstracji (ADR-010). Uruchomienie: npm run prisma:seed
// Skrypt można odpalać wielokrotnie: konto demo jest tworzone tylko raz.
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'demo@secretgoals.pl'
const DEMO_PASSWORD = 'demo1234'

async function main() {
  const demo = await prisma.user.upsert({
    where: { email: DEMO_EMAIL },
    update: {},
    create: {
      email: DEMO_EMAIL,
      passwordHash: await hash(DEMO_PASSWORD, 10),
      alias: 'CichyLis42',
    },
  })

  await prisma.user.upsert({
    where: { alias: 'ZespolSecretGoals' },
    update: {},
    create: { alias: 'ZespolSecretGoals', role: 'team' },
  })

  const goalsCount = await prisma.goal.count({ where: { userId: demo.id } })
  if (goalsCount === 0) {
    await prisma.goal.create({
      data: {
        userId: demo.id,
        title: 'Codzienne czytanie',
        description: '20 minut czytania każdego dnia',
        type: 'daily_streak',
        category: 'nauka',
      },
    })
  }

  console.info(`Seed gotowy. Konto demo: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
