import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  _id?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop()
  attachments: [
    {
      url: String;
      type: { type: String; enum: ['image', 'video', 'file'] }; // xác định loại tệp
    },
  ];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  seenBy: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  deletedFor: Types.ObjectId[];
}

export const MessageSchema = SchemaFactory.createForClass(Message);
