import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { getMockUserModel } from '../../__mocks__/mockUserModel';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let mockUserService: UserService;
  let mockJwtService: JwtService;
  let mockLogger: Logger;

  beforeEach(async () => {
    process.env.TOKEN = 'some-secret'
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService, 
        {
          provide: Logger,
          useValue: {
            log: jest.fn()
          }
        },
        {
          provide: UserService,
          useValue: {
            getAuthUser: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    mockUserService = module.get<UserService>(UserService);
    mockJwtService = module.get<JwtService>(JwtService);
    mockLogger = module.get<Logger>(Logger);
  });

  it('should be return a user, when user is authenticated', async () => {
    const mockUser = getMockUserModel({})
    jest.spyOn(mockUserService, 'getAuthUser').mockImplementation(() => Promise.resolve(mockUser))
    const user = await service.validateUser('email@email', '123456')
    expect(mockLogger.log).toBeCalledWith(`Authenticating user with email: email@email`)
    expect(user).toMatchObject(mockUser)
  })

  it('should return a token when user is authenticated', async() => {
    const mockUser = getMockUserModel({})
    jest.spyOn(mockJwtService, 'sign').mockImplementation(() => 'token')
    const token = await service.getToken(mockUser)
    expect(mockLogger.log).toBeCalledWith(`Generating token to ${mockUser.user_id}`)
    expect(mockJwtService.sign).toHaveBeenCalledWith(
      { ...mockUser },
      { secret: 'some-secret' }
    )
    expect(token).toMatchObject({ token: 'token' })
  })
});
