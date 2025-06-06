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
// import { v2 as cloudinary } from 'cloudinary';
import { cloudinary } from 'src/config/cloundinary.config';
import { CloundinaryService } from 'src/cloundinary/cloundinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private cloundinaryService: CloundinaryService,
  ) {}

  // Upload avatar lên Cloudinary
  async uploadAvatar(avatar: string, phone: string): Promise<string> {
    try {
      const uploadResult = await cloudinary.uploader.upload(avatar, {
        folder: 'ZaloClone/avatars',
        public_id: `avatar_${phone}`, // tên ảnh sẽ là avatar_<số điện thoại>
        overwrite: true, // ghi đè nếu đã tồn tại
      });
      return uploadResult.secure_url; // Trả về URL ảnh đã upload
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
      throw new Error('Lỗi khi tải ảnh lên Cloudinary');
    }
  }

  // ================================================= Tạo user mới - đăng ký
  async createUser(
    name: string,
    phone: string,
    password: string,
    gender: string,
    dateOfBirth: string,
    avatar: string,
    gmail?: string,
  ) {
    // Kiểm tra user đã tồn tại chưa
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

    // upload avatar lên Cloudinary
    const avatarUrl = await this.uploadAvatar(avatar, phone);

    // Tạo User mới với các thông tin đầy đủ
    const newUser = new this.userModel({
      name,
      phone,
      password,
      gender,
      dateOfBirth: new Date(dateOfBirth), // Chuyển đổi ngày sinh thành Date object
      avatar: avatarUrl,
      gmail,
    });

    return await newUser.save();
  }

  // ==================================================== Lấy danh sách user
  async getAllUsers(): Promise<User[]> {
    return await this.userModel.find();
  }

  // ============================== Tìm và Lấy thông tin user ==============================
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

  // ============================== API check phone đã tồn tại hay chưa ==============================
  async checkPhoneExist(phone: string): Promise<boolean> {
    const exists = await this.userModel.exists({ phone });
    return !!exists; // Chuyển về boolean
  }

  // ================================================== Cập nhật thông tin user
  async updateUser(
    userId: string,
    updateData: Partial<User>,
    avatar?: Express.Multer.File,
  ): Promise<User> {
    if (avatar) {
      try {
        const avatarUrl =
          await this.cloundinaryService.uploadFileByMultiformData(
            avatar,
            'ZaloClone/avtars',
            userId,
          );
        updateData.avatar = avatarUrl.url; // Cập nhật URL ảnh đã upload
      } catch (error) {
        console.error('Lỗi khi tải ảnh lên Cloudinary:', error);
        throw new BadRequestException('Lỗi khi tải ảnh lên Cloudinary');
      }
    }

    // Cập nhật thông tin người dùng
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!user) {
      throw new NotFoundException('User không tồn tại!!!');
    }

    return user;
  }

  // ================================================== Xóa user và avatar của user
  async deleteUser(param: string): Promise<{ message: string }> {
    let result: any;

    // Kiểm tra xem param có phải là ObjectId hay không
    if (!Types.ObjectId.isValid(param)) {
      result = await this.userModel.findOneAndDelete({ phone: param });
    } else {
      result = await this.userModel.findByIdAndDelete(param);
    }

    if (!result) {
      throw new NotFoundException('User không tồn tại!!!');
    }

    // Nếu có avatar, xóa ảnh khỏi Cloudinary
    if (result.avatar) {
      try {
        const urlParts = result.avatar.split('/');

        // Lấy phần cuối là filename có đuôi (vd: avatar_0147258369.png)
        const fileNameWithExtension = urlParts.pop();

        // Bỏ qua 'upload' và phần version nếu có (vd: v1744788559)
        const uploadIndex = urlParts.indexOf('upload');
        let folderParts = urlParts.slice(uploadIndex + 1);

        // Nếu phần đầu là version (bắt đầu bằng 'v' + số), loại bỏ
        if (folderParts[0]?.match(/^v\d+$/)) {
          folderParts = folderParts.slice(1);
        }

        const fileName = fileNameWithExtension?.split('.')[0]; // avatar_0147258369
        folderParts.push(fileName); // ghép lại thành path

        const publicId = folderParts.join('/'); // ZaloClone/avatars/avatar_0147258369
        // console.log('✅ Public ID:', publicId);

        if (publicId) {
          await this.cloundinaryService.deleteFile(publicId);
        }
      } catch (error) {
        console.error('❌ Lỗi khi xóa ảnh avatar từ Cloudinary:', error);
        throw new BadRequestException('Lỗi khi xóa ảnh avatar từ Cloudinary');
      }
    }

    return { message: 'Xóa user và avatar thành công!!!' };
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

  // =================================================== Quên mật khẩu
  async resetPassword(email: string, newPassword: string) {
    const user = await this.userModel.findOne({ gmail: email });
    if (!user) {
      throw new NotFoundException('Email không tồn tại!!!');
    }

    // Hash mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();
    return {
      message: 'Mật khẩu đã được đặt lại thành công!',
    };
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

  // ============ Xóa tất cả user trong db ============
  async deleteAllUsers(): Promise<any> {
    const result = await this.userModel.deleteMany({});
    if (result.deletedCount === 0) {
      throw new NotFoundException('Không có user nào để xóa!');
    }
    return { message: 'Đã xóa tất cả user trong db!' };
  }
}
