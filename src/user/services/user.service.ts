import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../common/entities/User';
import { Repository } from 'typeorm';
import { UserModel } from '../model/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ){}

  createUser = async (name: string): Promise<UserModel> => {
    const user: User = await this.userRepository.save(new User(name, 'test@email', '123456', 'student'))
    delete user.password
    return user
  }
}
