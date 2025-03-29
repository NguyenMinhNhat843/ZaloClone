import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 🔹 Gửi tin nhắn (dành cho REST API)
  @Post('send')
  async sendMessage(
    @Body()
    {
      senderId,
      receiverId,
      text,
    }: {
      senderId: string;
      receiverId: string;
      text: string;
    },
  ) {
    return this.chatService.sendMessage(senderId, receiverId, text);
  }

  // 🔹 Lấy danh sách tin nhắn trong cuộc trò chuyện
  @Get('messages/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  // 🔹 Lấy danh sách cuộc trò chuyện của người dùng
  @Get('conversations/:userId')
  async getUserConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }
}
