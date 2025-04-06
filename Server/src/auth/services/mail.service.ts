import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
  private otpStore = new Map<string, string>();

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADMIN, // ← Thay bằng Gmail của bạn
      pass: process.env.GMAIL_APP_PASSWORD, // ← Dùng App Password, KHÔNG phải mật khẩu thường
    },
  });

  async sendOtp(email: string): Promise<{ message: string; status: boolean }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otpStore.set(email, otp);

    const mailOptions = {
      from: process.env.GMAIL_ADMIN,
      to: email,
      subject: 'Xác thực Gmail - Mã OTP',
      text: `Mã OTP của bạn là: ${otp}`,
    };

    console.log(process.env.GMAIL_ADMIN, process.env.GMAIL_APP_PASSWORD);
    console.log('Gửi mã OTP đến:', email);

    try {
      console.log('Gửi mã OTP đến:', email);
      const a = await this.transporter.sendMail(mailOptions);
      console.log('Gửi thành công:', a);
      return { message: 'OTP đã được gửi đến Gmail!', status: true };
    } catch (error) {
      console.error('Lỗi gửi email:', error.message);
      throw new Error('Không thể gửi OTP!');
    }
  }

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ message: string; status: boolean } | string> {
    const storedOtp = this.otpStore.get(email);

    if (!storedOtp) return { message: 'Mã OTP đã hết hạn!', status: false };
    if (storedOtp !== otp)
      return { message: 'Mã OTP không chính xác!', status: false };

    this.otpStore.delete(email);
    return { message: 'Xác thực thành công!!!', status: true };
  }
}
