import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { config } from './config.js'
import { PrismaClient } from './generated/prisma/client.js'

// Prisma 7 łączy się z bazą przez adapter sterownika (tu better-sqlite3), a nie przez własny silnik.
// Ścieżka "file:./prisma/dev.db" jest liczona od folderu server/, tak samo jak w prisma.config.ts.
const adapter = new PrismaBetterSqlite3({ url: config.databaseUrl })

const prisma = new PrismaClient({ adapter })

export default prisma
