import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

/**
 * 创建规则DTO
 */
export class CreateRuleDto {
  @ApiProperty({ description: '规则名称' })
  @IsString({ message: '规则名称必须是字符串' })
  @IsNotEmpty({ message: '规则名称不能为空' })
  name: string;

  @ApiProperty({ description: '规则内容' })
  @IsString({ message: '规则内容必须是字符串' })
  @IsNotEmpty({ message: '规则内容不能为空' })
  content: string;

  @ApiProperty({ description: '规则描述', required: false })
  @IsOptional()
  @IsString({ message: '规则描述必须是字符串' })
  description?: string;

  @ApiProperty({ description: '规则类型', required: false })
  @IsOptional()
  @IsString({ message: '规则类型必须是字符串' })
  type?: string;

  @ApiProperty({ description: '是否启用', required: false, default: true })
  @IsOptional()
  @IsBoolean({ message: '启用状态必须是布尔值' })
  enabled?: boolean;

  @ApiProperty({ description: '排序', required: false, default: 0 })
  @IsOptional()
  @IsNumber({}, { message: '排序必须是数字' })
  order?: number;
}

/**
 * 更新规则DTO
 */
export class UpdateRuleDto {
  @ApiProperty({ description: '规则名称', required: false })
  @IsOptional()
  @IsString({ message: '规则名称必须是字符串' })
  @IsNotEmpty({ message: '规则名称不能为空' })
  name?: string;

  @ApiProperty({ description: '规则内容', required: false })
  @IsOptional()
  @IsString({ message: '规则内容必须是字符串' })
  @IsNotEmpty({ message: '规则内容不能为空' })
  content?: string;

  @ApiProperty({ description: '规则描述', required: false })
  @IsOptional()
  @IsString({ message: '规则描述必须是字符串' })
  description?: string;

  @ApiProperty({ description: '规则类型', required: false })
  @IsOptional()
  @IsString({ message: '规则类型必须是字符串' })
  type?: string;

  @ApiProperty({ description: '是否启用', required: false })
  @IsOptional()
  @IsBoolean({ message: '启用状态必须是布尔值' })
  enabled?: boolean;

  @ApiProperty({ description: '排序', required: false })
  @IsOptional()
  @IsNumber({}, { message: '排序必须是数字' })
  order?: number;
}
