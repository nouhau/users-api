import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './common/entities/User';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { typeOrmAsyncConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig), 
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(5000)
        })
      }),
    UserModule, 
    AuthModule
  ]
})
export class AppModule {}
