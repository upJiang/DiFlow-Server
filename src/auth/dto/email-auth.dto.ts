import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

/**
 * 邮箱认证DTO - 唯一的认证方式
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
