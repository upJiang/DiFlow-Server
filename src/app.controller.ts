import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @Public()
  getHealth() {
    return {
      code: 200,
      message: 'Server is running',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Get('app/say-hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
