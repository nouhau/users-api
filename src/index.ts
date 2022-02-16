import 'reflect-metadata'
import express from 'express'
import createConnection from './config/database'
import { userRouter } from './routes/user.routes'
import { authRouter } from './routes/token.routes'

createConnection()
const server = express()
server.use(express.json())

const PORT = process.env.PORT || 5000

server.use(
  userRouter,
  authRouter
)

server.listen(PORT, () => {
  console.log(`Server on port ${PORT} \nhttp://localhost:${PORT}`)
})
