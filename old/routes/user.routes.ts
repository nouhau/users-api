import { Router } from 'express'
import { verifyAdmin } from '../middlewares/verifyAdmin'
import { verifyAuthenticated } from '../middlewares/verifyAuthenticated'
import { UserController } from '../users/controllers/user.controller'

const userController = new UserController()

export const userRouter = Router()

userRouter.get('/user/:userId', userController.getUser)
userRouter.get('/students', userController.getStudents)
userRouter.post('/user', verifyAuthenticated, verifyAdmin, userController.handle)
