import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { Message, MessageSchema } from './schema/message.schema';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { GroupMember, GroupMemberSchema } from './schema/groupMember.schema';
import { CloundinaryModule } from '../cloundinary/cloundinary.module';
import { JwtService } from '@nestjs/jwt';
import { Invitation, InvitationSchema } from './schema/Invitation';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Message.name, schema: MessageSchema },
      { name: Conversation.name, schema: ConversationSchema },
      { name: GroupMember.name, schema: GroupMemberSchema },
      { name: Invitation.name, schema: InvitationSchema },
    ]),
    CloundinaryModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, JwtService],
})
export class ChatModule {}
