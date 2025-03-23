import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(
    @Body('senderId') senderId: string,
    @Body('conversationId') conversationId: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(senderId, conversationId, content);
  }

  @Get('conversation/:id')
  async getMessages(@Param('id') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }
}
