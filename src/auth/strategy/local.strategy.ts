import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserModel } from 'src/user/model/user.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly logger: Logger = new Logger(LocalStrategy.name),
    private authService: AuthService
    ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<UserModel> {
    this.logger.log(
      `Validating user ${email}`
    )

    const user: UserModel = await this.authService.validateUser(email, password);

    if(!user) {
      this.logger.error(
        `Invalid email or password for ${email}`
      )
      throw new UnauthorizedException()
    }

    return user
  }
}
