import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // Đăng ký
  async register(
    name: string,
    phone: string,
    password: string,
    gender: string,
    dateOfBirth: string,
    avatar: string,
    gmail?: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser(
      name,
      phone,
      hashedPassword,
      gender,
      dateOfBirth,
      avatar,
      gmail,
    );
  }

  // Đăng nhập
  async login(phone: string, password: string) {
    const user = await this.userService.findUser(phone);
    // console.log(user);

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồm tại!!!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai phone hoặc mật khẩu!!!');

    const payload = { userId: user._id, phone: user.phone };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { accessToken, refreshToken };
  }

  // Hàm xử lý refresh token
  async refreshToken(refreshToken: string) {
    try {
      // Giải mã token để lấy userId
      const decoded = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUser(decoded.userId);

      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }

      // Cấp lại Access Token mới
      const payload = { userId: user._id, phone: user.phone };
      const newAccessToken = this.jwtService.sign(payload, {
        expiresIn: '15m',
      });

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh Token không hợp lệ');
    }
  }
}
