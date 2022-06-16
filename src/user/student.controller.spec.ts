import { Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { userRole } from '../common/constants/userRole';
import { User } from '../common/entities/User';
import { getMockUserModel } from '../__mocks__/mockUserModel';
import { UserService } from './services/user.service';
import { StudentController } from './student.controller';

describe('UserController', () => {
  let mockUserService: UserService
  let studentController: StudentController
  let mockLogger: Logger

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentController],
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
    studentController = module.get<StudentController>(StudentController)
  });

  it('should return users with role students', async () => {
    const mockStudent = getMockUserModel({role: userRole.STUDENT})
    const anotherMockStudent = getMockUserModel({role: userRole.STUDENT})
    const mockStudents = [mockStudent, anotherMockStudent]
    jest.spyOn(mockUserService, 'getStudents').mockImplementation(() => Promise.resolve(mockStudents))
    const response = await studentController.getStudents()
    expect(mockLogger.log).toHaveBeenCalledWith('Getting students')
    expect(response).toMatchObject(mockStudents)
    expect(response.length).toBe(2)
    response.forEach(student => {
      expect(student).not.toHaveProperty('password')
      expect(student.role).toBe(userRole.STUDENT)
    })
  })
});
