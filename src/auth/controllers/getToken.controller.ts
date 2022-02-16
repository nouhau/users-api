import { Request, Response } from 'express'
import { validateOrReject } from 'class-validator'
import { LoggerService } from '../../common/LoggerService'
import { AuthRequest } from '../dto/authRequest.dto'
import { GetTokenService } from '../services/getToken.service'

export class GetTokenController {
  private logger: LoggerService = new LoggerService()

  async handle (request: Request, response: Response): Promise<Response> {
    console.log(request.body)
    const authRequest: AuthRequest = new AuthRequest(request.body)
    const getTokenService = new GetTokenService(request.body)

    return await validateOrReject(authRequest)
      .then(async () => {
        return await getTokenService.execute()
          .then(token => {
            return response.status(200).json({ token })
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
