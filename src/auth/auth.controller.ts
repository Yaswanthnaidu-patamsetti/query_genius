import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() RegisterDto: RegisterDto) {
    return this.authService.signup(RegisterDto);
  }

  @HttpCode(200)
  @Post('signin')
  async signIn(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }
}
