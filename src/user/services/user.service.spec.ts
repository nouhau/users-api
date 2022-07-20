import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcryptjs'
import { User } from '../../common/entities/User'
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getMockUserRequest } from '../../__mocks__/mockUserRequest';
import { getMockUserModel } from '../../__mocks__/mockUserModel';
import { userRole } from '../../common/constants/userRole';
import { randomUUID } from 'crypto';
import { Logger } from '@nestjs/common';

jest.mock('bcryptjs')

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Repository<User>
  let mockLogger: Logger

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn()
          }
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn()
          }
        },
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    mockLogger = module.get<Logger>(Logger)
    mockUserRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN)
  });

  it('should return a new user', async () => {
    const mockUserRequest = getMockUserRequest()
    const mockUserReturn = {
      ...mockUserRequest,
      user_id: randomUUID().toString()
    }

    jest.spyOn(mockUserRepository, 'save').mockImplementation(() => Promise.resolve(mockUserReturn))
    const user = await service.createUser(mockUserRequest)
    expect(user).not.toHaveProperty('password')
    expect(mockLogger.log).toBeCalledWith(
      `Creating user with email: ${mockUserRequest.email}, name: ${mockUserRequest.name}, role: ${mockUserRequest.role}`
    )
    expect(mockLogger.log).toBeCalledWith(
      `User created ${mockUserReturn.user_id}`
    )
    expect(user.user_id).toBeDefined()
    expect(user).toMatchObject({
      name: 'string',
      email: 'email@email.com',
      role: userRole.ADMIN
    })
  });

  it('should return a user when exists', async () => {
    const mockUserId = randomUUID().toString()
    const mockUser = getMockUserModel({user_id: mockUserId})
    jest.spyOn(mockUserRepository, 'findOne').mockImplementation(() => Promise.resolve({
      ...mockUser,
      password: '123456'
    }))
    const user = await service.getUserById(mockUserId)
    expect(mockLogger.log).toBeCalledWith(
      `Getting user with userId: ${mockUserId}`
    )
    expect(mockLogger.log).toBeCalledWith(
      `User founded: ${mockUser.user_id}`
    )
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        user_id: mockUserId
      }
    })
    expect(user).not.toHaveProperty('password')
    expect(user.user_id).toBe(mockUserId)
    expect(user).toMatchObject({
      name: 'string',
      email: 'email@email.com',
      role: userRole.ADMIN
    })
  })

  it('should be return true, when password is correct', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))
    const validate = await service.validatePassword('123456', '3n1cr2pt34ed56')
    expect(mockLogger.log).toBeCalledWith(`Validating user`)
    expect(validate).toBeTruthy()
  })

  it('should be return false, when password is wrong', async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false))
    const validate = await service.validatePassword('wrong-password', '3n1cr2pt34ed56')
    expect(mockLogger.log).toBeCalledWith(`Validating user`)
    expect(validate).not.toBeTruthy()
  })

  it('should return a user when email and password are match', async () => {
    const mockUser = getMockUserModel({})
    jest.spyOn(mockUserRepository, 'findOne').mockImplementation(() => Promise.resolve({
      ...mockUser,
      password: '3n1cr2pt34ed56'
    }))
    jest.spyOn(service, 'validatePassword').mockImplementation(() => Promise.resolve(true))
    const user = await service.getAuthUser('email@email.com', '123456')
    expect(mockLogger.log).toBeCalledWith(
      `Getting user with email: ${mockUser.email}`
    )
    expect(mockLogger.log).toBeCalledWith(
      `User founded: ${mockUser.user_id}`
    )
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        email: 'email@email.com'
      }
    })
    expect(user).not.toHaveProperty('password')
    expect(user.user_id).toBeDefined()
    expect(user).toMatchObject({
      name: 'string',
      email: 'email@email.com',
      role: userRole.ADMIN
    })
  })

  it('should return null when user with email does not exist', async () => {
    jest.spyOn(mockUserRepository, 'findOne').mockImplementation(() => Promise.resolve(null))
    const user = await service.getAuthUser('email@email.com', '123456')
    expect(mockLogger.log).toBeCalledWith(
      `Getting user with email: email@email.com`
    )
    expect(mockLogger.error).toBeCalledWith(
      `Error to get authenticate user with email: email@email.com`
    )
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        email: 'email@email.com'
      }
    })
    expect(user).toBeNull()
  })

  it('should return a null when email and password does not match', async () => {
    const mockUser = getMockUserModel({})
    jest.spyOn(mockUserRepository, 'findOne').mockImplementation(() => Promise.resolve({
      ...mockUser,
      password: '3n1cr2pt34ed56'
    }))
    jest.spyOn(service, 'validatePassword').mockImplementation(() => Promise.resolve(false))
    const user = await service.getAuthUser('email@email.com', 'wrong-password')
    expect(mockLogger.log).toBeCalledWith(
      `Getting user with email: ${mockUser.email}`
    )
    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: {
        email: 'email@email.com'
      }
    })
    expect(mockLogger.error).toBeCalledWith(
      `Error to get authenticate user with email: email@email.com`
    )
    expect(user).toBeNull()
  })

  it('should return all user with role student', async () => {
    const mockStudent = {
      ...getMockUserModel({role: userRole.STUDENT}),
      password: '123456',
    }
    const anotherMockStudent = {
      ...getMockUserModel({role: userRole.STUDENT}),
      password: '123456',
    }
    const mockFindReturn = [mockStudent, anotherMockStudent]
    jest.spyOn(mockUserRepository, 'find').mockImplementation(() => Promise.resolve(mockFindReturn))
    const students = await service.getStudents()
    expect(mockLogger.log).toBeCalledWith(
      `Finding students`
    )
    expect(mockLogger.log).toBeCalledWith(
      `Total students find: ${mockFindReturn.length}`
    )
    expect(mockUserRepository.find).toHaveBeenCalledWith({
      where: {
        role: userRole.STUDENT
      }
    })
    expect(students).toMatchObject(mockFindReturn)
    students.forEach(student => {
      expect(student).not.toHaveProperty('password')
      expect(student.role).toBe(userRole.STUDENT)
    })
  })

  it('should return all user with role student and companyId', async () => {
    const mockCompanyId = randomUUID()
    const mockStudent = {
      ...getMockUserModel({role: userRole.STUDENT}),
      password: '123456',
      company_id: mockCompanyId
    }
    const anotherMockStudent = {
      ...getMockUserModel({role: userRole.STUDENT}),
      password: '123456',
      company_id: mockCompanyId
    }
    const mockFindReturn = [mockStudent, anotherMockStudent]
    jest.spyOn(mockUserRepository, 'find').mockImplementation(() => Promise.resolve(mockFindReturn))
    const students = await service.getStudentsByCompany(mockCompanyId)
    expect(mockLogger.log).toBeCalledWith(
      `Finding students by companyId: ${mockCompanyId }`
    )
    expect(mockLogger.log).toBeCalledWith(
      `Total students find: ${mockFindReturn.length}`
    )
    expect(mockUserRepository.find).toHaveBeenCalledWith({
      where: {
        role: userRole.STUDENT,
        company_id: mockCompanyId
      }
    })
    expect(students).toMatchObject(mockFindReturn)
    students.forEach(student => {
      expect(student).not.toHaveProperty('password')
      expect(student.role).toBe(userRole.STUDENT)
    })
  })
});
