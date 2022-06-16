import { UserRequest } from '../user/dto/userRequest.dto'

export const getMockUserRequest = (
  name = 'string',
  email = 'email@email.com',
  password = '123456',
  role = 'admin'
): UserRequest => ({
  name,
  email,
  password,
  role
})
