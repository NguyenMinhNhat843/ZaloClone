import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users.schema';
import { UserController } from './users.controller';
import { UserService } from './user.service';
import { CloundinaryService } from 'src/cloundinary/cloundinary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, CloundinaryService],
  exports: [UserService],
})
export class UserModule {}
