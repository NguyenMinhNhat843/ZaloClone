// import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateUserDto {
  //   @IsOptional()
  //   @IsString()
  firstName?: string;

  //   @IsOptional()
  //   @IsString()
  lastName?: string;

  //   @IsOptional()
  //   @IsString()
  avatar?: string;

  //   @IsOptional()
  //   @IsString()
  address?: string;

  //   @IsOptional()
  //   @IsDate()
  dateOfBirth?: Date;
}
