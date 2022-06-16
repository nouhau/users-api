import { randomUUID } from 'crypto';
import { UserModel } from "../user/model/user.model";

export const getMockUserModel = ({
  user_id = randomUUID().toString(),
  name = 'string',
  email = 'email@email.com',
  role = 'admin'
}): UserModel => ({
  user_id,
  name,
  email,
  role
})
