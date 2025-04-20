// src/friend/friend.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FriendshipService } from './friend.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class FriendGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly jwtService: JwtService) {}

  // Map userId -> socketId để gửi targeted message
  // private onlineUsers = new Map<string, string>();

  // async handleConnection(client: Socket) {
  //   const token =
  //     client.handshake.auth?.token || client.handshake.headers?.token;
  //   console.log('Token từ client:', token);

  //   if (!token) {
  //     client.disconnect();
  //     return;
  //   }

  //   try {
  //     const payload = this.jwtService.verify(token, {
  //       secret: process.env.JWT_SECRET,
  //     });
  //     // gán socketId cho userId
  //     this.onlineUsers.set(payload.userId, client.id);
  //     client.data.user = payload; // Gán user từ token vào client.data
  //     console.log('[Socket] Authenticated user:', payload);
  //   } catch (err) {
  //     console.log('[Socket] Invalid token');
  //     client.disconnect();
  //   }
  // }

  // handleDisconnect(client: Socket) {
  //   const userId = [...this.onlineUsers.entries()].find(
  //     ([, socketId]) => socketId === client.id,
  //   )?.[0];
  //   if (userId) {
  //     this.onlineUsers.delete(userId);
  //     console.log(`[Socket] User ${userId} disconnected`);
  //   }
  // }

  // Hàm gọi khi gửi lời mời
  notifyFriendRequest(receiverId: string, payload: any) {
    // const socketId = this.onlineUsers.get(receiverId);
    // if (socketId) {
    // this.server.to(receiverId).emit('friend_request_received', payload);
    // }
    console.log('Gửi lời mời kết bạn đến:', receiverId);
    this.server.to(receiverId).emit('friend_request_received', payload);
  }

  // Hàm gọi khi accept lời mời
  notifyFriendAccepted(receiverId: string, payload: any) {
    // const socketId = this.onlineUsers.get(receiverId);
    // if (socketId) {
    // }
    this.server.to(receiverId).emit('friend_request_accepted', payload);
  }
}
