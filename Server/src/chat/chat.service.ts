import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from './schema/message.schema';
import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
  ) {}

  async sendMessage(senderId: string, conversationId: string, content: string) {
    const message = await this.messageModel.create({
      sender: senderId,
      conversation: conversationId,
      content,
    });

    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
    });

    return message;
  }

  async getMessages(conversationId: string) {
    return this.messageModel
      .find({ conversation: conversationId })
      .populate('sender');
  }
}
