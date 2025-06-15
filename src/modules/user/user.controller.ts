import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

/**
 * 用户控制器
 */
@ApiTags('用户管理')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 根据邮箱获取或创建用户
   */
  @Post('login')
  @ApiOperation({ summary: '用户登录/注册' })
  async loginOrCreate(@Body() createUserDto: CreateUserDto) {
    return this.userService.findOrCreateByEmail(createUserDto);
  }

  /**
   * 获取用户信息
   */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '获取用户信息' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
