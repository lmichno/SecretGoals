import { defineConfig } from 'vitest/config'

// Testy API (ADR-018). Osobna baza test.db, żeby nie ruszać dev.db.
// Zmienne ustawiamy tutaj, bo dotenv nie nadpisuje już ustawionych, a .env.* jest w .gitignore.
export default defineConfig({
  test: {
    env: {
      DATABASE_URL: 'file:./prisma/test.db',
      JWT_SECRET: 'sekret-tylko-do-testow',
      NODE_ENV: 'test',
    },
    globalSetup: './test/globalSetup.ts',
    include: ['test/**/*.test.ts'],
    // Wszystkie pliki korzystają z jednej bazy, więc bez równoległości
    fileParallelism: false,
  },
})
