// src/friendship/friendship.controller.ts
import { Controller, Post, Param, Body, Req } from '@nestjs/common';
import { FriendshipService } from './friend.service';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('request/:recipientId')
  sendFriendRequest(@Param('recipientId') recipientId: string, @Req() req) {
    const user = req['user'];
    console.log('User từ request:', user);
    return this.friendshipService.sendFriendRequest(user.userId, recipientId);
  }

  @Post('accept/:id')
  acceptRequest(@Param('id') id: string) {
    return this.friendshipService.acceptRequest(id);
  }
}
