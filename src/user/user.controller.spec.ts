import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../common/entities/User';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
  let mockUserService: UserService
  let userController: UserController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {}
        }
      ]
    }).compile();

    mockUserService =  module.get<UserService>(UserService)
    userController = module.get<UserController>(UserController)
  });

  it('should return a user', async () => {
    jest.spyOn(mockUserService, 'createUser').mockImplementation(() => Promise.resolve({
      user_id: '1',
      name: 'string',
      email: 'email',
      role: 'admin'
    }))
    expect(await userController.createUser({name: 'user'})).toMatchObject({
      user_id: '1',
      name: 'string',
      email: 'email',
      role: 'admin'
    })
  });
});
