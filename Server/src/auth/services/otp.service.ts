import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as twilio from 'twilio';

@Injectable()
export class OtpService {
  private twilioClient: twilio.Twilio;

  constructor() {
    this.twilioClient = twilio(
      process.env.TWILIO_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  // 🔹 Hàm tạo OTP ngẫu nhiên 6 chữ số
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // 🔹 Gửi OTP đến số điện thoại
  async sendOtp(phone: string, otp: string) {
    try {
      await this.twilioClient.messages.create({
        body: `Mã OTP của bạn là: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      return { message: 'OTP đã được gửi thành công!' };
    } catch (error) {
      throw new HttpException(
        'Không thể gửi OTP, vui lòng thử lại sau!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
