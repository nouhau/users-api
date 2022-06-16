import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { User } from '../common/entities/User';

console.log(process.env.DATABASE_HOST)

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
      // ssl: {
      //   rejectUnauthorized: false
      // },
      entities: [
        User
      ],
      migrations: [
        '../common/migrations/*.{js,ts}'
      ],
      cli: {
        migrationsDir: '../common/migrations',
        entitiesDir: '../common/entities'
      },
      logging: true
    };
  }
};

export const typeOrmConfig = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  database: process.env.DB_NAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [
    User
  ],
  migrations: [
    '../common/migrations/*.{js,ts}'
  ],
  cli: {
    migrationsDir: '../common/migrations',
    entitiesDir: '../common/entities'
  },
  logging: true
};
