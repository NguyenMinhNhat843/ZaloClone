import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { MailService } from './services/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto); in ra đc
    const { name, phone, password, gender, dateOfBirth, avatar, gmail } =
      createUserDto;
    if (!name || !phone || !password || !gender || !dateOfBirth) {
      return {
        status: 400,
        message: 'Thiếu thông tin đăng ký!',
      };
    }

    // Nếu không có avatar thì gán giá trị mặc định
    const avatarUrl =
      avatar === '' || avatar === undefined
        ? 'https://res.cloudinary.com/dz1nfbpra/image/upload/v1743683852/8f1ca2029e2efceebd22fa05cca423d7_wgoko2.jpg'
        : avatar;

    return this.authService.register(
      name,
      phone,
      password,
      gender,
      dateOfBirth,
      avatarUrl,
      gmail,
    );
  }

  @Post('login')
  async login(
    @Body('phone') phone: string,
    @Body('password') password: string,
  ) {
    return this.authService.login(phone, password);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  // ========================= Xác thực mail
  @Post('send')
  async send(@Body('email') email: string) {
    return await this.mailService.sendOtp(email);
  }

  @Post('verify')
  async verify(@Body('email') email: string, @Body('otp') otp: string) {
    return await this.mailService.verifyOtp(email, otp);
  }
}
