import { Request, Response, NextFunction } from 'express'
import { userRole } from '../common/constants/userRole'
import { LoggerService } from '../common/LoggerService'

const logger = new LoggerService()

export function verifyAdmin (request: Request, response: Response, next: NextFunction) {
  logger.trace(
    'Validating user',
    'verifyAdmin'
  )

  if (request.body.auth.role === userRole.ADMIN) {
    return next()
  }

  return response.status(401).json({
    error: 'User not authorized'
  })
}
