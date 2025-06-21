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
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 基于邮箱的登录或创建用户 - 唯一的认证方式
   * 邮箱是唯一标识，不需要密码验证
   */
  async emailLogin(
    emailAuthDto: EmailAuthDto,
  ): Promise<{ access_token: string }> {
    const { email } = emailAuthDto;

    // 查找或创建用户
    let user = await this.pluginUserRepository.findOne({ where: { email } });

    if (!user) {
      // 用户不存在，创建新用户
      user = this.pluginUserRepository.create({
        email,
      });
      await this.pluginUserRepository.save(user);
    }

    // 生成JWT token，只使用email作为唯一标识
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
