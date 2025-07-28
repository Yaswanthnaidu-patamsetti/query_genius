import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/')
  getHello(): string {
    return 'Hello World!';
  }

  @Post('signup')
  @ApiOperation({ summary: 'Register a new User' })
  @ApiCreatedResponse({ description: 'User Registered Succesfully' })
  @ApiBadRequestResponse({ description: 'User already Exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signUp(@Body() RegisterDto: RegisterDto) {
    return this.authService.signup(RegisterDto);
  }

  @HttpCode(200)
  @Post('signin')
  @ApiOperation({ summary: 'User login with email or phone' })
  @ApiResponse({ status: 200, description: 'Login Success,return jwt' })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials or user not found',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async signIn(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }
}
