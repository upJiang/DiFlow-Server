import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class CreateRuleDto {
  @ApiProperty({ description: '规则名称' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: '规则内容' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: '规则描述', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '规则类型', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ description: '排序', required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiProperty({ description: '是否启用', required: false, default: true })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;
}

export class UpdateRuleDto extends PartialType(CreateRuleDto) {}
