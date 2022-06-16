import { Test, TestingModule } from '@nestjs/testing';
import { getMockUserModel } from '../../__mocks__/mockUserModel';
import { JwtStrategy } from './jwt.strategy'

describe('JwtStrategy', () => {
  let service: JwtStrategy;

  beforeEach(async () => {
    process.env.TOKEN = 'somesecret'
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy]
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be return a user, when user is authenticated', async () => {
    const mockUser = getMockUserModel({})
    const user = await service.validate(mockUser)
    expect(user).toMatchObject(mockUser)
  })
});
