import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { MailService } from './services/mail.service';
import { CloundinaryService } from 'src/cloundinary/cloundinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private readonly mailService: MailService,
    private cloudinaryService: CloundinaryService,
  ) {}

  @Post('register')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(), // dùng bộ nhớ tạm, không lưu ra file
      limits: { fileSize: 10 * 1024 * 1024 }, // giới hạn 10MB (tùy chọn)
    }),
  )
  async register(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    // console.log(createUserDto); in ra đc
    const { name, phone, password, gender, dateOfBirth, gmail } = createUserDto;
    if (!name || !phone || !password || !gender || !dateOfBirth) {
      return {
        status: 400,
        message: 'Thiếu thông tin đăng ký!',
      };
    }

    // Kiểm tra phoen đã tồn tại chưa
    const existsUser = await this.userService.checkPhoneExist(phone);
    if (existsUser) {
      return {
        status: 400,
        message: 'Số điện thoại đã được đăng ký!',
      };
    }

    // Nếu không có avatar thì gán giá trị mặc định
    let avatarUrl =
      'https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg'; // Giá trị mặc định

    if (avatar) {
      try {
        const result = await this.cloudinaryService.uploadFileByMultiformData(
          avatar,
          'ZaloClone/avatars',
          phone, // hoặc userId sau này nếu cần
        );

        avatarUrl = result.url;
      } catch (error) {
        console.error('❌ Lỗi upload avatar:', error);
      }
    }

    // console.log('avatrURl: ', avatarUrl);

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
