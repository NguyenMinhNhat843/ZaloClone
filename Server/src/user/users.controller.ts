import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return await this.userService.getAllUsers();
  }

  @Get(':phone')
  async getUser(@Param('phone') phone: string) {
    return await this.userService.findUserByPhone(phone);
  }
}
