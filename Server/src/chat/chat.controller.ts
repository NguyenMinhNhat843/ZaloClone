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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloundinaryService } from 'src/cloundinary/cloundinary.service';
import { memoryStorage } from 'multer';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private cloundinaryService: CloundinaryService,
  ) {}

  // =============== Gửi tin nhắn (dành cho REST API) ===============
  // @Post('send')
  // async sendMessage(
  //   @Body()
  //   {
  //     senderId,
  //     receiverId,
  //     text,
  //   }: {
  //     senderId: string;
  //     receiverId: string;
  //     text: string;
  //   },
  // ) {
  //   return this.chatService.sendMessage(senderId, receiverId, text);
  // }

  // ================= Upload file ==================
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

  // ========= Lấy All conversation trong hệ thống =========
  @Get('conversations')
  async getAllConversations() {
    return this.chatService.getAllConversation();
  }

  // ============= Lấy danh sách cuộc trò chuyện của 1 user =============
  @Get('conversations/:userId')
  async getUserConversations(@Param('userId') userId: string) {
    return this.chatService.getUserConversations(userId);
  }

  // ============== Lấy danh sách thành viên của cuộc trò chuyện ==========
  @Get('conversations/:conversationId/members')
  async getMembers(@Param('conversationId') conversationId: string) {
    return this.chatService.getGroupMembers(conversationId);
  }

  // =============== Lấy danh sách tin nhắn trong 1 cuộc trò chuyện theo idConversation ===============
  @Get('messages/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  // ============== Xóa tin nhắn theo messageId ============
  @Delete('messages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteMessage(@Param('id') idMesage: string) {
    await this.chatService.deleteMessage(idMesage);
  }

  // ================== admin: xóa hết tin nhắn trong hệ thống ==================
  @Delete('admin/messages')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllMessages() {
    await this.chatService.deleteAllMessages();
  }

  // ====================== admin: xóa 1 đoạn hội thoại theo id =================
  @Delete('conversations/:id')
  async deleteOneConversation(@Param('id') id: string) {
    return this.chatService.deleteOneConversation(id);
  }

  // ============= admin: xóa hết đoạn hội thoại =============
  @Delete('conversations')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllConversations() {
    await this.chatService.deleteAllConversations();
    return {
      status: 'success',
      message: 'Xóa tất cả đoạn hội thoại thành công!',
    };
  }

  // =================================================                       =================================================
  // ================================================= Controller group chat =================================================
  // =================================================                       =================================================

  // ==============                =============
  // ============== Tạo group chat =============
  // ==============                =============
  @Post('conversations/group')
  @UseInterceptors(
    FileInterceptor('groupAvatar', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async createGroupChat(
    @Req() req: Request,
    @Body()
    body: {
      groupName: string;
      members: string[]; // Danh sách userId
    },
    @UploadedFile() groupAvatar: Express.Multer.File,
  ) {
    // Lấy userId từ token
    const user = req['user'];
    const userCreaterId = user.userId; // Lấy userId từ token để tạo tên file

    const { groupName, members } = body;

    // validate dữ liệu đầu vào
    if (!userCreaterId || !groupName || !members) {
      return {
        status: 'error',
        message: 'Thiếu thông tin để tạo group chat!',
      };
    }

    // gọi service createGroupChat
    try {
      // Gọi service upload file avatar group
      const uploadedFiles =
        await this.cloundinaryService.uploadFileByMultiformData(
          groupAvatar,
          'ZaloClone/group_avatars',
          userCreaterId,
        );

      const groupAvatarUrl = uploadedFiles?.url || ''; // Lấy URL đầu tiên làm avatar

      const group = await this.chatService.createGroupChat(
        userCreaterId,
        groupName,
        groupAvatarUrl,
        members,
      );

      return {
        status: 'success',
        message: 'Tạo group chat thành công!',
        data: group,
      };
    } catch (error) {
      console.error('❌ Lỗi khi tạo nhóm:', error);
      return {
        status: 'error',
        message: 'Không thể tạo nhóm chat!',
      };
    }
  }

  // ==============                          =============
  // ============== Lấy danh sách group chat =============
  // ==============                          =============
  // @Get('conversations/group/:userId')
  // async getGroupChat(@Param('userId') userId: string) {
  //   return this.chatService.getGroupChat(userId);
  // }
}
