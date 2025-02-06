import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AlbumsModule } from 'src/albums/albums.module'
import { AuthModule } from 'src/auth/auth.module'
import { IntegrationsModule } from 'src/integrations/integrations.module'
import { PhotosModule } from 'src/photos/photos.module'
import configuration from '../integrations/integrations.config'
import dbConfig from './config/database.config'
import { GlobalAgnosticFilter } from './filters/global-agnostic.filter'
import { QueryFailedErrorFilter } from './filters/query-failed-error.filter'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [process.env.NODE_ENV == 'test' ? '.env.test' : '.env'],
      load: [configuration],
      expandVariables: true,
    }),
    IntegrationsModule,
    AuthModule,
    PhotosModule,
    AlbumsModule,
    PhotosModule,
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
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
