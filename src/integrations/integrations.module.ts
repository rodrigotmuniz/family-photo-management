import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { IntegrationsController } from './integrations.controller'
import { IntegrationsService } from './integrations.service'
import integrationsConfig from './integrations.config'

@Module({
  imports: [
    ConfigModule.forFeature(integrationsConfig),
    HttpModule,
  ],
  controllers: [IntegrationsController],
  providers: [IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
