import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  type: process.env.DB_TYPE as 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  autoLoadEntities: Boolean(process.env.DB_AUTOLOADENTITIES),
  synchronize: Boolean(process.env.DB_SYNCHRONIZE),
  dropSchema: Boolean(process.env.DB_DROP_SCHEMA)
}))
