import { UserModel } from '../../user/model/user.model';

export interface AuthRequest {
  body: {
    email: string,
    password: string
  },
  user: UserModel
}
