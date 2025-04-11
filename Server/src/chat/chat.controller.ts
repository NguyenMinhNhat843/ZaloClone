import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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

  // ============== Lấy danh sách thành viên của cuộc trò chuyện ==========
  @Get('conversations/:conversationId/members')
  async getMembers(@Param('conversationId') conversationId: string) {
    return this.chatService.getGroupMembers(conversationId);
  }

  // ===================================== Lấy danh sách tin nhắn trong 1 cuộc trò chuyện theo idConversation
  @Get('messages/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  // ============================= Xóa tin nhắn theo messageId =========================
  @Delete('messages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id') idMesage: string) {
    await this.chatService.deleteMessage(idMesage);
  }

  // ==================== admin: xóa hết tin nhắn trong hệ thống ====================
  @Delete('admin/messages')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllMessages() {
    await this.chatService.deleteAllMessages();
  }

  // ========================= admin: xóa 1 đoạn hội thoại theo id ====================
  @Delete('admin/conversations/:id')
  async deleteOneConversation(@Param('id') id: string) {
    return this.chatService.deleteOneConversation(id);
  }
}
