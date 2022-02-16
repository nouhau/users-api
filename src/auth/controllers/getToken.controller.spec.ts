import { Request } from 'express'
import { getMockUser } from '../../__mocks__/mockUser'
import { makeMockResponse } from '../../__mocks__/mockResponse'
import { GetTokenController } from './getToken.controller'

let mockExecute = jest.fn()

jest.mock('../services/getToken.service', () => {
  return {
    GetTokenService: jest.fn().mockImplementation(() => {
      return {
        execute: mockExecute
      }
    })
  }
})

describe('GetTokenController', () => {
  const userMock = getMockUser()

  const createUserController = new GetTokenController()

  const request = {
    body: {
      email: userMock.email,
      password: userMock.password
    }
  } as Request

  const response = makeMockResponse()

  it('should return a token when email and password are valid', async () => {
    mockExecute = jest.fn().mockResolvedValue('token')

    await createUserController.handle(request, response)

    expect(mockExecute).toBeCalled()
    expect(response.state.status).toBe(200)
    expect(response.state.json).toMatchObject({ token: 'token' })
  })

  it('should return status 400 when email is empty', async () => {
    const request = {
      body: {
        email: '',
        password: userMock.password
      }
    } as Request
    await createUserController.handle(request, response)
    expect(response.state.status).toBe(400)
  })

  it('should return status 400 when password is empty', async () => {
    const request = {
      body: {
        email: userMock.email,
        password: ''
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
