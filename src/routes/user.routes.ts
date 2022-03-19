import { Router } from 'express'
import { verifyAdmin } from '../middlewares/verifyAdmin'
import { verifyAuthenticated } from '../middlewares/verifyAuthenticated'
import { UserController } from '../users/controllers/user.controller'

const userController = new UserController()

export const userRouter = Router()

userRouter.use(verifyAuthenticated, verifyAdmin)
userRouter.post('/user', userController.handle)
userRouter.get('/students', userController.getStudents)
