import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import goalsRoutes from './routes/goals.js'
import healthRoutes from './routes/health.js'

/**
 * Aplikacja Express bez nasłuchiwania na porcie. Osobno od index.ts, żeby testy (Supertest)
 * mogły z niej korzystać bez uruchamiania serwera (ADR-018).
 */
export const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/goals', goalsRoutes)

app.use('/api', notFoundHandler)
app.use(errorHandler)
