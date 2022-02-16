import { getCustomRepository } from 'typeorm'
import { User } from '../../common/entities/Users'
import { LoggerService } from '../../common/LoggerService'
import { UserRepository } from '../../common/repositories/users.repository'

interface IUserRepository {
    userRepository?: UserRepository,
    name: string,
    email: string,
    password: string,
    role: string
}

export class CreateUserService {
    private userRepository: UserRepository
    private user: User
    private logger: LoggerService = new LoggerService()

    constructor ({
      userRepository = getCustomRepository(UserRepository),
      name,
      email,
      password,
      role
    }: IUserRepository) {
      this.userRepository = userRepository
      this.user = new User(name, email, password, role)
    }

    async execute (): Promise<User> {
      this.logger.trace(
        'Creating user',
        this.constructor.name
      )

      return await this.userRepository.save(this.user)
    }
}
