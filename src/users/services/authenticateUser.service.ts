import { getCustomRepository } from 'typeorm'
import { User } from '../../common/entities/Users'
import { LoggerService } from '../../common/LoggerService'
import { UserRepository } from '../../common/repositories/users.repository'

interface IUserRepository {
    userRepository?: UserRepository,
    email: string,
    password: string
}

export class AuthenticateUserService {
    private userRepository: UserRepository
    private email: string
    private password: string
    private logger: LoggerService = new LoggerService()

    constructor ({
      userRepository = getCustomRepository(UserRepository),
      email,
      password
    }: IUserRepository) {
      this.userRepository = userRepository
      this.email = email
      this.password = password
    }

    async execute (): Promise<User> {
      this.logger.trace(
        'Getting user authenticated',
        this.constructor.name
      )

      return await this.userRepository.findAuthUser(this.email, this.password)
    }
}
