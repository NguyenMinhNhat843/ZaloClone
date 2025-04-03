import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserService } from 'src/user/user.service';
import { OtpService } from './services/otp.service';
import { CreateUserDto } from './dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    // console.log(createUserDto); in ra đc
    const { name, phone, password, gender, dateOfBirth, avatar } =
      createUserDto;
    if (!name || !phone || !password || !gender || !dateOfBirth) {
      return {
        status: 400,
        message: 'Thiếu thông tin đăng ký!',
      };
    }
    return this.authService.register(
      name,
      phone,
      password,
      gender,
      dateOfBirth,
      avatar,
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

  @Post('send-otp')
  async sendOtp(@Body('phone') phone: string) {
    const user = await this.userService.findUser(phone);
    if (!user) {
      throw new HttpException(
        'Số điện thoại chưa đăng ký!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const otp = this.otpService.generateOtp();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // OTP hết hạn sau 5 phút

    // Cập nhật OTP trong database
    await this.userService.updateUser(user.phone, { otp, otpExpires });

    return this.otpService.sendOtp(phone, otp);
  }

  @Post('verify-otp')
  async verifyOtp(@Body('phone') phone: string, @Body('otp') otp: string) {
    const user = await this.userService.findUser(phone);
    if (!user || user.otp !== otp) {
      throw new HttpException('OTP không hợp lệ!', HttpStatus.BAD_REQUEST);
    }

    if (!user.otpExpires || user.otpExpires < new Date()) {
      throw new HttpException('OTP đã hết hạn!', HttpStatus.BAD_REQUEST);
    }

    // Xóa OTP sau khi xác thực thành công
    await this.userService.updateUser(user.phone, {
      otp: undefined,
      otpExpires: undefined,
    });

    return { message: 'Xác thực OTP thành công!' };
  }
}
