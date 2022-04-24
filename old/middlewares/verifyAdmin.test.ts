import { NextFunction, Request } from 'express'
import { makeMockResponse } from '../__mocks__/mockResponse'
import { verifyAdmin } from './verifyAdmin'

describe('verifyAdmin', () => {
  const response = makeMockResponse()
  const nextFunction: NextFunction = jest.fn()

  it('should call NextFunction if role of user is admin', () => {
    const request = ({
      body: {
        auth: {
          role: 'admin',
          sub: '123456'
        }
      }
    }) as Request

    verifyAdmin(request, response, nextFunction)

    expect(nextFunction).toHaveBeenCalled()
  })

  it('should return status 401 when dont be role admin', () => {
    const request = ({
      body: {
        auth: {
          role: 'user',
          sub: '123456'
        }
      }
    }) as Request

    verifyAdmin(request, response, nextFunction)

    expect(nextFunction).not.toHaveBeenCalled()
    expect(response.state.status).toBe(401)
  })
})
