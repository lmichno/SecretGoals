// Konfiguracja Prisma CLI (Prisma 7): adres bazy, migracje i seed (ADR-004, ADR-010).
// Prisma 7 nie wczytuje już .env sama, więc robi to dotenv.
import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
