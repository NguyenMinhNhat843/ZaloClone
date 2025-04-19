import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Buffer } from 'buffer';
import { JwtMiddleware } from 'src/auth/jwt.middleware';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,

    private jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    console.log(`✅ WebSocket server đang chạy tại ws://localhost:3000`);
  }

  // ==============                =============
  // ============== Lấy token user =============
  // ==============                =============
  async handleConnection(client: Socket) {
    const token =
      client.handshake.auth?.token || client.handshake.headers?.token;
    console.log('Token từ client:', token);

    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      client.data.user = payload; // Gán user từ token vào client.data
      console.log('[Socket] Authenticated user:', payload);
    } catch (err) {
      console.log('[Socket] Invalid token');
      client.disconnect();
    }
  }

  // ==============                     =============
  // ============== Socket gửi tin nhắn =============
  // ==============                     =============
  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    {
      senderId,
      receiverId,
      text,
      attachments,
    }: {
      senderId: string;
      receiverId: string;
      text: string;
      attachments?: {
        url: string;
        type: 'image' | 'video' | 'word' | 'excel' | 'text' | 'file';
        size: number;
      }[];
    },
    @ConnectedSocket() client: Socket,
    callback: (res: any) => void,
  ) {
    // server log debug
    console.log('[Server] 📥 Received sendMessage event:', {
      senderId,
      receiverId,
      text,
      attachmentsCount: attachments?.length || 0,
    });

    // check data
    if (!senderId || !receiverId || !text) {
      console.error('❌ Lỗi: senderId, receiverId hoặc text bị thiếu!');
      return;
    }

    try {
      // Auto join room nếu chưa join (theo senderId)
      if (!client.rooms.has(senderId)) {
        console.log(
          `[Server] ⚠️ Client chưa join room ${senderId}, tiến hành join`,
        );
        client.join(senderId);
        console.log(`[Server] ✅ Client đã join room ${senderId}`);
      }

      // Gửi tin nhắn tới DB
      const message = await this.chatService.sendMessage(
        senderId,
        receiverId,
        text,
        attachments,
      );
      // console.log('✅ Tin nhắn đã lưu vào DB:', message);

      // Kiểm tra danh sách phòng (rooms) mà client đang kết nối
      // console.log('🏠 Danh sách phòng của client:', client.rooms);

      // Gửi tin nhắn tới cả người gửi và người nhận
      // this.server.to([senderId, receiverId]).emit('receiveMessage', message);
      // console.log('[Server] Đã gửi tin nhắn tới:', [senderId, receiverId]);

      // gửi tin nhắn tới room người nhận
      this.server.to([receiverId]).emit('receiveMessage', message);

      // Gửi phản hồi lại cho chính client gửi (qua emit, không phải callback)
      client.emit('sendMessageResult', {
        status: 'ok',
        message,
      });

      // Nếu có callback (client dùng socket.io client), thì trả về
      console.log('callback =============   ', callback);
      console.log(typeof callback);

      if (typeof callback === 'function') {
        console.log('🟡 Gọi callback trả về cho client');
        callback({ status: 'ok', message });
      }

      console.log('[Server] Đã gửi tin nhắn tới:', [receiverId]);
    } catch (error) {
      console.error('❌ Lỗi khi gửi tin nhắn:', error);

      if (typeof callback === 'function') {
        callback({ status: 'error', message: 'Gửi tin nhắn thất bại!' });
      }
    }
  }

  // ==============                                       =============
  // ============== Tạo room cho user - nghĩa là online ấy =============
  // ==============                                        =============
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[Server] Tạo 1 phòng chat với id là userID:', userId);
    client.join(userId);
    console.log(`[Server] User ${userId} joined room`);
    console.log('[Server] Rooms of this client:', Array.from(client.rooms));
    // Gửi xác nhận lại cho client
    client.emit('joinedChat', { userId, rooms: Array.from(client.rooms) });
  }

  // ==============                        =============
  // ============== Xử lý thu hồi tin nhắn =============
  // ==============                        =============
  @SubscribeMessage('revokeMessage')
  async handleRevokeMessage(
    @MessageBody()
    data: { messageId: string; userId: string; conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { messageId, userId, conversationId } = data;

    try {
      const result = await this.chatService.revokeMessage(messageId, userId);

      // Lấy thành viên trong đoạn chat
      const members = await this.chatService.getGroupMembers(conversationId);

      // Kiểm tra xem members có phải là mảng hay không
      // Nếu không phải là mảng, có thể là null hoặc undefined - sẽ gây lỗi
      if (!Array.isArray(members)) {
        console.log('[Server] Danh sách thành viên trong đoạn chat:');
        throw new Error('Có vẻ như đang có lỗi j đó');
      }

      // Lấy danh sách userId dưới dạng string[]
      const userIds = members.map((m) => m.userId._id.toString());
      console.log(
        '[Server] [DeleteMessage] Danh sách userId trong đoạn chat:',
        userIds,
      );

      // Gửi lại event tới tất cả client trong cuộc trò chuyện
      this.server.to(userIds).emit('messageRevoked', {
        messageId,
        userId,
      });
    } catch (err) {
      client.emit('error', {
        message: 'Thu hồi tin nhắn thất bại',
        error: err.message,
      });
    }
  }

  // ==============                    =============
  // ============== Xử lý xóa tin nhắn =============
  // ==============                    =============
  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody()
    payload: {
      messageId: string;
      type: 'me' | 'everyone';
      userId: string;
      conversationId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { messageId, type, userId, conversationId } = payload;

    if (type === 'everyone') {
      try {
        // Xoas tin nhắn hoàn toàn trong database
        await this.chatService.deleteMessage(messageId);

        // Lấy thành viên trong đoạn chat
        const members = await this.chatService.getGroupMembers(conversationId);
        // console.log(
        //   '[Server] [DelteMessage] Danh sách thành viên trong đoạn chat:',
        //   members,
        // );

        // Kiểm tra xem members có phải là mảng hay không
        // Nếu không phải là mảng, có thể là null hoặc undefined - sẽ gây lỗi
        if (!Array.isArray(members)) {
          console.log('[Server] Danh sách thành viên trong đoạn chat:');
          throw new Error('Có vẻ như đang có lỗi j đó');
        }

        // Lấy danh sách userId dưới dạng string[]
        const userIds = members.map((m) => m.userId._id.toString());
        console.log(
          '[Server] [DeleteMessage] Danh sách userId trong đoạn chat:',
          userIds,
        );

        // Gửi sự kiện cho tất cả mọi người trong đoạn chat
        this.server.to(userIds).emit('messageDeleted', {
          messageId,
          type: 'everyone',
        });

        // ✅ Thông báo riêng cho client hiện tại biết là thao tác thành công
        client.emit('delete-success', {
          messageId,
          conversationId,
          type: 'everyone',
        });
      } catch (err) {
        console.error('[❌ Delete Failed]', err.message);
        client.emit('error-delete', {
          messageId,
          error: err.message,
        });
      }
    } else if (type === 'me') {
      // Đánh dấu là tin nhắn đã xóa với user này

      // Gửi thông báo chỉ cho client hiện tại
      client.emit('message-deleted', {
        messageId,
        type: 'me',
      });
    }
  }

  // ==============                 =============
  // ============== Xử lý Tạo group =============
  // ==============                 =============
  @SubscribeMessage('createGroupChat')
  async handleCreateGroupChat(
    @MessageBody()
    data: {
      groupName: string;
      members: string[];
      groupAvatar?: string; // URL ảnh đã được upload từ client hoặc để mặc định
    },
    // callback: (res: any) => void,
    @ConnectedSocket() client: Socket,
  ) {
    const userCreaterId = client.data.user.userId; // Lấy userId từ client data
    const { groupName, members } = data;
    try {
      if (!userCreaterId || !data.groupName || !data.members) {
        return {
          status: 'error',
          message: 'Thiếu thông tin để tạo group chat!',
        };
      }

      // Kiểm tra số lượng members có lớn hơn 3 ko
      if (members.length < 2) {
        return {
          status: 'error',
          message: 'Phải 3 người trở lên mới đc tạo nhóm chat!',
        };
      }

      const groupAvatarUrl =
        data.groupAvatar ||
        'https://www.shutterstock.com/image-vector/avatar-group-people-chat-icon-260nw-2163070859.jpg';

      const group = await this.chatService.createGroupChat(
        userCreaterId,
        data.groupName,
        groupAvatarUrl,
        data.members,
      );

      console.log('[Server] Nhóm chat đã được tạo:', group);
      console.log("'[Server] Danh sách thành viên trong nhóm:', members);", [
        userCreaterId,
        ...data.members,
      ]);

      // Gửi lại thông báo về client
      // Emit tới tất cả các thành viên trong danh sách
      this.server.to([userCreaterId, ...data.members]).emit('groupCreated', {
        group,
      });
    } catch (error) {
      console.error('❌ Lỗi khi tạo nhóm:', error);
      return {
        status: 'error',
        message: 'Không thể tạo nhóm chat!',
      };
    }
  }

  // ==============                 =============
  // ============== Thêm thành viên =============
  // ==============                 =============
  @SubscribeMessage('addMembersToGroup')
  async handleAddMembersToGroup(
    @MessageBody()
    data: {
      groupId: string;
      members: string[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.userId; // Lấy userId từ token từ client data
    const { groupId, members } = data;

    try {
      if (!userId || !groupId || !members) {
        return {
          status: 'error',
          message: 'Thiếu thông tin để thêm thành viên vào nhóm!',
        };
      }

      const group = await this.chatService.addMembersToGroup(
        groupId,
        members,
        userId,
      );

      // Gửi lại thông báo về client
      // Emit tới tất cả các thành viên trong danh sách
      this.server.to([userId, ...members]).emit('membersAdded', {
        group,
      });
    } catch (error) {
      console.error('❌ Lỗi khi thêm thành viên vào nhóm:', error);
      return {
        status: 'error',
        message: 'Không thể thêm thành viên vào nhóm chat!',
      };
    }
  }

  // ==============                =============
  // ============== Xóa thành viên =============
  // ==============                =============
  @SubscribeMessage('removeMembersFromGroup')
  async handleRemoveMembersFromGroup(
    @MessageBody()
    data: {
      groupId: string;
      members: string[];
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.userId; // Lấy userId từ token từ client data
    const { groupId, members } = data;

    try {
      if (!userId || !groupId || !members) {
        return {
          status: 'error',
          message: 'Thiếu thông tin để xóa thành viên khỏi nhóm!',
        };
      }

      const group = await this.chatService.removeGroupMembers(
        groupId,
        userId,
        members,
      );

      // Gửi lại thông báo về client
      // Emit tới tất cả các thành viên trong danh sách
      this.server.to([userId, ...members]).emit('membersRemoved', {
        group,
      });
    } catch (error) {
      console.error('❌ Lỗi khi xóa thành viên khỏi nhóm:', error);
      return {
        status: 'error',
        message: 'Không thể xóa thành viên khỏi nhóm chat!',
      };
    }
  }

  // ==============                               =============
  // ============== Xử lý cập nhật thông tin nhóm =============
  // ==============                               =============
  @SubscribeMessage('updateGroupInfo')
  async handleUpdateGroupInfo(
    @MessageBody()
    data: {
      groupId: string;
      groupName?: string;
      groupAvatar?: string; // URL ảnh đã được upload từ client hoặc để mặc định
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.userId; // Lấy userId từ token từ client data
    const { groupId, groupName, groupAvatar } = data;

    try {
      if (!userId && !groupId) {
        console.log('[Server] Thiếu thông tin để cập nhật nhóm!');
        this.server.to(userId).emit('error', {
          message: 'Thiếu thông tin để cập nhật nhóm!',
        });
        return;
      }

      // Kiểm tra xem người dùng có phải là admin của nhóm không
      const isAdmin = await this.chatService.checkAdminInGroup(groupId, userId);
      if (!isAdmin) {
        console.log(
          '[Server] Người dùng không phải là admin của nhóm, không thể cập nhật!',
        );
        this.server.to(userId).emit('error', {
          message: 'Bạn không phải admin, không có quyền cập nhật!',
        });
        return;
      }

      // Gọi service để cập nhật thông tin nhóm
      const group = await this.chatService.updateGroupInfo(
        groupId,
        groupName,
        groupAvatar,
      );

      // Lấy các thành viên trong nhóm
      console.log('[Server] Danh sách thành viên trong nhóm:', group);

      // Gửi lại thông báo về client
      // Emit tới tất cả các thành viên trong danh sách
      this.server.to([]).emit('groupInfoUpdated', {
        group,
      });
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật thông tin nhóm:', error);
      return {
        status: 'error',
        message: 'Không thể cập nhật thông tin nhóm chat!',
      };
    }
  }

  // ==============                =============
  // ============== Thay đổi admin =============
  // ==============                =============
  @SubscribeMessage('changeGroupAdmin')
  async handleChangeGroupAdmin(
    @MessageBody()
    data: {
      groupId: string;
      newAdminId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.userId; // Lấy userId từ token từ client data
    const { groupId, newAdminId } = data;

    try {
      if (!userId && !groupId && !newAdminId) {
        return {
          status: 'error',
          message: 'Thiếu thông tin để thay đổi admin nhóm!',
        };
      }

      // Kiểm tra xem người dùng có phải là admin của nhóm không
      const isAdmin = await this.chatService.checkAdminInGroup(groupId, userId);
      if (!isAdmin) {
        console.log(
          '[Server] Người dùng không phải là admin của nhóm, không thể thay đổi admin!',
        );
        this.server.to(userId).emit('error', {
          message: 'Bạn không phải admin, không có quyền thay đổi admin!',
        });
        return;
      }

      // Gọi service để thay đổi admin nhóm
      const group = await this.chatService.transferAdmin(
        groupId,
        userId,
        newAdminId,
      );

      // Gửi lại thông báo về client
      // Emit tới tất cả các thành viên trong danh sách
      this.server
        .to(group.members.map((id) => id.toString()))
        .emit('groupAdminChanged', {
          group,
        });
    } catch (error) {
      console.error('❌ Lỗi khi thay đổi admin nhóm:', error);
      return {
        status: 'error',
        message: 'Không thể thay đổi admin nhóm chat!',
      };
    }
  }

  // ==============             =============
  // ============== Gửi lời mời =============
  // ==============             =============
  @SubscribeMessage('sendInvitation')
  async handleSendInvitation(
    @MessageBody()
    data: {
      fromUserId: string;
      toUserId: string;
      type: 'friend' | 'group';
      title: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { fromUserId, toUserId, type, title } = data;

    try {
      if (!fromUserId || !toUserId || !type || !title) {
        return {
          status: 'error',
          message: 'Thiếu thông tin để gửi lời mời!',
        };
      }

      const invitation = await this.chatService.sendInvitation(
        fromUserId,
        toUserId,
        type,
        title,
      );

      // Gửi lại thông báo về client
      // Emit tới tất cả các thành viên trong danh sách
      this.server.to([fromUserId, toUserId]).emit('invitationSent', {
        invitation,
      });
    } catch (error) {
      console.error('❌ Lỗi khi gửi lời mời:', error);
      return {
        status: 'error',
        message: 'Không thể gửi lời mời!',
      };
    }
  }

  // ==============                    =============
  // ============== Xử lý xóa tin nhắn =============
  // ==============                    =============
}
