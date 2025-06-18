import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, EmailAuthDto } from './dto/create-auth.dto';
import { Public } from 'src/common/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 注册
   * @param name 姓名
   * @param password 密码
   */
  @Public()
  @Post('/signup')
  signup(@Body() signupData: CreateAuthDto) {
    return this.authService.signup(signupData);
  }

  /**
   * 登录
   * @param name 姓名
   * @param password 密码
   */
  @Public()
  @Post('/login')
  login(@Body() loginData: CreateAuthDto) {
    return this.authService.login(loginData);
  }

  /**
   * 基于邮箱的登录或创建用户
   * @param emailData 邮箱认证数据
   */
  @Public()
  @Post('/email-login')
  emailLogin(@Body() emailData: EmailAuthDto) {
    return this.authService.emailLogin(emailData);
  }
}
