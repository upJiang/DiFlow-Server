import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto, EmailAuthDto } from './dto/create-auth.dto';
import { AuthEntity } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../redis/redis.service';
import { PluginUserEntity } from './entities/plugin-user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity) private readonly auth: Repository<AuthEntity>,
    @InjectRepository(PluginUserEntity)
    private readonly pluginUserRepository: Repository<PluginUserEntity>,
    private readonly JwtService: JwtService,
    private readonly redisService: RedisService, // 注册redis控制器
  ) {}

  // 注册
  async signup(signupData: CreateAuthDto) {
    const findUser = await this.auth.findOne({
      where: { username: signupData.username },
    });
    if (findUser && findUser.username === signupData.username)
      return '用户已存在';
    // 对密码进行加密处理
    signupData.password = bcryptjs.hashSync(signupData.password, 10);
    await this.auth.save(signupData);
    // 尝试将注册成功的用户存入redis中
    this.redisService.set(signupData.username, signupData.password);
    return '注册成功';
  }

  // 登录
  async login(loginData: CreateAuthDto) {
    const findUser = await this.auth.findOne({
      where: { username: loginData.username },
    });
    // 没有找到
    if (!findUser) return new BadRequestException('用户不存在');

    // 找到了对比密码
    const compareRes: boolean = bcryptjs.compareSync(
      loginData.password,
      findUser.password,
    );
    // 密码不正确
    if (!compareRes) return new BadRequestException('密码不正确');
    const payload = { username: findUser.username };

    return {
      access_token: this.JwtService.sign(payload),
      msg: '登录成功',
    };
  }

  /**
   * 基于邮箱的登录或创建用户
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

    // 生成JWT token
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }
}
