import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Tạo user mới - đăng ký
  async createUser(
    firstName: string,
    lastName: string,
    phone: string,
    password: string,
  ) {
    //Kiểm tra user tồn tại chưa
    const existsUser = await this.userModel.findOne({ phone });

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
    const newUser = new this.userModel({
      firstName,
      lastName,
      phone,
      password,
    });
    return await newUser.save();
  }

  // Lấy danh sách user
  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  // // Lấy user theo phone
  // async findUserByPhone(phone: string) {
  //   return await this.userModel.findOne({ phone });
  // }

  // // Lấy user theo id
  // async findUserById(userId: string): Promise<User> {
  //   if (!Types.ObjectId.isValid(userId)) {
  //     throw new BadRequestException('Id không hợp lệ!!!');
  //   }

  //   const user = await this.userModel.findById(new Types.ObjectId(userId));

  //   if (!user) {
  //     throw new NotFoundException('User không tồn tại!!!');
  //   }
  //   return user;
  // }

  async findUser(param: string): Promise<User> {
    let user: any;

    // Nếu pẩm là ObjectId thì tìm theo Id
    if (Types.ObjectId.isValid(param)) {
      // console.log('Tìm theo Id: ', param);
      user = await this.userModel.findById(new Types.ObjectId(param));
    }
    // Nếu param là phone thì tìm theo phone
    else {
      // console.log('Tim theo phone: ', param);
      user = await this.userModel.findOne({ phone: param });
    }

    if (!user) {
      throw new NotFoundException('User không tồn tại!!!');
    }

    return user;
  }

  // Cập nhật thông tin user
  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại!!!');
    }
    return user;
  }

  // Xóa user
  async deleteUser(userId: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException('User không tồn tại!!!');
    }
    return { message: 'Xóa user thành công!!!' };
  }
}
