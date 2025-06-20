import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { EmailAuthDto } from './dto/email-auth.dto';
import { Public } from 'src/common/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 基于邮箱的登录或创建用户 - 唯一的认证方式
   * @param emailData 邮箱认证数据
   */
  @Public()
  @Post('/email-login')
  emailLogin(@Body() emailData: EmailAuthDto) {
    return this.authService.emailLogin(emailData);
  }
}
