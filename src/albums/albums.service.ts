import { IAlbum } from '@app/my-library/interfaces/album.interface'
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateAlbumDto } from './dto/create-album.dto'
import { Album } from './entities/album.entity'
import { UpdateAlbumDto } from './dto/update-album.dto'

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly repository: Repository<Album>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto) {
    const createAlbum = this.repository.create({
      title: createAlbumDto.title,
      user: { id: createAlbumDto.userId },
    })
    const savedAlbum = this.repository.save(createAlbum)
    return savedAlbum
  }

  async createMany(albums: IAlbum[]) {
    const createAlbums = this.repository.create(albums)
    const savedAlbums = this.repository.save(createAlbums)
    return savedAlbums
  }

  async findById(id: number) {
    const album = await this.repository.findOne({ where: {id}, relations: ['photos'] })

    if (!album) throw new NotFoundException(`Album with id: ${id} was not found.`)
    return album
  }

  async remove(id: number) {
    // try {
      const result = await this.repository.delete({ id })
      if (result.affected === 0) {
        throw new NotFoundException(`Album with id ${id} was not found`)
      }
      return { message: 'Album deleted successfully!' }
    // } catch(error) {
    //   console.log(error)
    // }
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto) {
    const album = await this.findById(id)
    const updateAlbum = this.repository.create({
      ...album,
      ...updateAlbumDto,
    })
    const updatedAlbum = await this.repository.save(updateAlbum)
    return updatedAlbum
  }
}
