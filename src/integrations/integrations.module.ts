import { Module } from '@nestjs/common'
import { IntegrationsService } from './integrations.service'
import { IntegrationsController } from './integrations.controller'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { MyLibraryModule } from '@app/my-library'
import configuration from './config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({ 
      load: [configuration],
      expandVariables: true,
    }),
    HttpModule,
    MyLibraryModule,
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
 