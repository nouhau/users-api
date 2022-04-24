import getManagerMock from '../../__mocks__/getEntityManagerMock'
import { getMockUser } from '../../__mocks__/mockUser'
import { userRole } from '../constants/userRole'
import { UserRepository } from './users.repository'

describe('userRepository', () => {
  const userMock = getMockUser()
  const otherUserMock = getMockUser()

  let managerMock
  let userRepository: UserRepository

  beforeAll(async () => {
    managerMock = await getManagerMock({
      findReturn: [userMock, otherUserMock],
      findOneReturn: userMock,
      saveReturn: userMock
    })

    userRepository = new UserRepository(managerMock)
  })

  it('should call getAll method and return users array', async () => {
    const users = await userRepository.getAll()
    expect(users).toMatchObject([userMock, otherUserMock])
  })

  it('should call getById method and return user', async () => {
    const users = await userRepository.getById(userMock.user_id)
    expect(users).toMatchObject(userMock)
  })

  it('should call save method and return user created', async () => {
    const user = await userRepository.save(userMock)
    expect(user).toMatchObject(userMock)
  })

  it('should return a user when exists with email', async () => {
    const user = await userRepository.findAuthUser(userMock.email)
    expect(user).toMatchObject(userMock)
  })

  it('should return a null object when user does not exist', async () => {
    managerMock = await getManagerMock({
      findOneReturn: null
    })

    userRepository = new UserRepository(managerMock)

    const user = await userRepository.findAuthUser(userMock.email)
    expect(user).toBe(null)
  })

  it('should return users with role student', async () => {
    const mockStudents = [
      getMockUser(userRole.STUDENT),
      getMockUser(userRole.STUDENT)
    ]

    managerMock = await getManagerMock({
      findReturn: mockStudents
    })

    userRepository = new UserRepository(managerMock)

    const students = await userRepository.getStudents()
    expect(students).toBe(mockStudents)
  })
})
