import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { compare } from 'bcryptjs'
import { UserModel } from '../../user/model/user.model';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly logger: Logger = new Logger(AuthService.name),
    private userService: UserService,
    private jwtService: JwtService
  ){}

  validateUser = async(email: string, password: string): Promise<UserModel>=> {
    this.logger.log(
      `Authenticating user with email: ${email}`
    )
    
    return this.userService.getAuthUser(email, password)
  }

  getToken = async(user: UserModel): Promise<{ token: string }> => {
    this.logger.log(
      `Generating token to ${user.user_id}`
    )

    const userData: UserModel = user
    const options: JwtSignOptions = { secret: process.env.TOKEN }

    const token = this.jwtService.sign(
      { ...userData }, 
      options
    )

    return { token }
  }
}
