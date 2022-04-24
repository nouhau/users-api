import { Router } from 'express'
import { GetTokenController } from '../auth/controllers/getToken.controller'

const getTokenController = new GetTokenController()

export const authRouter = Router()

authRouter.post('/login', getTokenController.handle)
