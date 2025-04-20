// src/friend/friend.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Map userId -> socketId để gửi targeted message
  private onlineUsers = new Map<string, string>();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      console.log(`[Socket] User ${userId} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = [...this.onlineUsers.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];
    if (userId) {
      this.onlineUsers.delete(userId);
      console.log(`[Socket] User ${userId} disconnected`);
    }
  }

  // Hàm gọi khi gửi lời mời
  notifyFriendRequest(receiverId: string, payload: any) {
    const socketId = this.onlineUsers.get(receiverId);
    if (socketId) {
      this.server.to(socketId).emit('friend_request_received', payload);
    }
  }

  // Hàm gọi khi accept lời mời
  notifyFriendAccepted(receiverId: string, payload: any) {
    const socketId = this.onlineUsers.get(receiverId);
    if (socketId) {
      this.server.to(socketId).emit('friend_request_accepted', payload);
    }
  }
}
