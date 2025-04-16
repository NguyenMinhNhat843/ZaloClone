import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtMiddleware } from './auth/jwt.middleware';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri)
  throw new Error('❌ Thiếu biến môi trường MONGODB_URI trong file .env');

const publicRoutes = [
  'auth/login',
  'auth/register',
  'auth/send',
  'auth/verify',
  'users/check-phone',
  'users/reset-password',
  'users',
  'chat/conversations',
  'chat/conversation/:conversationId',
  'users/admin/delete-all',
  'users/:param',
];

@Module({
  imports: [
    MongooseModule.forRoot(uri, {
      dbName: 'zalo',
      connectionFactory: (connection) => {
        console.log('✅ Đã kết nối MongoDB Atlas!');
        return connection;
      },
    }),
    UserModule,
    AuthModule,
    ChatModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude(...publicRoutes)
      .forRoutes('*');
  }
}
