import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
  type: process.env.PHOTO_FAMILY_DB_TYPE as 'postgres',
  host: process.env.PHOTO_FAMILY_DB_HOST,
  port: Number(process.env.PHOTO_FAMILY_DB_PORT),
  username: process.env.PHOTO_FAMILY_DB_USERNAME,
  database: process.env.PHOTO_FAMILY_DB_NAME,
  password: process.env.PHOTO_FAMILY_DB_PASSWORD,
  autoLoadEntities: Boolean(process.env.PHOTO_FAMILY_DB_AUTOLOADENTITIES),
  synchronize: Boolean(process.env.PHOTO_FAMILY_DB_SYNCHRONIZE),
}))
