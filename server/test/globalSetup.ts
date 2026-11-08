import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const TEST_DB = fileURLToPath(new URL('../prisma/test.db', import.meta.url))

/**
 * Przed testami tworzy pustą bazę test.db z migracji (ADR-010). Usuwamy tylko plik test.db,
 * a migrate deploy nakłada migracje bez resetowania czegokolwiek, więc dev.db jest bezpieczna.
 */
export default function setup() {
  rmSync(TEST_DB, { force: true })
  rmSync(`${TEST_DB}-journal`, { force: true })
  execSync('npx prisma migrate deploy', {
    stdio: 'pipe',
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
  })
}
