import { IsString, IsNumber } from 'class-validator'

export class CreatePhotoDto {
  @IsString()
  title: string

  @IsNumber()
  albumId: number
}
