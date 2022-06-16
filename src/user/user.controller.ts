import { Body, Controller, Get, Logger, Param, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { hash } from 'bcryptjs'
import { UserRequest } from './dto/userRequest.dto';
import { UserModel } from './model/user.model';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly logger: Logger = new Logger(UserController.name)
  ) {}

  @UseGuards(AuthGuard('authAdmin'))
  @Post()
  async createUser(@Body(new ValidationPipe()) body: UserRequest): Promise<UserModel> {
    this.logger.log(
      `Request received with with email: ${body.email}, name: ${body.name}, role: ${body.role}`
    )
    
    const originalPassword: string = body.password
    const hashType: number = 8
    
    const password: string = await hash(originalPassword, hashType)

    body.password = password

    return this.userService.createUser(body)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/:userId')
  async getUserById(@Param('userId') userId: string): Promise<UserModel> {
    this.logger.log(
      `Finding user with userId: ${userId}`
    )
    return this.userService.getUserById(userId)
  }
}
