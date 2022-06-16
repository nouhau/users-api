import { Logger, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { AdminStrategy } from './strategy/admin.strategy';

@Module({
  imports: [
    UserModule, 
    PassportModule,
    JwtModule
  ],
  providers: [
    AuthService, 
    LocalStrategy,
    JwtStrategy,
    AdminStrategy,
    Logger
  ],
  controllers: [AuthController]
})
export class AuthModule {}
