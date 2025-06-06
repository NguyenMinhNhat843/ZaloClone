import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Lấy danh sách user
  @Get()
  async getUsers() {
    return await this.userService.getAllUsers();
  }

  // Lấy user hiện tại
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: Request) {
    const user = req['user'];
    console.log(user);
    return this.userService.findUser(user.userId);
  }

  // Cập nhật user hiện tại
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar')) // <== interceptor để upload file
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Req() req: Request,
    @Body() updateData: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File,
  ) {
    const user = req['user']; // lấy từ token
    console.log('user', avatar, '  ', updateData);
    return this.userService.updateUser(user.userId, updateData, avatar);
  }

  // Lấy user theo phone hoặc id
  @Get(':param')
  async getUser(@Param('param') param: string) {
    return await this.userService.findUser(param);
  }

  // kiểm tra phone đã tồn tại hay chưa
  @Post('check-phone')
  async checkPhone(@Body('phone') phone: string) {
    return await this.userService.checkPhoneExist(phone);
  }

  // Cập nhật user
  @Put(':id')
  updateUser(@Param('id') userId: string, @Body() updateData: any) {
    return this.userService.updateUser(userId, updateData);
  }

  // Xóa User
  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    return this.userService.deleteUser(userId);
  }

  // Đổi mật khẩu
  @Patch('change-password')
  async changePassword(@Req() req: Request, @Body() changePasswordDto: any) {
    const user = req['user'];
    return await this.userService.changePassword(
      user.userId,
      changePasswordDto,
    );
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: { email: string; newPassword: string },
  ) {
    const { email, newPassword } = resetPasswordDto;
    return await this.userService.resetPassword(email, newPassword);
  }

  // Xóa tất cả user (chỉ dành cho admin)
  @Delete('admin/delete-all')
  async deleteAllUsers() {
    return await this.userService.deleteAllUsers();
  }
}
