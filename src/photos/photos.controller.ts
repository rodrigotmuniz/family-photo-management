import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { PhotosService } from './photos.service'
import { UpdatePhotoDto } from './dto/update-photo.dto'
import { CreatePhotoDto } from './dto/create-photo.dto'
import { JwtAuthGuard } from '@app/my-library/guards/jwt.guard'

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @Post()
  create(@Body() createPhotoDto: CreatePhotoDto) {
    return this.photosService.create(createPhotoDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.photosService.remove(id)
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.photosService.findById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updatePhotoDto: UpdatePhotoDto) {
    return this.photosService.update(id, updatePhotoDto)
  }
}
