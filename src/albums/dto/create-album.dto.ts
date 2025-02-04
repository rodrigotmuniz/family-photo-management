import { IsNumber, IsString } from "class-validator"

export class CreateAlbumDto {
  @IsString()
  title: string

  @IsNumber()
  userId: number
}
