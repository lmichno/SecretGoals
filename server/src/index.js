import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import healthRoutes from './routes/health.js'
import goalsRoutes from './routes/goals.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.use('/api/health', healthRoutes)
app.use('/api/goals', goalsRoutes)

app.listen(PORT, () => {
  console.info(`Serwer Express działa na http://localhost:${PORT}`)
})
