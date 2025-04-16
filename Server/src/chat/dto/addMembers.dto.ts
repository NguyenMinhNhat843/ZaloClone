// src/chat/dto/add-members.dto.ts
import { IsArray, ArrayNotEmpty, IsMongoId } from 'class-validator';

export class AddMembersDto {
  @IsArray()
  @ArrayNotEmpty({ message: 'Danh sách thành viên không được để trống' })
  @IsMongoId({
    each: true,
    message: 'Mỗi ID thành viên phải là một MongoId hợp lệ',
  })
  members: string[];
}
