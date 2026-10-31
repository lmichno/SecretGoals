import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { config } from './config.js'
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js'
import authRoutes from './routes/auth.js'
import goalsRoutes from './routes/goals.js'
import healthRoutes from './routes/health.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/goals', goalsRoutes)

app.use('/api', notFoundHandler)
app.use(errorHandler)

app.listen(config.port, () => {
  console.info(`Serwer Express działa na http://localhost:${config.port}`)
})
