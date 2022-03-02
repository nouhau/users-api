import { Request, Response } from 'express'
import { validateOrReject } from 'class-validator'
import { LoggerService } from '../../common/LoggerService'
import { UserRequest } from '../dto/userRequest.dto'
import { CreateUserService } from '../services/createUser.service'

export class CreateUserController {
  private logger: LoggerService = new LoggerService()

  async handle (request: Request, response: Response): Promise<Response> {
    const userRequest: UserRequest = new UserRequest(request.body)
    const createUserService = new CreateUserService(request.body)

    return await validateOrReject(userRequest)
      .then(async () => {
        return await createUserService.execute()
          .then(user => {
            return response.status(200).json(user)
          })
          .catch(() => {
            throw new Error()
          })
      })
      .catch((error) => {
        let errorCode: string
        if (Array.isArray(error)) {
          error.forEach(item => {
            console.log(
              `No ${item.property} is provided `,
              'Request error'
            )
            errorCode = item.constraints[Object.keys(item.constraints)[0]]
          })
        }
        if (errorCode) {
          return response.status(400).json({ message: errorCode })
        }
        return response.status(500).json({ message: 'Error' })
      })
  }
}
