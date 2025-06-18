import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateAuthDto {
  @ApiProperty({ description: '姓名' })
  @IsNotEmpty({ message: '姓名必填' })
  username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码必填' })
  password: string;
}

/**
 * 基于邮箱的认证DTO
 */
export class EmailAuthDto {
  @ApiProperty({ description: '邮箱地址' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱必填' })
  email: string;

  @ApiProperty({ description: '用户名', required: false })
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Cursor用户ID', required: false })
  @IsOptional()
  cursorUserId?: string;

  @ApiProperty({ description: '头像URL', required: false })
  @IsOptional()
  avatar?: string;
}
