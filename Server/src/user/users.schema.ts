import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { timestamp } from 'rxjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true }) // Tự tạo createdAt và updatedAt
export class User {
  _id?: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  gmail: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name: string;

  @Prop()
  gender: string;

  @Prop()
  role: string;

  @Prop()
  avatar: string;

  @Prop()
  address: string;

  @Prop()
  dateOfBirth: Date;

  @Prop()
  otp?: string;

  @Prop()
  otpExpires?: Date;

  @Prop({ enum: ['online', 'offline'], default: 'offline' })
  status: string;

  @Prop({ default: Date.now })
  lastActive: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
