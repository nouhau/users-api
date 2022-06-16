import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UserModel } from 'src/user/model/user.model';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'authAdmin') {
  constructor(
    private readonly logger: Logger = new Logger(AdminStrategy.name),
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN,
    });
  }

  async validate(payload: UserModel): Promise<UserModel> {
    this.logger.log( 
      `Validating user ${payload.user_id}`
    )

    if(payload.role !== 'admin') {
      this.logger.error(
        `Unauthorized user ${payload.user_id}, role: ${payload.role}`
      )
      throw new UnauthorizedException()
    }

    return payload
  }
}
