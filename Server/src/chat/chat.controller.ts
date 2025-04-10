import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ====================================== Gửi tin nhắn (dành cho REST API)
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

  // ====================================== Lấy tất cả conversation trong hệ thống
  @Get('conversations')
  async getAllConversations() {
    return this.chatService.getAllConversation();
  }

  // ====================================== Lấy danh sách cuộc trò chuyện của 1 user
  @Get('conversations/:userId')
  async getUserConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  // ===================================== Lấy danh sách tin nhắn trong 1 cuộc trò chuyện theo idConversation
  @Get('messages/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }
}
