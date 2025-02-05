import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlbumsModule } from 'src/albums/albums.module'
import { AuthModule } from 'src/auth/auth.module'
import { IntegrationsModule } from 'src/integrations/integrations.module'
import { PhotosModule } from 'src/photos/photos.module'
import { GlobalAgnosticFilter } from './filters/global-agnostic.filter'
import { QueryFailedErrorFilter } from './filters/query-failed-error.filter'

@Module({
  imports: [
    IntegrationsModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: process.env.PHOTO_FAMILY_DB_TYPE as 'postgres',
      host: process.env.PHOTO_FAMILY_DB_HOST,
      port: Number(process.env.PHOTO_FAMILY_DB_PORT),
      username: process.env.PHOTO_FAMILY_DB_USERNAME,
      database: process.env.PHOTO_FAMILY_DB_NAME,
      password: process.env.PHOTO_FAMILY_DB_PASSWORD,
      autoLoadEntities: Boolean(process.env.PHOTO_FAMILY_DB_AUTOLOADENTITIES),
      synchronize: Boolean(process.env.PHOTO_FAMILY_DB_SYNCHRONIZE),
    }),
    PhotosModule,
    AlbumsModule,
    PhotosModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalAgnosticFilter,
    },
    {
      provide: APP_FILTER,
      useClass: QueryFailedErrorFilter,
    },
  ],
})
export class AppModule {}
