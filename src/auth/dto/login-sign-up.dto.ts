import { IsString, IsStrongPassword } from 'class-validator'

export class LoginSignUpDto {
  @IsString()
  username: string

  @IsStrongPassword()
  password: string
}
