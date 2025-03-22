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

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Lấy danh sách user
  @Get()
  async getUsers() {
    return await this.userService.getAllUsers();
  }

  // // Lấy user theo phone
  // @Get(':phone')
  // async getUser(@Param('phone') phone: string) {
  //   console.log('phone: ' + phone);
  //   return await this.userService.findUserByPhone(phone);
  // }

  // // Lấy thông tin user theo id
  // @Get(':id')
  // async getUserById(@Param('id') userId: string) {
  //   console.log('user id: ' + userId);
  //   try {
  //     const user = await this.userService.findUserById(userId);
  //     console.log('User tìm thấy:', user);
  //     return user;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
