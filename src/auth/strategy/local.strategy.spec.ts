import { Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { getMockUserModel } from '../../__mocks__/mockUserModel';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from './local.strategy'

describe('LocalStrategy', () => {
  let service: LocalStrategy;
  let mockAuthService: AuthService;
  let mockLogger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy, 
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<LocalStrategy>(LocalStrategy);
    mockAuthService = module.get<AuthService>(AuthService);
    mockLogger = module.get<Logger>(Logger);
  });

  it('should be return a user, when user is authenticated', async () => {
    const mockUser = getMockUserModel({})
    jest.spyOn(mockAuthService, 'validateUser').mockImplementation(() => Promise.resolve(mockUser))
    const user = await service.validate('email@email', '123456')
    expect(mockLogger.log).toHaveBeenCalledWith(`Validating user email@email`)
    expect(user).toMatchObject(mockUser)
  })

  it('should throw a error when user is not authenticated', async() => {
    jest.spyOn(mockAuthService, 'validateUser').mockImplementation(() => Promise.resolve(null))

    await expect(service.validate('email@email', '123456')).rejects.toThrow(
      new UnauthorizedException()
    )
    expect(mockLogger.error).toHaveBeenCalledWith(`Invalid email or password for email@email`)

  })
});
