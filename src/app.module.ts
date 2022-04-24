import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './common/entities/User';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5005,
      username: 'postgres',
      password: 'supersecretpassword',
      database: 'pg-users',
      // ssl: {
      //   rejectUnauthorized: false
      // },
      entities: [
        User
      ],
      migrations: [
        Number(process.env.PORT) === 5001 || !process.env.PORT
          ? 'src/config/migrations/*.ts'
          : 'dist/config/migrations/*.js'

      ]
    }), 
    UserModule
  ],
})
export class AppModule {}
