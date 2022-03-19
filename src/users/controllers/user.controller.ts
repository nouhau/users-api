import { Request, Response } from 'express'
import { validateOrReject } from 'class-validator'
import { LoggerService } from '../../common/LoggerService'
import { UserRequest } from '../dto/userRequest.dto'
import { UserService } from '../services/user.service'

export class UserController {
  private logger: LoggerService = new LoggerService()

  async handle (request: Request, response: Response): Promise<Response> {
    const userRequest: UserRequest = new UserRequest(request.body)
    const userService = new UserService({})

    return await validateOrReject(userRequest)
      .then(async () => {
        return await userService.createUser(
          userRequest.name,
          userRequest.email,
          userRequest.password,
          userRequest.email
        )
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

  async getStudents(request: Request, response: Response): Promise<Response> {
    const userService = new UserService({})
    return await userService.getStudents()
      .then(students => {
        return response.status(200).json({ students })
      })
      .catch(error => {
        return response.status(500).json({ message: 'Error' })
      })
  }
}
