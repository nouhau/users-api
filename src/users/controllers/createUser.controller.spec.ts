import { Request } from 'express'
import { getMockUser } from '../../__mocks__/mockUser'
import { makeMockResponse } from '../../__mocks__/mockResponse'
import { CreateUserController } from './createUser.controller'

let mockExecute = jest.fn()

jest.mock('../services/createUser.service', () => {
  return {
    CreateUserService: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute
      }
    })
  }
})

describe('CreateUserController', () => {
  const userMock = getMockUser()

  const createUserController = new CreateUserController()

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

    await createUserController.handle(request, response)

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
    await createUserController.handle(request, response)
    expect(response.state.status).toBe(400)
  })

  it('should return status 500 when have server error', async () => {
    mockExecute = jest.fn().mockImplementation(() => {
      throw new Error()
    })

    await createUserController.handle(request, response)
    expect(response.state.status).toBe(500)
  })
})
