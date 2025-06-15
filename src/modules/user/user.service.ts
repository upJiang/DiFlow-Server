import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';

/**
 * 用户服务
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 根据邮箱查找或创建用户
   */
  async findOrCreateByEmail(createUserDto: CreateUserDto) {
    let user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (!user) {
      user = this.userRepository.create(createUserDto);
      user = await this.userRepository.save(user);
    }

    // 生成 JWT token
    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user,
      token,
    };
  }

  /**
   * 根据ID查找用户
   */
  async findOne(id: number): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  /**
   * 根据邮箱查找用户
   */
  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(userData: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async update(id: number, userData: Partial<UserEntity>): Promise<UserEntity> {
    await this.userRepository.update(id, userData);
    return this.findOne(id);
  }
}
