import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class CreateMcpDto {
  @ApiProperty({ description: 'MCP 服务器名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'MCP 服务器命令' })
  @IsString()
  @IsNotEmpty()
  command: string;

  @ApiProperty({
    description: 'MCP 服务器参数（JSON 字符串）',
    required: false,
  })
  @IsString()
  @IsOptional()
  args?: string;

  @ApiProperty({ description: 'MCP 服务器环境变量', required: false })
  @IsObject()
  @IsOptional()
  env?: Record<string, string>;

  @ApiProperty({ description: 'MCP 服务器描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '是否启用', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}

export class UpdateMcpDto extends PartialType(CreateMcpDto) {}
