import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginSignUpDto } from './dto/login-sign-up.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() loginDto: LoginSignUpDto) {
    return this.authService.signUp(loginDto)
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() loginDto: LoginSignUpDto) {
    return this.authService.login(loginDto)
  }
}
