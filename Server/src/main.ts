import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Bật CORS cho WebSocket nếu cần
  app.enableCors({
    origin: '*', // Cho phép tất cả các origin (thử với '*' trước, sau đó có thể chỉ định origin cụ thể)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  // 🔹 Kích hoạt validation toàn bộ ứng dụng
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useWebSocketAdapter(new IoAdapter(app));

  // await app.listen(process.env.PORT ?? 3000);
  // Lắng nghe cổng được chỉ định trong biến môi trường hoặc cổng 3000
  await app.listen(process.env.PORT || 3000, '0.0.0.0');

}
bootstrap();
