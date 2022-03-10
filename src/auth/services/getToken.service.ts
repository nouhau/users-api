import { sign } from 'jsonwebtoken'
import { User } from '../../common/entities/Users'
import { LoggerService } from '../../common/LoggerService'
import { AuthenticateUserService } from '../../users/services/authenticateUser.service'

interface IGetTokenService {
    authenticateUserService?: AuthenticateUserService
    email: string,
    password: string,
}

export class GetTokenService {
    private authenticateUserService: AuthenticateUserService
    private logger: LoggerService = new LoggerService()

    constructor ({
      email,
      password,
      authenticateUserService = new AuthenticateUserService({ email, password })
    }: IGetTokenService) {
      this.authenticateUserService = authenticateUserService
    }

    async execute (): Promise<string> {
      return await this.getAuthenticatedUser()
        .then(user => {
          this.logger.trace(
            'Generating token',
            this.constructor.name
          )

          return sign({
            name: user.name,
            email: user.email,
            role: user.role
          },
          process.env.TOKEN,
          {
            subject: user.user_id
          })
        })
    }

    private async getAuthenticatedUser (): Promise<User> {
      this.logger.trace(
        'Authenticating user',
        this.constructor.name
      )

      return await this.authenticateUserService.execute()
    }
}
