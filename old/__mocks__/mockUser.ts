import { randomUUID } from 'crypto'
import { User } from '../common/entities/Users'
import { randomString } from '../common/randomString'

export const getMockUser = (
  role = randomString()
): User => ({
  user_id: randomUUID().toString(),
  name: randomString(),
  email: randomString(),
  password: randomString(),
  role
})
