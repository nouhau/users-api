import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { UserRequest } from './dto/userRequest.dto';
import { UserModel } from './model/user.model';
import { UserService } from './services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body(new ValidationPipe()) body: UserRequest): Promise<UserModel> {
    return await this.userService.createUser(body.name)
  }
}
