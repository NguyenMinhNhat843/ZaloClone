import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './auth/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';

dotenv.config(); // Load biến môi trường từ file .env

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Thiếu biến môi trường MONGO_URI trong file .env');
}

@Module({
  imports: [
    MongooseModule.forRoot(uri, {
      dbName: 'zalo',
      connectionFactory: (connection) => {
        console.log('✅ Kết nối MongoDB Atlas thành công!');
        return connection;
      },
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*'); // Bảo vệ tất cả route
  }
}
