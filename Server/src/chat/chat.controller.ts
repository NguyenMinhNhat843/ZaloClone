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
  ValidationPipe,
  UsePipes,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CloundinaryService } from 'src/cloundinary/cloundinary.service';
import { memoryStorage } from 'multer';
import { AddMembersDto } from './dto/addMembers.dto';

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

      const groupAvatarUrl =
        uploadedFiles?.url ||
        'https://www.shutterstock.com/image-vector/avatar-group-people-chat-icon-260nw-2163070859.jpg'; // Lấy URL đầu tiên làm avatar

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

  // ==============                                   =============
  // ============== Kiểm tra user có trong conver chưa =============
  // ==============                                    =============
  @Get('conversations/check/:userId')
  async checkUserInConversation(
    @Query('conversationId') conversationId: string,
    @Param('userId') userId: string,
  ) {
    if (!userId || !conversationId) {
      return {
        status: 'error',
        message: 'Thiếu thông tin để kiểm tra!',
      };
    }

    console.log(
      '[Service] - [checkUserInConversation] userId: ',
      userId,
      '\nconversationId',
      conversationId,
    );
    return this.chatService.checkUserInConversation(conversationId, userId);
  }

  // ==============                =============
  // ============== Thêm thành viên =============
  // ==============                =============
  @Post('conversations/:conversationId/members')
  @UsePipes(new ValidationPipe({ transform: true }))
  async addMembers(
    @Param('conversationId') conversationId: string,
    @Body() body: AddMembersDto,
    @Req() req: Request,
  ) {
    // Lấy userId từ token
    const user = req['user'];
    const userId = user.userId; // Lấy userId từ token để tạo tên file

    // Kiểm tra có phải admin ko
    const isAdmin = await this.chatService.checkAdminInGroup(
      conversationId,
      userId,
    );
    if (!isAdmin) {
      return {
        status: 'error',
        message: 'Bạn không có quyền thêm thành viên vào nhóm này!',
      };
    }

    const { members } = body;
    if (!members || members.length === 0) {
      return {
        status: 'error',
        message: 'Thiếu thông tin để thêm thành viên!',
      };
    }

    // Kiểm tra user có trong nhóm chưa
    const checkUser = await this.chatService.checkUserInConversation(
      conversationId,
      members[0],
    );

    if (checkUser) {
      return {
        status: 'error',
        message: 'Người dùng đã có trong nhóm!',
      };
    }

    return this.chatService.addMembersToGroup(conversationId, members, userId);
  }

  // ==============                                         =============
  // ============== Lấy danh sách thành viên trong nhóm chat =============
  // ==============                                          =============
  @Get('conversations/:conversationId/members')
  async getGroupMembers(@Param('conversationId') conversationId: string) {
    return this.chatService.getGroupMembers(conversationId);
  }

  // ==============                                =============
  // ============== Xóa thành viên trong nhóm chat =============
  // ==============                                =============
  @Delete('conversations/:conversationId/members/:userDeletedId')
  async removeMember(
    @Param('conversationId') conversationId: string,
    @Param('userDeletedId') userDeletedId: string,
    @Req() req: Request,
  ) {
    // Lấy userId từ token
    const user = req['user'];
    const userCreaterId = user.userId; // Lấy userId từ token để tạo tên file

    // Kiểm tra có phải admin ko
    const isAdmin = await this.chatService.checkAdminInGroup(
      conversationId,
      userCreaterId,
    );
    if (!isAdmin) {
      return {
        status: 'error',
        message: 'Bạn không có quyền xóa thành viên trong nhóm này!',
      };
    }

    return this.chatService.removeGroupMembers(conversationId, userCreaterId, [
      userDeletedId,
    ]);
  }

  // ==============                           =============
  // ============== Lấy thông tin 1 nhóm chat =============
  // ==============                           =============
  @Get('conversations/:conversationId')
  async getGroupInfo(@Param('conversationId') conversationId: string) {
    return this.chatService.getGroupInfo(conversationId);
  }

  // ==============                              =============
  // ============== Cập nhật thông tin nhóm chat =============
  // ==============                              =============
  @Post('conversations/:conversationId')
  @UseInterceptors(
    FileInterceptor('groupAvatar', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async updateGroupChat(
    @Param('conversationId') conversationId: string,
    @Body()
    body: {
      groupName?: string;
    },
    @UploadedFile() groupAvatar: Express.Multer.File,
    @Req() req: Request,
  ) {
    // Lấy userId từ token
    const user = req['user'];
    const userCreaterId = user.userId; // Lấy userId từ token để tạo tên file

    const { groupName } = body;

    // validate dữ liệu đầu vào
    if (!userCreaterId && !groupName) {
      return {
        status: 'error',
        message: 'Thiếu thông tin để cập nhật nhóm chat!',
      };
    }

    // gọi service updateGroupChat
    try {
      // Url của groupAvatar
      // Nếu không có file nào được upload, sử dụng URL mặc định
      let groupAvatarUrl =
        'https://www.shutterstock.com/image-vector/avatar-group-people-chat-icon-260nw-2163070859.jpg'; // Lấy URL đầu tiên làm avatar

      if (groupAvatar) {
        // Gọi service upload file avatar group
        const uploadedFiles =
          await this.cloundinaryService.uploadFileByMultiformData(
            groupAvatar,
            'ZaloClone/group_avatars',
            userCreaterId,
          );

        groupAvatarUrl = uploadedFiles?.url || groupAvatarUrl; // Lấy URL đầu tiên làm avatar
      }

      const group = await this.chatService.updateGroupInfo(
        conversationId,
        groupName,
        groupAvatarUrl,
      );

      return {
        status: 'success',
        message: 'Cập nhật nhóm chat thành công!',
        data: group,
      };
    } catch (error) {
      console.error('❌ Lỗi khi cập nhật nhóm:', error);
      return {
        status: 'error',
        message: 'Không thể cập nhật nhóm chat!',
      };
    }
  }

  // ==============                   =============
  // ============== Chuyển quyền admin =============
  // ==============                    =============
  @Post('conversations/:conversationId/transferadmin/:userId')
  async changeRole(
    @Param('conversationId') conversationId: string,
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    // Lấy userId từ token
    const user = req['user'];
    const userCreaterId = user.userId; // Lấy userId từ token để tạo tên file

    // Kiểm tra có phải admin ko
    const isAdmin = await this.chatService.checkAdminInGroup(
      conversationId,
      userCreaterId,
    );
    if (!isAdmin) {
      return {
        status: 'error',
        message: 'Bạn không có quyền chuyển quyền admin cho người khác!',
      };
    }

    return this.chatService.transferAdmin(
      conversationId,
      userCreaterId, // admin hiện tại
      userId,
    );
  }

  // ==============                          =============
  // ============== Lấy danh sách group chat =============
  // ==============                          =============
  // @Get('conversations/group/:userId')
  // async getGroupChat(@Param('userId') userId: string) {
  //   return this.chatService.getGroupChat(userId);
  // }
}
