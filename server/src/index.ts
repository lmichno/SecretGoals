import { app } from './app.js'
import { config } from './config.js'

app.listen(config.port, () => {
  console.info(`Serwer Express działa na http://localhost:${config.port}`)
})
