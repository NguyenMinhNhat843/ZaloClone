import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';
import { UserDocument } from 'src/user/users.schema';
import { GroupMember } from './schema/groupMember.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(GroupMember.name) private groupMemberModel: Model<GroupMember>,
    // @InjectModel('User') private userModel: Model<UserDocument>,
  ) {}

  // ========================== Gửi tin nhắn trong cuộc trò chuyện cá nhân
  async sendMessage(senderId: string, receiverId: string, text: string) {
    const senderObjId = new Types.ObjectId(senderId);
    const receiverObjId = new Types.ObjectId(receiverId);

    // console.log('🔹 senderObjId:', senderObjId); // in ra đc
    // console.log('🔹 receiverObjId:', receiverObjId); // in ra đc

    // 🔍 Tìm hoặc tạo cuộc trò chuyện
    let conversation = await this.conversationModel.findOne({
      type: 'private',
      participants: { $all: [senderObjId, receiverObjId] },
    });

    // console.log('📝 Tìm conversation:', conversation); // ra null - đúng vì chưa có conversation nào

    // ✅ Nếu không tìm thấy, tạo mới
    if (!conversation) {
      conversation = await this.conversationModel.create({
        participants: [senderObjId, receiverObjId],
        type: 'private',
      });

      // Tạo mới groupMember cho conver đó
      await this.groupMemberModel.create(
        {
          conversationId: conversation._id,
          userId: senderObjId,
        },
        {
          conversationId: conversation._id,
          userId: receiverObjId,
        },
      );

      // console.log('🆕 Conversation mới tạo:', conversation); // in ra đc
    }

    // console.log('📌 _id của conversation:', conversation?._id); // in ra đc

    // ✉️ Lưu tin nhắn vào DB
    const newMessage = await this.messageModel.create({
      conversationId: conversation._id,
      sender: senderObjId,
      text,
      seenBy: [],
    });

    // console.log('📨 Tin nhắn mới tạo:', newMessage);

    // 🔄 Cập nhật lastMessage
    conversation.lastMessage = {
      sender: senderObjId,
      text,
      timestamp: new Date(),
    };

    await conversation.save();

    return newMessage;
  }

  // =============================== Lấy tất cả conversation trong hệ thống
  async getAllConversation() {
    return await this.conversationModel.find().sort({ updatedAt: -1 });
  }

  // ==================================== Lấy danh sách cuộc trò chuyện của người dùng
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
    const result = await this.messageModel.findByIdAndDelete(messageId);
    if (!result) {
      throw new NotFoundException('Message not found');
    }
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
}
