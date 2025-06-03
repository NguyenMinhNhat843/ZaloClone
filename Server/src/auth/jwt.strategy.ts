import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization
      ignoreExpiration: false, // Không bỏ qua hạn token
      secretOrKey: process.env.JWT_SECRET, // Key để giải mã token
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, phone: payload.phone }; // Trả về thông tin user từ token
  }
}
