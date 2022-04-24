import 'reflect-metadata'
import express, { Response, Request, NextFunction } from 'express'
import createConnection from './config/database'
import { userRouter } from './routes/user.routes'
import { authRouter } from './routes/token.routes'

createConnection()
const server = express()
server.use(express.json())

const PORT = process.env.PORT || 5000

server.use((error: Error, request: Request, response: Response, next: NextFunction) => {
  if (error instanceof Error) {
    return response.status(400).json({
      error: error.message
    })
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  })
})

server.use(function (request: Request, response: Response, next: NextFunction) {
  response.header('Access-Control-Allow-Origin', '*')
  response.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST')
  response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

server.use(
  authRouter,
  userRouter
)

server.get('/', (request: Request, response: Response) => {
  return response.status(200).json({ message: 'Wellcome' })
})

server.listen(PORT, () => {
  console.log(`Server on port ${PORT} \nhttp://localhost:${PORT}`)
})
