import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * 创建用户DTO
 */
export class CreateUserDto {
  @ApiProperty({ description: '用户邮箱' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '用户名', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: '头像', required: false })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({ description: 'Cursor 用户ID', required: false })
  @IsString()
  @IsOptional()
  cursorUserId?: string;
}
