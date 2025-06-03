// src/friendship/schemas/friendship.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema, Document } from 'mongoose';

export type FriendshipDocument = Friendship & Document;

@Schema({ timestamps: true })
export class Friendship {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  requester: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recipient: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'accepted', 'blocked'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'blocked';
}

export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
