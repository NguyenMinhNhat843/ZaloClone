import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true })
export class Conversation {
  // @Prop({ type: Types.ObjectId, auto: true }) // ✅ Mongoose sẽ tự động tạo _id
  _id?: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  @Prop({ enum: ['private', 'group'], required: true })
  type: string;

  @Prop()
  groupName?: string;

  @Prop()
  groupAvatar?: string;

  @Prop({
    type: {
      sender: { type: Types.ObjectId, ref: 'User' },
      text: String,
      timestamp: Date,
    },
    default: null,
  })
  lastMessage: {
    sender: Types.ObjectId;
    text: string;
    timestamp: Date;
  };
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
