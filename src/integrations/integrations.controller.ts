import { Controller, Get, Param, UseFilters } from '@nestjs/common'
import { IntegrationsService } from './integrations.service'

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  findAllUsernames() {
    return this.integrationsService.findAllUsernames()
  }
}
