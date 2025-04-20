// src/friendship/friendship.controller.ts
import { Controller, Post, Param, Body } from '@nestjs/common';
import { FriendshipService } from './friend.service';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  @Post('request/:recipientId')
  sendFriendRequest(
    @Param('recipientId') recipientId: string,
    @Body('userId') userId: string,
  ) {
    return this.friendshipService.sendFriendRequest(userId, recipientId);
  }

  @Post('accept/:id')
  acceptRequest(@Param('id') id: string) {
    return this.friendshipService.acceptRequest(id);
  }
}
