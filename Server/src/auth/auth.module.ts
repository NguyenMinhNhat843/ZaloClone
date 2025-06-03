import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { User, UserSchema } from 'src/user/users.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { UserService } from 'src/user/user.service';
// dot env
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { MailService } from './services/mail.service';
import { CloundinaryService } from 'src/cloundinary/cloundinary.service';
dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    MailService,
    CloundinaryService,
  ],
  exports: [AuthService, JwtModule, MailService],
})
export class AuthModule {}
