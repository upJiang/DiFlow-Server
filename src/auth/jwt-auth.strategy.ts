import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from '../common/constants';
import { PluginService } from './plugin.service';

export interface JwtPayload {
  email: string; // 只使用email作为唯一标识符
}

@Injectable()
// 验证请求头中的token
export default class JwtAuthStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly pluginService: PluginService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    console.log('🔍 JWT验证 - payload:', payload);

    try {
      if (!payload.email) {
        console.error('❌ Token中缺少email信息');
        throw new UnauthorizedException('Token中缺少用户邮箱信息');
      }

      console.log('🔍 使用email查找用户:', payload.email);

      // 通过email查找用户
      const user = await this.pluginService.findUserByEmail(payload.email);

      if (!user) {
        console.error('❌ 用户不存在:', payload.email);
        throw new UnauthorizedException('用户不存在或已被禁用');
      }

      console.log('🔍 找到用户:', { id: user.id, email: user.email });

      return {
        id: user.id,
        email: user.email,
        username: user.username,
        cursorUserId: user.cursorUserId,
        avatar: user.avatar,
      };
    } catch (error) {
      console.error('❌ JWT验证失败:', error);
      throw new UnauthorizedException('用户验证失败');
    }
  }
}
