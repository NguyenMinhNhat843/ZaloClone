import { Injectable, NotFoundException, Type } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';
import { UserDocument } from 'src/user/users.schema';
import { GroupMember } from './schema/groupMember.schema';
import { Multer } from 'multer';
import { CloundinaryService } from '../cloundinary/cloundinary.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(GroupMember.name) private groupMemberModel: Model<GroupMember>,
    private cloundinaryService: CloundinaryService,
    // @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  // =============== Tìm conversation ===============
  async findConversation(senderId: Types.ObjectId, receiverId: Types.ObjectId) {
    return await this.conversationModel.findOne({
      type: 'private',
      participants: { $all: [senderId, receiverId] },
    });
  }

  // ================ Tạo groupMember ===================
  async createGroupMember(
    conversationId: Types.ObjectId,
    userId: Types.ObjectId,
    role: string = 'member',
  ) {
    return await this.groupMemberModel.create({
      conversationId,
      userId,
      role,
    });
  }

  // ================ Tạo conversation  ==================
  async createConversation(
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
  ) {
    // Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
    const existingConversation = await this.findConversation(
      senderId,
      receiverId,
    );

    if (existingConversation) {
      return existingConversation;
    }

    // Nếu chưa tồn tại, tạo mới cuộc trò chuyện
    const conversation = await this.conversationModel.create({
      participants: [senderId, receiverId],
      type: 'private',
    });

    // Tạo mới groupMember cho conversation đó
    await this.createGroupMember(conversation._id, senderId);
    await this.createGroupMember(conversation._id, receiverId);

    return conversation;
  }

  // ================== Gửi tin nhắn trong cuộc trò chuyện cá nhân ===============
  async sendMessage(
    senderId: string,
    receiverId: string,
    text: string,
    attachments?: {
      url: string;
      type: 'image' | 'video' | 'word' | 'excel' | 'text' | 'file';
      size: number;
    }[],
  ) {
    const senderObjId = new Types.ObjectId(senderId);
    const receiverObjId = new Types.ObjectId(receiverId);

    // gọi service tạo conversation
    const conversation = await this.createConversation(
      senderObjId,
      receiverObjId,
    );

    // Lưu tin nhắn vào DB
    const newMessage = await this.messageModel.create({
      conversationId: conversation._id,
      sender: senderObjId,
      text,
      attachments: attachments || [],
      seenBy: [],
    });

    // 🔄 Cập nhật lastMessage
    conversation.lastMessage = {
      sender: senderObjId,
      text,
      timestamp: new Date(),
    };
    // save conversation chứa lastmessage
    await conversation.save();

    // ✅ Trả về định dạng tin nhắn với senderId và receiverId
    return {
      _id: newMessage._id,
      conversationId: newMessage.conversationId,
      senderId: newMessage.sender.toString(), // Chuyển sender thành senderId
      receiverId: receiverId, // Lấy từ tham số, vì schema không lưu receiver
      text: newMessage.text,
      seenBy: newMessage.seenBy,
      deletedFor: newMessage.deletedFor,
      attachments: newMessage.attachments || [],
      createdAt: (newMessage as any).createdAt,
      updatedAt: (newMessage as any).updatedAt,
    };
  }

  // ================= Lấy danh sách cuộc trò chuyện của người dùng ==================
  async getUserConversations(userId: string) {
    const conversations = await this.conversationModel
      .find({ participants: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 })
      .lean(); // cho phép gán thêm field mới vào

    const result: any[] = [];

    for (const conversation of conversations) {
      // Nếu là private thì lấy thông tin của người còn lại
      if (conversation.type === 'private') {
        // console.log('conversation private'); // in ra đc
        const otherMember = await this.groupMemberModel
          .findOne({
            conversationId: conversation._id,
            userId: { $ne: new Types.ObjectId(userId) },
          })
          .populate('userId', 'name')
          .lean();

        // console.log('otherMember:', otherMember); // in ra đc

        if (!otherMember) {
          return {
            message: 'Không tìm thấy thành viên khác trong cuộc trò chuyện',
          };
        }
        const user = otherMember.userId as any;
        // console.log('user:', user); // in ra đc

        (conversation as any).nameConversation = user.name;
        conversation.groupAvatar =
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73Hx3joXluMeacnnC_5P92ZM4zbZq6-VYvWGrgPwLmEWlLRepRH1jYOGoQyHJYbviEnU&usqp=CAU';

        // console.log('conversation được format: ', conversation);
      }
      result.push(conversation);
    }
    return result;
  }

  // ============= Lấy thành viên trong cuộc trò chuyện theo idConversation ============
  async getGroupMembers(conversationId: string) {
    const members = await this.groupMemberModel
      .find({ conversationId: new Types.ObjectId(conversationId) })
      .populate('userId', 'name avatar')
      .lean();

    if (!members) {
      return {
        message: 'Không tìm thấy thành viên nào trong cuộc trò chuyện này',
      };
    }

    return members;
  }

  // ================================== Lấy tin nhắn trong 1 cuộc trò chuyện ===============
  async getMessages(conversationId: string) {
    const messages = await this.messageModel
      .find({ conversationId: new Types.ObjectId(conversationId) })
      .populate('sender', 'username avatar')
      .sort({ createdAt: 1 })
      .exec();

    return messages;
  }

  // ================================ Xóa tin nhắn ======================
  async deleteMessage(messageId: string) {
    // console.log('🔹 Xóa tin nhắn:', messageId); // in ra đc
    const result = await this.messageModel.findByIdAndDelete(
      new Types.ObjectId(messageId),
    );
    // console.log('🔹 Kết quả xóa tin nhắn:', result); // in ra đc
    if (!result) {
      throw new NotFoundException('Message not found');
    }
  }

  // ============ Thu hồi tin nhắn =============
  async revokeMessage(messageId: string, userId: string) {
    const messageObjectId = new Types.ObjectId(messageId);
    const userObjectId = new Types.ObjectId(userId);

    // Kiểm tra xem tin nhắn có tồn tại không
    const message = await this.messageModel.findById(messageObjectId);

    // Nếu không tìm thấy tin nhắn, ném ra lỗi NotFoundException
    if (!message) {
      throw new NotFoundException('Tin nhắn không tồn tại');
    }

    // Kiểm tra nếu user đã thu hồi rồi thì không làm gì
    if (message.deletedFor?.includes(userObjectId)) {
      return {
        message: 'Tin nhắn đã được thu hồi trước đó.',
      };
    }

    // Cập nhật message: thêm user vào danh sách deletedFor
    message.deletedFor = [...(message.deletedFor || []), userObjectId];

    await message.save();

    return {
      message: 'Thu hồi tin nhắn thành công',
      messageId: message._id,
    };
  }

  // ================ Admin: Lấy tất cả conversation trong hệ thống ====================
  async getAllConversation() {
    return await this.conversationModel.find().sort({ updatedAt: -1 });
  }

  // ======================== admin: xóa hết message trong hệ thống ===================
  async deleteAllMessages() {
    const result = await this.messageModel.deleteMany({});
    if (result.deletedCount === 0) {
      throw new NotFoundException('No messages found to delete');
    }
    return { message: 'All messages deleted successfully' };
  }

  // ======================= xóa 1 conversation ===================
  async deleteOneConversation(conversationId: string) {
    const result =
      await this.conversationModel.findByIdAndDelete(conversationId);

    if (!result) {
      return { message: 'Không tìm thấy đoạn hội thoại!!!' };
    }

    // Xóa tất cả tin nhắn trong đoạn hội thoại đó
    await this.messageModel.deleteMany({
      conversationId: new Types.ObjectId(conversationId),
    });

    // Xóa tất cả thành viên trong đoạn hội thoại đó
    await this.groupMemberModel.deleteMany({
      conversationId: new Types.ObjectId(conversationId),
    });

    return { message: 'Đã xóa đoạn hội thoại thành công!!!' };
  }

  // ================= Chức năng group chat ====================
  // ================= Thêm thành viên vào group chat ====================
  async addMembersToGroup(
    conversationId: string,
    userIds: string[],
    userId: string,
  ) {
    const conversationObjId = new Types.ObjectId(conversationId);
    const userObjId = new Types.ObjectId(userId);

    // Kiểm tra xem cuộc trò chuyện có tồn tại không
    const conversation =
      await this.conversationModel.findById(conversationObjId);
    if (!conversation) {
      throw new NotFoundException('Cuộc trò chuyện không tồn tại');
    }

    // Kiểm tra xem người dùng có phải là người tạo cuộc trò chuyện không
    const isAdmin = conversation.participants.includes(userObjId);
    if (!isAdmin) {
      throw new NotFoundException(
        'Bạn không có quyền thêm thành viên vào nhóm',
      );
    }

    // Thêm các thành viên mới vào cuộc trò chuyện nhóm
    for (const userId of userIds) {
      const userObjId = new Types.ObjectId(userId);
      await this.createGroupMember(conversation._id, userObjId);
      conversation.participants.push(userObjId);
    }

    await conversation.save();

    return { message: 'Thêm thành viên vào nhóm thành công' };
  }

  // ================= Tạo group Chat ====================
  async createGroupChat(
    userCreaterId: string,
    groupName: string,
    groupAvatar: string,
    participants: string[],
  ) {
    // Tạo mới cuộc trò chuyện nhóm
    const groupConversation = await this.conversationModel.create({
      groupName: groupName,
      type: 'group',
      groupAvatar,
      participants: [participants],
    });

    // Set role admin cho người tạo nhóm
    const userCreaterObjId = new Types.ObjectId(userCreaterId);
    await this.createGroupMember(
      groupConversation._id,
      userCreaterObjId,
      'admin',
    );

    // Thêm các participants vào groupMembers schema
    for (const participant of participants) {
      const participantObjId = new Types.ObjectId(participant);
      await this.createGroupMember(groupConversation._id, participantObjId);
    }

    return groupConversation;
  }

  // =================== Cập nhật thông tin nhóm ====================
  async updateGroupInfo(
    conversationId: string,
    groupName?: string,
    groupAvatar?: string,
  ) {
    const conversationObjId = new Types.ObjectId(conversationId);

    // Tìm cuộc trò chuyện nhóm
    const conversation =
      await this.conversationModel.findById(conversationObjId);
    if (!conversation) {
      throw new NotFoundException('Cuộc trò chuyện không tồn tại');
    }

    // Cập nhật thông tin nhóm
    if (groupName) {
      conversation.groupName = groupName;
    }
    if (groupAvatar) {
      conversation.groupAvatar = groupAvatar;
    }

    await conversation.save();

    return { message: 'Cập nhật thông tin nhóm thành công' };
  }
}
