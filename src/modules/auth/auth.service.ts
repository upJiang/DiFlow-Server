import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string): Promise<UserEntity> {
    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // 如果用户不存在，创建新用户
      user = this.userRepository.create({
        email,
        name: email.split('@')[0], // 使用邮箱前缀作为默认用户名
      });
      user = await this.userRepository.save(user);
    }

    return user;
  }

  async login(
    email: string,
  ): Promise<{ access_token: string; user: UserEntity }> {
    const user = await this.validateUser(email);
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async getUserByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getUserById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }
}
