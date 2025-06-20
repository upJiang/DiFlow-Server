import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PluginUserEntity } from './entities/plugin-user.entity';
import { JwtModule } from '@nestjs/jwt';
import JwtAuthStrategy from './jwt-auth.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([PluginUserEntity]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'diflow-cursor-secret',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
