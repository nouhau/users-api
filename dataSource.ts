import 'dotenv/config'
import { DataSource } from 'typeorm';
import { Company } from './src/common/entities/Company';
import { User } from './src/common/entities/User';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  database: process.env.DB_NAME,
  password: process.env.DATABASE_PASSWORD,
  entities: [
    User,
    Company
  ],
  migrations: [
    '../common/migrations/*.{js,ts}'
  ],
  logging: true
})

export default dataSource;
