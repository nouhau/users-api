import * as bcrypt from 'bcryptjs'
import mockConnection from '../../__mocks__/mockConnection'
import { getMockUser } from '../../__mocks__/mockUser'
import { CreateUserService } from './createUser.service'

jest.mock('bcryptjs')
jest.mock('../../common/repositories/users.repository')

const userMockRepository = require('../../common/repositories/users.repository')

describe('CreateUserService', () => {
  let createUserService

  const userMock = getMockUser()

  beforeEach(async () => {
    await mockConnection.create()
    createUserService = new CreateUserService({
      userRepository: userMockRepository,
      name: userMock.name,
      email: userMock.email,
      password: userMock.password,
      role: userMock.role
    })
  })

  afterEach(async () => {
    await mockConnection.clear()
  })

  it('Create and return a new user created', async () => {
    userMockRepository.save = jest.fn()
      .mockImplementation(() => Promise.resolve(userMock))
    userMockRepository.findAuthUser = jest.fn()
      .mockImplementation(() => Promise.resolve(undefined))

    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('3ncrypt3d'))

    const user = await createUserService.execute()

    expect(userMockRepository.save).toHaveBeenCalled()
    expect(user).toMatchObject(userMock)
  })
})
