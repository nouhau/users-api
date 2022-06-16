import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions
} from '@nestjs/typeorm';
import { User } from '../common/entities/User';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get('DATABASE_HOST'),
      port: configService.get('DATABASE_PORT'),
      username: configService.get('DATABASE_USER'),
      password: configService.get('DATABASE_PASSWORD'),
      database: configService.get('DATABASE_NAME'),
      ssl: {
        rejectUnauthorized: false
      },
      entities: [
        User
      ],
      migrations: [
        '../common/migrations/*.{js,ts}'
      ],
      logging: true
    };
  }
};
