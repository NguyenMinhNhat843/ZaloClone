import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  Matches,
  IsIn,
  IsEmail,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // ✅ Ràng buộc: Bắt đầu bằng số 0, theo sau là 9 chữ số (tổng 10 số)
  @Matches(/^0\d{9}$/, {
    message: 'Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số',
  })
  phone: string;

  // ✅ Email đúng định dạng
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty()
  gmail: string;

  // ✅ Password có ít nhất: 1 chữ hoa, 1 số, 1 ký tự đặc biệt, tối thiểu 8 ký tự
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt',
  })
  @IsNotEmpty()
  password: string;

  // ✅ Chỉ cho phép 'Nam' hoặc 'Nữ'
  @IsIn(['Nam', 'Nữ'], { message: 'Giới tính chỉ được là "Nam" hoặc "Nữ"' })
  @IsOptional()
  gender: string;

  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  @IsNotEmpty()
  dateOfBirth: string;
}
