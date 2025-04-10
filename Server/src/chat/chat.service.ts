import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';
import { UserDocument } from 'src/user/users.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
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
    return this.conversationModel
      .find({ participants: new Types.ObjectId(userId) })
      .sort({ updatedAt: -1 });
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
}
