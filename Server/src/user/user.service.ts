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
import { ChangePasswordDto } from './dto/change-pasword.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // ================================================= Tạo user mới - đăng ký
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

  // ==================================================== Lấy danh sách user
  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  // ============================== Lấy thông tin user ==============================
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

  // ================================================== Cập nhật thông tin user
  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User không tồn tại!!!');
    }
    return user;
  }

  // ================================================= Xóa user
  async deleteUser(userId: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(userId);
    if (!result) {
      throw new NotFoundException('User không tồn tại!!!');
    }
    return { message: 'Xóa user thành công!!!' };
  }

  // =================================================== Đổi mật khẩu
  async changePassword(userId: string, ChangePasswordDto: ChangePasswordDto) {
    const { oldPassword, newPassword } = ChangePasswordDto;

    // Tìm user theo id
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User không tồn tại!!!');
    }

    // Kiểm tra mật khẩu cũ có đúng không
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng!');
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 🔹 Lưu lại user
    await user.save();

    return { message: 'Đổi mật khẩu thành công!' };
  }

  // ==================================== Cập nhật hình ảnh =========================
  async updateAvatar(userId: string, avatar: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User không tồn tại!!!');
    }

    user.avatar = avatar;
    await user.save();

    return user;
  }
}
