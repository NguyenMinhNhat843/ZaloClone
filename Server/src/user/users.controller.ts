import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwtAuth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

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
  async getProfile(@CurrentUser() user: any) {
    return user;
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
}
