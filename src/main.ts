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

  // 启用 CORS
  app.enableCors({
    origin: true,
    credentials: true,
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

  const port = process.env.PORT || 6666;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/diflow/api`);
}
bootstrap();
