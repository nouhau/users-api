import { getConnection } from 'typeorm'
import createConnection from '../../config/database'
import { getMockUser } from '../../__mocks__/mockUser'
import { AuthenticateUserService } from './authenticateUser.service'

jest.mock('../../common/repositories/users.repository')

const userMockRepository = require('../../common/repositories/users.repository')

describe('AuthenticateUserService', () => {
  let authenticateUseService

  const userMock = getMockUser()

  beforeEach(async () => {
    await createConnection()
    authenticateUseService = new AuthenticateUserService({
      userRepository: userMockRepository,
      email: userMock.email,
      password: userMock.password
    })
  })

  afterEach(async () => {
    const connection = getConnection()
    await connection.close()
  })

  it('Get user with email and password matches', async () => {
    userMockRepository.findAuthUser = jest.fn()
      .mockImplementation(() => Promise.resolve(userMock))

    const user = await authenticateUseService.execute()

    expect(userMockRepository.findAuthUser).toHaveBeenCalled()
    expect(user).toMatchObject(userMock)
  })
})
