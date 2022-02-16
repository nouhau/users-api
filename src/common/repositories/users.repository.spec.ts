import getManagerMock from '../../__mocks__/getEntityManagerMock'
import { getMockUser } from '../../__mocks__/mockUser'
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

  it('should return a user when name and password match', async () => {
    const user = await userRepository.findAuthUser(userMock.email, userMock.password)
    expect(user).toMatchObject(userMock)
  })

  it('should return a null object password not match with exists password', async () => {
    managerMock = await getManagerMock({
      findOneReturn: null
    })

    userRepository = new UserRepository(managerMock)

    const user = await userRepository.findAuthUser(userMock.email, '1234')
    expect(user).toBe(null)
  })

  it('should return a null object when user does not exist', async () => {
    managerMock = await getManagerMock({
      findOneReturn: null
    })

    userRepository = new UserRepository(managerMock)

    const user = await userRepository.findAuthUser('User not exists', '1234')
    expect(user).toBe(null)
  })
})
