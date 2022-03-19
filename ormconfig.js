module.exports = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // ssl: {
  //   // DO NOT DO THIS
  //   // set up your ca correctly to trust the connection
  //   rejectUnauthorized: false
  // },
  entities: [
    process.env.PORT === 5001
      ? 'src/common/entities/*.ts'
      : 'build/common/entities/*.js'
  ],
  migrations: [
    process.env.PORT === 5001 || !process.env.PORT
      ? 'src/config/migrations/*.ts'
      : 'build/config/migrations/*.js'

  ],
  cli: {
    migrationsDir: 'src/config/migrations',
    entitiesDir: 'src/common/entities'
  }
}
