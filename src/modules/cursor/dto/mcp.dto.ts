import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';

/**
 * 创建MCP配置DTO
 */
export class CreateMcpDto {
  @ApiProperty({ description: 'MCP服务器名称' })
  @IsString({ message: 'MCP服务器名称必须是字符串' })
  @IsNotEmpty({ message: 'MCP服务器名称不能为空' })
  name: string;

  @ApiProperty({ description: 'MCP服务器命令' })
  @IsString({ message: 'MCP服务器命令必须是字符串' })
  @IsNotEmpty({ message: 'MCP服务器命令不能为空' })
  command: string;

  @ApiProperty({
    description: 'MCP服务器参数',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'MCP服务器参数必须是数组' })
  args?: string[];

  @ApiProperty({
    description: 'MCP服务器环境变量',
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject({ message: 'MCP服务器环境变量必须是对象' })
  env?: Record<string, string>;

  @ApiProperty({ description: 'MCP服务器描述', required: false })
  @IsOptional()
  @IsString({ message: 'MCP服务器描述必须是字符串' })
  description?: string;

  @ApiProperty({ description: '是否启用', required: false, default: true })
  @IsOptional()
  @IsBoolean({ message: '启用状态必须是布尔值' })
  enabled?: boolean;
}

/**
 * 更新MCP配置DTO
 */
export class UpdateMcpDto {
  @ApiProperty({ description: 'MCP服务器名称', required: false })
  @IsOptional()
  @IsString({ message: 'MCP服务器名称必须是字符串' })
  @IsNotEmpty({ message: 'MCP服务器名称不能为空' })
  name?: string;

  @ApiProperty({ description: 'MCP服务器命令', required: false })
  @IsOptional()
  @IsString({ message: 'MCP服务器命令必须是字符串' })
  @IsNotEmpty({ message: 'MCP服务器命令不能为空' })
  command?: string;

  @ApiProperty({
    description: 'MCP服务器参数',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray({ message: 'MCP服务器参数必须是数组' })
  args?: string[];

  @ApiProperty({
    description: 'MCP服务器环境变量',
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject({ message: 'MCP服务器环境变量必须是对象' })
  env?: Record<string, string>;

  @ApiProperty({ description: 'MCP服务器描述', required: false })
  @IsOptional()
  @IsString({ message: 'MCP服务器描述必须是字符串' })
  description?: string;

  @ApiProperty({ description: '是否启用', required: false })
  @IsOptional()
  @IsBoolean({ message: '启用状态必须是布尔值' })
  enabled?: boolean;
}

/**
 * MCP配置分享DTO
 */
export class ShareMcpConfigDto {
  @ApiProperty({ description: '分享标题' })
  @IsString({ message: '分享标题必须是字符串' })
  @IsNotEmpty({ message: '分享标题不能为空' })
  title: string;

  @ApiProperty({ description: '分享描述', required: false })
  @IsOptional()
  @IsString({ message: '分享描述必须是字符串' })
  description?: string;

  @ApiProperty({ description: 'MCP配置JSON', type: Object, required: false })
  @IsOptional()
  @IsObject({ message: 'MCP配置必须是对象' })
  mcpConfig?: Record<string, any>;
}

/**
 * 通过分享ID添加MCP配置DTO
 */
export class AddMcpByShareIdDto {
  @ApiProperty({ description: '分享ID' })
  @IsString({ message: '分享ID必须是字符串' })
  @IsNotEmpty({ message: '分享ID不能为空' })
  shareId: string;
}

/**
 * 批量更新MCP配置DTO
 */
export class BatchUpdateMcpDto {
  @ApiProperty({ description: 'MCP配置JSON', type: Object })
  @IsObject({ message: 'MCP配置必须是对象' })
  @IsNotEmpty({ message: 'MCP配置不能为空' })
  mcpConfig: Record<string, any>;
}
