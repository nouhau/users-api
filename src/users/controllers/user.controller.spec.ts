import { Request } from 'express'
import { getMockUser } from '../../__mocks__/mockUser'
import { makeMockResponse } from '../../__mocks__/mockResponse'
import { makeMockRequest } from '../../__mocks__/mockRequest'
import { UserController } from './user.controller'
import { userRole } from '../../common/constants/userRole'

let mockExecute = jest.fn()
let mockGetStudents = jest.fn()

jest.mock('../services/user.service', () => {
  return {
    UserService: jest.fn().mockImplementation(() => {
      return {
        createUser: mockExecute,
        getStudents: mockGetStudents
      }
    })
  }
})

describe('UserController', () => {
  const userMock = getMockUser()

  const userController = new UserController()

  const request = {
    body: {
      name: userMock.name,
      email: userMock.email,
      password: userMock.password,
      role: userMock.role
    }
  } as Request

  const response = makeMockResponse()

  it('should return a skill when created', async () => {
    mockExecute = jest.fn().mockResolvedValue(userMock)

    await userController.handle(request, response)

    expect(mockExecute).toBeCalled()
    expect(response.state.status).toBe(200)
    expect(response.state.json).toMatchObject(userMock)
  })

  it('should return status 400 when name is empty', async () => {
    const request = {
      body: {
        name: '',
        email: userMock.email,
        password: userMock.password,
        role: userMock.role
      }
    } as Request
    await userController.handle(request, response)
    expect(response.state.status).toBe(400)
  })

  it('should return status 500 when have server error', async () => {
    mockExecute = jest.fn().mockImplementation(() => {
      throw new Error()
    })

    await userController.handle(request, response)
    expect(response.state.status).toBe(500)
  })

  it('should return status 200 when getStudents', async () => {
    const request = { } as Request

    const mockStudents = [
      delete getMockUser(userRole.STUDENT).password,
      delete getMockUser(userRole.STUDENT).password
    ]

    mockGetStudents = jest.fn().mockResolvedValue(mockStudents)

    await userController.getStudents(request, response)
    expect(response.state.status).toBe(200)
  })

  it('should return status 200 when get user', async () => {
    const request = makeMockRequest({
      params: {
        userId: userMock.user_id
      }
    })

    mockGetStudents = jest.fn().mockResolvedValue(userMock)

    await userController.getStudents(request, response)
    expect(response.state.status).toBe(200)
  })
})
