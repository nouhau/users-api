import * as bcrypt from 'bcryptjs'
import mockConnection from '../../__mocks__/mockConnection'
import { getMockUser } from '../../__mocks__/mockUser'
import { AuthenticateUserService } from './authenticateUser.service'

jest.mock('bcryptjs')
jest.mock('../../common/repositories/users.repository')

const userMockRepository = require('../../common/repositories/users.repository')

describe('AuthenticateUserService', () => {
  let authenticateUseService

  const userMock = getMockUser()

  beforeEach(async () => {
    await mockConnection.create()
    authenticateUseService = new AuthenticateUserService({
      userRepository: userMockRepository,
      email: userMock.email,
      password: userMock.password
    })
  })

  afterEach(async () => {
    await mockConnection.clear()
  })

  it('Get user with email and password matches', async () => {
    userMockRepository.findAuthUser = jest.fn()
      .mockImplementation(() => Promise.resolve(userMock))

    jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true))

    const user = await authenticateUseService.execute()

    expect(userMockRepository.findAuthUser).toHaveBeenCalled()
    expect(user).toMatchObject(userMock)
  })
})
