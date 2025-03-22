import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('phone') phone: string,
    @Body('password') password: string,
  ) {
    if (!firstName || !lastName || !phone || !password) {
      return {
        status: 400,
        message: 'Thiếu thông tin đăng ký!',
      };
    }
    return this.authService.register(firstName, lastName, phone, password);
  }

  @Post('login')
  async login(
    @Body('phone') phone: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(phone, password);
  }
}
