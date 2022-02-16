import { Router } from 'express'
import { CreateUserController } from '../users/controllers/createUser.controller'

const createUserController = new CreateUserController()

export const userRouter = Router()

userRouter.post('/user', createUserController.handle)
