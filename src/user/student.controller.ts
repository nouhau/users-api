import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserModel } from './model/user.model';
import { UserService } from './services/user.service';

@Controller('student')
export class StudentController {
  constructor(
    private userService: UserService,
    private readonly logger: Logger = new Logger(StudentController.name)
  ) {}

  @Get()
  async getStudents(): Promise<UserModel[]> {
    this.logger.log(
      `Getting students`
    )
    return this.userService.getStudents()
  }
}
