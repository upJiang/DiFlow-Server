import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursorController } from './cursor.controller';
import { CursorService } from './cursor.service';
import { CursorRuleEntity } from './entities/cursor-rule.entity';
import { CursorMcpEntity } from './entities/cursor-mcp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CursorRuleEntity, CursorMcpEntity])],
  controllers: [CursorController],
  providers: [CursorService],
  exports: [CursorService],
})
export class CursorModule {}
