import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursorController } from './cursor.controller';
import { CursorService } from './cursor.service';
import { PluginCursorRulesEntity } from '../../auth/entities/plugin-cursor-rules.entity';
import { PluginCursorMcpsEntity } from '../../auth/entities/plugin-cursor-mcps.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PluginCursorRulesEntity, PluginCursorMcpsEntity]),
    AuthModule,
  ],
  controllers: [CursorController],
  providers: [CursorService],
  exports: [CursorService],
})
export class CursorModule {}
