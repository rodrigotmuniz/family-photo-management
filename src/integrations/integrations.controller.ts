import { Controller, Get, Param, UseFilters } from '@nestjs/common'
import { IntegrationsService } from './integrations.service'

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  // @Post()
  // create(@Body() createIntegrationDto: CreateIntegrationDto) {
  //   return this.integrationsService.create(createIntegrationDto)
  // }

  @Get()
  findAllUsernames() {
    console.log(`findAllUsernames()`)
    return this.integrationsService.findAllUsernames()
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.integrationsService.findOne(+id)
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIntegrationDto: UpdateIntegrationDto) {
  //   return this.integrationsService.update(+id, updateIntegrationDto)
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.integrationsService.remove(+id)
  // }
}
