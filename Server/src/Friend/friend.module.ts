// src/friendship/friendship.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Friendship, FriendshipSchema } from './friend.schema';
import { FriendshipService } from './friend.service';
import { FriendshipController } from './friend.controller';
import { FriendGateway } from './friend.gateway';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Friendship.name, schema: FriendshipSchema },
    ]),
    JwtModule.register({}),
  ],
  providers: [FriendshipService, FriendGateway],
  controllers: [FriendshipController],
  exports: [FriendshipService],
})
export class FriendshipModule {}
