import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto';
import { User } from '../common/entities/User';
import { getMockUserModel } from '../__mocks__/mockUserModel';
import { getMockUserRequest } from '../__mocks__/mockUserRequest';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

jest.mock('bcryptjs')

describe('UserController', () => {
  let mockUserService: UserService
  let userController: UserController
  let mockLogger: Logger

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {}
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn()
          }
        }
      ]
    }).compile();

    mockUserService =  module.get<UserService>(UserService)
    mockLogger = module.get<Logger>(Logger)
    userController = module.get<UserController>(UserController)
  });

  it('should return a user', async () => {
    const mockUserRequest = getMockUserRequest()
    const mockUserReturn = getMockUserModel({})
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('3ncrypt3d'))
    jest.spyOn(mockUserService, 'createUser').mockImplementation(() => Promise.resolve(mockUserReturn))
    const response = await userController.createUser(mockUserRequest)
    expect(mockLogger.log).toHaveBeenCalledWith(
      `Request received with with email: ${mockUserRequest.email}, name: ${mockUserRequest.name}, role: ${mockUserRequest.role}`
    )
    expect(response.user_id).toBeDefined()
    expect(response).toMatchObject({
      name: 'string',
      email: 'email@email.com',
      role: 'admin'
    })
  });

  it('should return a user with id', async () => {
    const mockUserId = randomUUID()
    const mockUser = getMockUserModel({user_id: mockUserId})
    jest.spyOn(mockUserService, 'getUserById').mockImplementation(() => Promise.resolve(mockUser))
    const response = await userController.getUserById(mockUserId)
    expect(mockLogger.log).toHaveBeenCalledWith(
      `Finding user with userId: ${mockUserId}`
    )
    expect(response).toMatchObject(mockUser)
    expect(response.user_id).toBe(mockUserId)
  })
});
