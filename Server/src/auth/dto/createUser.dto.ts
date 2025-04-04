import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  //   @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  gmail: string; // Thêm trường gmail vào đây nếu cần thiết

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional() // Giới tính không phải là bắt buộc
  gender: string;

  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  avatar: string; // Đây có thể là URL của ảnh đã upload lên Cloudinary
}
