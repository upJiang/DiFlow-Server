import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransformInterceptor } from './core/interceptor/transform/transform.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 启用 CORS - 更宽松的配置用于开发环境
  app.enableCors({
    origin: [
      'http://localhost:*',
      'https://localhost:*',
      'vscode-webview://*',
      'vscode-file://*',
      '*',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('DIFlow Cursor Plugin API')
    .setDescription('DIFlow Cursor 插件后端 API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('diflow/api', app, document);

  // 设置全局路径前缀
  app.setGlobalPrefix('diflow');

  // 支持静态资源
  app.useStaticAssets('public', { prefix: '/static' });

  // 注册全局 logger 拦截器
  const loggerService = app.get(LoggerService);
  app.useGlobalInterceptors(new TransformInterceptor(loggerService));
  // 注册全局错误的过滤器
  app.useGlobalFilters(new HttpExceptionFilter(loggerService));

  const port = process.env.PORT || 3001;
  // 明确绑定到所有网络接口
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/diflow/api`);
}
bootstrap();
