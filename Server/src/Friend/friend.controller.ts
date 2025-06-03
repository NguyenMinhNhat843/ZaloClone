// src/friendship/friendship.controller.ts
import { Controller, Post, Param, Body, Req } from '@nestjs/common';
import { FriendshipService } from './friend.service';

@Controller('friendship')
export class FriendshipController {
  constructor(private readonly friendshipService: FriendshipService) {}

  // Gửi lời mời kết bạn
  @Post('request/:recipientId')
  sendFriendRequest(@Param('recipientId') recipientId: string, @Req() req) {
    const user = req['user'];
    // console.log('User từ request:', user);
    return this.friendshipService.sendFriendRequest(user.userId, recipientId);
  }

  // Chấp nhận lời mời
  @Post('accept/:addFriendInvitationId')
  acceptRequest(
    @Param('addFriendInvitationId') addFriendInvitationId: string,
    @Req() req,
  ) {
    const user = req['user'];
    return this.friendshipService.acceptRequest(
      addFriendInvitationId,
      user.userId,
    );
  }

  // Lấy danh sách lời mời
  @Post('pending')
  getPendingRequests(@Req() req) {
    const user = req['user'];
    return this.friendshipService.getPendingRequests(user.userId);
  }

  // Lấy danh sách bạn bè
  @Post('friends')
  getFriends(@Req() req) {
    const user = req['user'];
    return this.friendshipService.getFriends(user.userId);
  }
}
