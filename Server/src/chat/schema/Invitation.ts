import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type InvitationDocument = Invitation & Document;

@Schema({ timestamps: true })
export class Invitation {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  fromUser: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  toUser: Types.ObjectId;

  @Prop({ type: String, enum: ['friend', 'group'], required: true })
  type: 'friend' | 'group';

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: false })
  conversationId?: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'rejected';
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);
