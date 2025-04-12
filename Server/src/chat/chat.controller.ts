import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
  HttpException,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloundinaryService } from 'src/cloundinary/cloundinary.service';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private cloundinaryService: CloundinaryService,
  ) {}

  // =============== Gửi tin nhắn (dành cho REST API) ===============
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

  // ================= Upload file (dành cho REST API) ==================
  @Post('upload/files')
  @UseInterceptors(FilesInterceptor('files', 3)) // Giới hạn 3 file
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ) {
    // console.log('files', files); // log ra đc

    const user = req['user']; // lấy từ token
    const userId = user.userId; // Lấy userId từ token để tạo tên file

    // Kiểm tra xem có file nào được upload hay không
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const attachments = await Promise.all(
        files.map((file) =>
          this.cloundinaryService.uploadFileByMultiformData(
            file,
            'ZaloClone/chat_uploads',
            userId,
          ),
        ),
      );
      return { attachments };
    } catch (error) {
      throw new HttpException(
        `Upload failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
