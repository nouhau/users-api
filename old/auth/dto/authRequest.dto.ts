import { IsNotEmpty } from 'class-validator'
import { errorCodes } from '../../common/errorCodes'

export class AuthRequest {
  @IsNotEmpty({ message: errorCodes.EMAIL_REQUIRED })
  email: string

  @IsNotEmpty({ message: errorCodes.PASSWORD_REQUIRED })
  password: string

  constructor (body: {
    email: string,
    password: string
  }) {
    this.email = body.email
    this.password = body.password
  }
}
