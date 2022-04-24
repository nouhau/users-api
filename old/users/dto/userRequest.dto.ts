import { IsNotEmpty } from 'class-validator'
import { errorCodes } from '../../common/errorCodes'

export class UserRequest {
  @IsNotEmpty({ message: errorCodes.NAME_REQUIRED })
  name: string

  @IsNotEmpty({ message: errorCodes.EMAIL_REQUIRED })
  email: string

  @IsNotEmpty({ message: errorCodes.PASSWORD_REQUIRED })
  password: string

  @IsNotEmpty({ message: errorCodes.ROLE_REQUIRED })
  role: string

  constructor (body: {
    name: string,
    email: string,
    password: string,
    role: string
  }) {
    this.name = body.name
    this.email = body.email
    this.password = body.password
    this.role = body.role
  }
}
