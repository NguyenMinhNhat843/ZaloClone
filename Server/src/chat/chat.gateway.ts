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

@WebSocketGateway({ cors: { origin: '*', credentials: true } })
export class ChatGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    console.log(`✅ WebSocket server đang chạy tại ws://localhost:3000`);
  }

  // 🔹 Xử lý khi client gửi tin nhắn
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
    const message = await this.chatService.sendMessage(
      senderId,
      receiverId,
      text,
    );

    // Gửi tin nhắn tới cả người gửi và người nhận
    this.server.to([senderId, receiverId]).emit('receiveMessage', message);
  }

  // 🔹 Xử lý khi client tham gia vào một phòng chat
  @SubscribeMessage('joinChat')
  handleJoinChat(
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(userId); // Tham gia phòng có ID của người dùng
  }
}
