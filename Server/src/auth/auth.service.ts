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
    firstName: string,
    lastName: string,
    phone: string,
    password: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.createUser(
      firstName,
      lastName,
      phone,
      hashedPassword,
    );
  }

  // Đăng nhập
  async login(phone: string, password: string) {
    const user = await this.userService.findUserByPhone(phone);
    // const user = await this.userService.findUser(phone);

    if (!user) {
      throw new UnauthorizedException('Người dùng không tồm tại!!!');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai phone hoặc mật khẩu!!!');

    const payload = { userId: user._id, phone: user.phone };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
