import { Test, TestingModule } from '@nestjs/testing';
import { getMockUserModel } from '../__mocks__/mockUserModel';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: {
            getToken: jest.fn()
          }
        }
      ]
    }).compile();

    mockAuthService = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should return a token', async () => {
    const mockUser = getMockUserModel({})
    jest.spyOn(mockAuthService, 'getToken').mockImplementation(() => Promise.resolve({
      token: 'token'
    }))
    const token = await controller.login({
      user: mockUser
    })

    expect(token).toMatchObject({
      token: 'token'
    })
  });
});
