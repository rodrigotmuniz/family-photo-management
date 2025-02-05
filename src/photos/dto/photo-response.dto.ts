import { IsDateString, IsInt, IsNumber, IsOptional, IsString } from 'class-validator'

export class PhotoResponseDto {
  album: AlbumResponse

  @IsNumber()
  id: number

  @IsOptional()
  @IsInt()
  refId: number | null

  @IsString()
  title: string

  @IsDateString()
  createdAt: Date

  @IsDateString()
  updatedAt: Date

  // @IsInt()
  // bla: number
}

class AlbumResponse {
  @IsInt()
  id: number
}
