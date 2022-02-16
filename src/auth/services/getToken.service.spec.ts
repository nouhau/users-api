import * as jsonwebtoken from 'jsonwebtoken'
import { AuthenticateUserService } from '../../users/services/authenticateUser.service'
import { getMockUser } from '../../__mocks__/mockUser'
import { GetTokenService } from './getToken.service'

jest.mock('jsonwebtoken')

describe('GetTokenService', () => {
  const userMock = getMockUser()

  const mockAuthenticateUserService: Partial<AuthenticateUserService> = {
    execute: jest.fn()
      .mockImplementation(() => Promise.resolve(userMock))
  }

  const getTokenService = new GetTokenService({
    email: userMock.email,
    password: userMock.password,
    authenticateUserService: mockAuthenticateUserService as AuthenticateUserService
  })

  it('Get token when user is authenticated', async () => {
    jest.spyOn(jsonwebtoken, 'sign')
      .mockImplementation(() => Promise.resolve('sometoken'))

    const token = await getTokenService.execute()

    expect(mockAuthenticateUserService.execute).toHaveBeenCalled()
    expect(jsonwebtoken.sign).toHaveBeenCalled()
    expect(token).toBe('sometoken')
  })
})
