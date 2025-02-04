import { PartialType } from '@nestjs/mapped-types'
import { CreateAlbumDto } from './create-album.dto'
import { IsString } from 'class-validator'

export class UpdateAlbumDto {
  @IsString()
  title: string
}
