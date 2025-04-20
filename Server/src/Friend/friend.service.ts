// src/friendship/friendship.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friendship } from './friend.schema';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship.name)
    private readonly friendshipModel: Model<Friendship>,
  ) {}

  // Gửi lời mời kết bạn
  async sendFriendRequest(requester: string, recipient: string) {
    return this.friendshipModel.create({
      requester: new Types.ObjectId(requester),
      recipient: new Types.ObjectId(recipient),
      status: 'pending',
    });
  }

  // Chấp nhận lời mời
  async acceptRequest(requestId: string) {
    return this.friendshipModel.findByIdAndUpdate(requestId, {
      status: 'accepted',
    });
  }

  // Lấy danh sách bạn bè đã chấp nhận
  async getFriends(userId: string) {
    const friendships = await this.friendshipModel.find({
      status: 'accepted',
      $or: [
        { requester: new Types.ObjectId(userId) },
        { recipient: new Types.ObjectId(userId) },
      ],
    });

    return friendships.map((f) =>
      f.requester.toString() === userId ? f.recipient : f.requester,
    );
  }

  // Optional: Unfriend
  async removeFriend(userId: string, friendId: string) {
    return this.friendshipModel.findOneAndDelete({
      status: 'accepted',
      $or: [
        { requester: userId, recipient: friendId },
        { requester: friendId, recipient: userId },
      ],
    });
  }
}
