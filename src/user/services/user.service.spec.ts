import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from '../../common/entities/User'
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Repository<User>

  const USER_REPOSITORY_TOKEN = getRepositoryToken(User)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            save: jest.fn(),
          }
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
    mockUserRepository = module.get<Repository<User>>(USER_REPOSITORY_TOKEN)
  });

  it('should return a new user', async () => {
    jest.spyOn(mockUserRepository, 'save').mockImplementation(() => Promise.resolve({
      user_id: '1',
      name: 'string',
      email: 'email',
      password: '12456',
      role: 'admin'
    }))
    const user = await service.createUser('user')
    expect(user).toMatchObject({
      user_id: '1',
      name: 'string',
      email: 'email',
      role: 'admin'
    })
  });
});
