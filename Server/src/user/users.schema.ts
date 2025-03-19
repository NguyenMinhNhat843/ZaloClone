import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { timestamp } from 'rxjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Tự tạo createdAt và updatedAt
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
