import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PluginUserEntity } from './entities/plugin-user.entity';

export interface JwtPayload {
  email: string;
  sub: number;
}

@Injectable()
export default class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(PluginUserEntity)
    private readonly pluginUserRepository: Repository<PluginUserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'diflow-cursor-secret',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('🔍 JWT验证 - payload:', payload);

    if (!payload.email) {
      console.error('❌ Token中缺少email信息');
      throw new UnauthorizedException('Token中缺少用户邮箱信息');
    }

    // 通过email查找用户
    const user = await this.pluginUserRepository.findOne({
      where: { email: payload.email, isActive: true },
    });

    if (!user) {
      console.error('❌ 用户不存在:', payload.email);
      throw new UnauthorizedException('用户不存在或已被禁用');
    }

    console.log('✅ JWT验证成功 - 用户:', user.email);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      cursorUserId: user.cursorUserId,
      avatar: user.avatar,
    };
  }
}
