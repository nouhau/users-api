import { Logger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../common/entities/User';
import { UserModel } from '../model/user.model';
import { UserRequest } from '../dto/userRequest.dto';
import { userRole } from '../../common/constants/userRole';
import { compare } from 'bcryptjs';

@Injectable()
export class UserService {  
  constructor(
    private readonly logger:Logger = new Logger(UserService.name),
    @InjectRepository(User) private userRepository: Repository<User>
  ){}

  createUser = async (userRequest: UserRequest): Promise<UserModel> => {
    this.logger.log(
      `Creating user with email: ${userRequest.email}, name: ${userRequest.name}, role: ${userRequest.role}`
    )

    const newUser: User = new User(
      userRequest.name,
      userRequest.email,
      userRequest.password,
      userRequest.role
    )

    const user: User = await this.userRepository.save(newUser)

    delete user.password

    this.logger.log(
      `User created ${user.user_id}`
    )

    return user
  }

  getUserById = async (userId: string): Promise<UserModel> => {
    this.logger.log(
      `Getting user with userId: ${userId}`
    )

    const user = await this.userRepository.findOne({
      where: {
        user_id: userId
      }
    })

    delete user.password

    this.logger.log(
      `User founded: ${user.user_id}`
    )

    return user
  }

  validatePassword = async (password: string, userPassword: string): Promise<boolean> => {
    this.logger.log(
      `Validating user`
    )

    const validatePassword: boolean = await compare(password, userPassword)

    return validatePassword
  }

  getAuthUser = async (email: string, password: string): Promise<UserModel> => {
    this.logger.log(
      `Getting user with email: ${email}`
    )

    const user = await this.userRepository.findOne({
      where: {
        email
      }
    })

    if(!user){
      this.logger.error(
        `Error to get authenticate user with email: ${email}`
      )

      return null
    }

    const validatePassword: boolean = await this.validatePassword(password, user.password)

    if(!validatePassword){
      this.logger.error(
        `Error to get authenticate user with email: ${email}`
      )

      return null
    }

    delete user.password

    this.logger.log(
      `User founded: ${user.user_id}`
    )

    return user
  }

  getStudents = async(): Promise<UserModel[]> => {
    this.logger.log(
      `Finding students`
    )

    const students: UserModel[] = await this.userRepository.find({
      where: {
        role: userRole.STUDENT
      }
    })

    students.forEach((student: User) => delete student.password)

    this.logger.log(
      `Total students find: ${students.length}`
    )

    return students
  }
}
