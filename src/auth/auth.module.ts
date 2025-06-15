import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PluginService } from './plugin.service';
import { PluginController } from './plugin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { PluginUserEntity } from './entities/plugin-user.entity';
import { PluginCursorRulesEntity } from './entities/plugin-cursor-rules.entity';
import { PluginCursorMcpsEntity } from './entities/plugin-cursor-mcps.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../common/constants';
import JwtAuthStrategy from './jwt-auth.strategy';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthEntity,
      PluginUserEntity,
      PluginCursorRulesEntity,
      PluginCursorMcpsEntity,
    ]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    RedisModule,
  ],
  controllers: [AuthController, PluginController],
  providers: [AuthService, PluginService, JwtAuthStrategy],
  exports: [PluginService],
})
export class AuthModule {}
