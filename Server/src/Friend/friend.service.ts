// src/friendship/friendship.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Friendship } from './friend.schema';
import { FriendGateway } from './friend.gateway';

@Injectable()
export class FriendshipService {
  constructor(
    @InjectModel(Friendship.name)
    private readonly friendshipModel: Model<Friendship>,
    private readonly friendGateway: FriendGateway, // Inject FriendGateway
  ) {}

  // Gửi lời mời kết bạn
  async sendFriendRequest(requester: string, recipient: string) {
    // Kiểm tra xem lời mời đã tồn tại chưa
    const existingRequest = await this.friendshipModel.findOne({
      $or: [
        {
          requester: new Types.ObjectId(requester),
          recipient: new Types.ObjectId(recipient),
        },
        {
          requester: new Types.ObjectId(recipient),
          recipient: new Types.ObjectId(requester),
        },
      ],
      status: 'pending', // Chỉ kiểm tra các lời mời có trạng thái "pending"
    });

    if (existingRequest) {
      return {
        message: 'Lời mời kết bạn đã tồn tại',
        requestId: existingRequest._id,
      };
    }

    const newRequest = await this.friendshipModel.create({
      requester: new Types.ObjectId(requester),
      recipient: new Types.ObjectId(recipient),
      status: 'pending',
    });
    // ✅ Gọi gateway emit
    this.friendGateway.notifyFriendRequest(recipient, newRequest);

    return newRequest;
  }

  // Chấp nhận lời mời
  async acceptRequest(requestId: string, receiverId: string) {
    // Tìm lời mời theo ID
    const friendRequest = await this.friendshipModel.findById(requestId);

    if (!friendRequest) {
      return { message: 'Không tìm thấy lời mời kết bạn' };
    }
    // Kiểm tra xem lời mời có đúng là gửi tới người dùng hiện tại không
    if (friendRequest.recipient.toString() !== receiverId) {
      return { message: 'Bạn không có quyền chấp nhận lời mời này' };
    }

    // Cập nhật trạng thái thành accepted
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Emit đến requester (người gửi lời mời) để thông báo đã được chấp nhận
    this.friendGateway.notifyFriendAccepted(
      friendRequest.requester.toString(),
      friendRequest,
    );

    return friendRequest;
  }

  // Lấy danh sách lời mời kết bạn chưa chấp nhận
  async getPendingRequests(userId: string) {
    const friendships = await this.friendshipModel.find({
      status: 'pending',
      recipient: new Types.ObjectId(userId),
    });

    return friendships;
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

    return friendships;
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
