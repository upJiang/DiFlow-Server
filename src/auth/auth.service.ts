import { Injectable } from '@nestjs/common';
import { EmailAuthDto } from './dto/email-auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { PluginUserEntity } from './entities/plugin-user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PluginUserEntity)
    private readonly pluginUserRepository: Repository<PluginUserEntity>,
    private readonly JwtService: JwtService,
  ) {}

  /**
   * 基于邮箱的登录或创建用户 - 唯一的认证方式
   * 邮箱是唯一标识，不需要密码验证
   */
  async emailLogin(
    emailAuthDto: EmailAuthDto,
  ): Promise<{ access_token: string }> {
    const { email, username, cursorUserId, avatar } = emailAuthDto;

    // 查找或创建用户
    let user = await this.pluginUserRepository.findOne({ where: { email } });

    if (!user) {
      // 用户不存在，创建新用户
      user = this.pluginUserRepository.create({
        email,
        username: username || email.split('@')[0], // 如果没有提供用户名，使用邮箱前缀
        cursorUserId,
        avatar,
        isActive: true,
      });
      await this.pluginUserRepository.save(user);
    } else {
      // 用户存在，更新信息（如果提供了新信息）
      if (username && username !== user.username) {
        user.username = username;
      }
      if (cursorUserId && cursorUserId !== user.cursorUserId) {
        user.cursorUserId = cursorUserId;
      }
      if (avatar && avatar !== user.avatar) {
        user.avatar = avatar;
      }
      await this.pluginUserRepository.save(user);
    }

    // 生成JWT token，只使用email作为唯一标识
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }
}
