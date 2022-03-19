import * as bcrypt from 'bcryptjs'
import { userRole } from '../../common/constants/userRole'
import mockConnection from '../../__mocks__/mockConnection'
import { getMockUser } from '../../__mocks__/mockUser'
import { UserService } from './user.service'

jest.mock('bcryptjs')
jest.mock('../../common/repositories/users.repository')

const userMockRepository = require('../../common/repositories/users.repository')

describe('UserService', () => {
  let userService

  const userMock = getMockUser()

  beforeAll(async () => {
    await mockConnection.create()
    userService = new UserService({
      userRepository: userMockRepository
    })
  })

  afterAll(async () => {
    await mockConnection.clear()
  })

  it('Create and return a new user created', async () => {
    userMockRepository.save = jest.fn()
      .mockImplementation(() => Promise.resolve(userMock))
    userMockRepository.findAuthUser = jest.fn()
      .mockImplementation(() => Promise.resolve(undefined))

    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('3ncrypt3d'))

    const user = await userService.createUser(
      userMock.name,
      userMock.email,
      userMock.password,
      userMock.role
    )

    expect(userMockRepository.save).toHaveBeenCalled()
    expect(user).toMatchObject(userMock)
  })

  it('Get users with role student', async () => {
    const mockStudents = [
      delete getMockUser(userRole.STUDENT).password,
      delete getMockUser(userRole.STUDENT).password
    ]
    userMockRepository.getStudents = jest.fn()
      .mockImplementation(() => Promise.resolve(mockStudents))

    const user = await userService.getStudents()

    expect(userMockRepository.getStudents).toHaveBeenCalled()
    expect(user).toMatchObject(mockStudents)
  })
})
