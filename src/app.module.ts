import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { GlobalAgnosticFilter } from './commons/filters/global-agnostic.filter'
import { IntegrationsModule } from './integrations/integrations.module'
import { PhotosModule } from './photos/photos.module';
import { AlbumsModule } from './albums/albums.module';

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
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalAgnosticFilter,
    },
    AppService,
  ],
})
export class AppModule {}
