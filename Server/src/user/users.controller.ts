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
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { Request } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtAuthGuard)
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
  async getProfile(@Req() req: Request) {
    const user = req['user'];
    return this.userService.findUser(user.userId);
  }

  // Cập nhật user hiện tại
  @Patch('me')
  async updateProfile(@Req() req: Request, @Body() updateData: UpdateUserDto) {
    const user = req['user'];
    return this.userService.updateUser(user.userId, updateData);
  }

  // Lấy user theo phone hoặc id
  @Get(':param')
  async getUser(@Param('param') param: string) {
    return await this.userService.findUser(param);
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
}
