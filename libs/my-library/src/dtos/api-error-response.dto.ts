import { IsDateString, IsIn, IsInt, IsString } from 'class-validator'

export class ApiErrorResponseDto {
  @IsString()
  message: string

  @IsString()
  path: string

  @IsInt()
  statusCode: number

  @IsDateString()
  timestamp: string
}
