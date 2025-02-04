import { IPhoto } from '@app/my-library/interfaces/photo.interface'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreatePhotoDto } from './dto/create-photo.dto'
import { Photo } from './entities/photo.entity'
import { UpdateAlbumDto } from 'src/albums/dto/update-album.dto'
import { UpdatePhotoDto } from './dto/update-photo.dto'

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly repository: Repository<Photo>,
  ) {}

  async createMany(photos: IPhoto[]) {
    const createPhotos = this.repository.create(photos)
    const savedAlbums = await this.repository.save(createPhotos)
    return savedAlbums
  }

  async create(createPhotoDto: CreatePhotoDto) {
    const { albumId, title } = createPhotoDto
    const createPhoto = this.repository.create({
      album: { id: albumId },
      title,
    })
    const savedAlbum = this.repository.save(createPhoto)
    return savedAlbum
  }

  async findById(id: number) {
    const photo = await this.repository.findOne({ where: { id }})

    if (!photo) throw new NotFoundException(`Photo with id: ${id} was not found.`)
    return photo
  }

  async remove(id: number) {
    const result = await this.repository.delete({ id })
    if (result.affected === 0) {
      throw new NotFoundException(`Photo with id ${id} was not found`)
    }
    return { message: 'Photo deleted successfully!' }
  }

  async update(id: number, updatePhotoDto: UpdatePhotoDto) {
    const photo = await this.findById(id)
    const updatePhoto = this.repository.create({
      ...photo,
      ...updatePhotoDto,
    })
    const updatedPhoto = await this.repository.save(updatePhoto)
    return updatedPhoto
  }
}
