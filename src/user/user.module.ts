import { Logger, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../common/entities/User';
import { StudentController } from './student.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [
    UserController, 
    StudentController
  ],
  providers: [
    UserService,
    Logger
  ],
  exports: [UserService]
})

export class UserModule {}
