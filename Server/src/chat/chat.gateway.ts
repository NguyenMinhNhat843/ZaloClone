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
import { Subscriber } from 'rxjs';

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log(`✅ WebSocket server đang chạy tại ws://localhost:3000`);
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
    }: { senderId: string; receiverId: string; text: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log('[Server] 📥 Received sendMessage event:', {
      senderId,
      receiverId,
      text,
    });

    if (!senderId || !receiverId || !text) {
      console.error('❌ Lỗi: senderId, receiverId hoặc text bị thiếu!');
      return;
    }

    try {
      const message = await this.chatService.sendMessage(
        senderId,
        receiverId,
        text,
      );
      // console.log('✅ Tin nhắn đã lưu vào DB:', message);

      // Kiểm tra danh sách phòng (rooms) mà client đang kết nối
      // console.log('🏠 Danh sách phòng của client:', client.rooms);

      // Gửi tin nhắn tới cả người gửi và người nhận
      // this.server.to([senderId, receiverId]).emit('receiveMessage', message);
      // console.log('[Server] Đã gửi tin nhắn tới:', [senderId, receiverId]);

      // gửi tin nhắn tới room người nhận
      this.server.to([receiverId]).emit('receiveMessage', message);

      console.log('[Server] Đã gửi tin nhắn tới:', [receiverId]);
    } catch (error) {
      console.error('❌ Lỗi khi gửi tin nhắn:', error);
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
}
