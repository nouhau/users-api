import { hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import { User } from '../../common/entities/Users'
import { LoggerService } from '../../common/LoggerService'
import { UserModel } from '../../common/models/user.model'
import { UserRepository } from '../../common/repositories/users.repository'

interface IUserRepository {
    userRepository?: UserRepository
}

export class UserService {
    private userRepository: UserRepository
    private logger: LoggerService = new LoggerService()

    constructor ({
      userRepository = getCustomRepository(UserRepository)
    }: IUserRepository) {
      this.userRepository = userRepository
    }

    async createUser (
      name: string,
      email: string,
      password: string,
      role: string
    ): Promise<User> {
      this.logger.trace(
        'Creating user',
        this.constructor.name
      )

      // TODO: refactor method
      return await this.userRepository.findAuthUser(email)
        .then(async user => {
          if (!user) {
            const newUser = new User(
              name,
              email,
              password,
              role
            )

            newUser.password = await hash(newUser.password, 8)

            return await this.userRepository.save(newUser)
          }

          throw new Error()
        })
    }

    async getStudents ():Promise<UserModel[]> {
      this.logger.trace(
        'Creating users with role students',
        this.constructor.name
      )

      return await this.userRepository.getStudents()
        .then(students => {
          students.forEach(student => delete student.password)
          return students
        })
    }
}
