import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common'
import { AlbumsService } from './albums.service'
import { CreateAlbumDto } from './dto/create-album.dto'
import { UpdateAlbumDto } from './dto/update-album.dto'
import { JwtAuthGuard } from '@app/my-library/guards/jwt.guard'

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Post()
  login(@Body() createAlbumDto: CreateAlbumDto) {
    return this.albumsService.create(createAlbumDto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.albumsService.remove(id)
  }

  @Get(':id')
  find(@Param('id', ParseIntPipe) id: number) {
    return this.albumsService.findById(id)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: number, @Body() updateAlbumDto: UpdateAlbumDto) {
    return this.albumsService.update(id, updateAlbumDto)
  }
}
