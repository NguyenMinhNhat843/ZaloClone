import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  // Tạo user mới
  async createUser(username: string, phone: string, password: string) {
    //Kiểm tra user tồn tại chưa
    const existsUser = await this.UserModel.findOne({ phone });

    if (existsUser) {
      throw new HttpException(
        {
          message: 'Số điện thoại đã được đăng ký!',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Nếu chưa tồn tại thì tạo User mới
    const newUser = new this.UserModel({ username, phone, password });
    return await newUser.save();
  }

  // Lấy danh sách user
  async getAllUsers() {
    return await this.UserModel.find();
  }

  // Laays user theo email
  async findUserByPhone(phone: string) {
    return await this.UserModel.findOne({ phone });
  }
}
