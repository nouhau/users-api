import { Router } from 'express'
import { verifyAdmin } from '../middlewares/verifyAdmin'
import { verifyAuthenticated } from '../middlewares/verifyAuthenticated'
import { CreateUserController } from '../users/controllers/createUser.controller'

const createUserController = new CreateUserController()

export const userRouter = Router()

userRouter.post('/user', verifyAuthenticated, verifyAdmin, createUserController.handle)
