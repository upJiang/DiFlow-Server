import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import envConfig from '../config/env';
import { PostsEntity } from './posts/entities/posts.entity';
import { AuthEntity } from './auth/entities/auth.entity';
import { PluginUserEntity } from './auth/entities/plugin-user.entity';
import { PluginCursorRulesEntity } from './auth/entities/plugin-cursor-rules.entity';
import { PluginCursorMcpsEntity } from './auth/entities/plugin-cursor-mcps.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RedisService } from './redis/redis.service';
import { RedisModule } from './redis/redis.module';
import { UploadModule } from './upload/upload.module';
import { LoggerService } from './logger/logger.service';
import { TimerService } from './timer/timer.service';
import { TimerModule } from './timer/timer.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.prod', '.env.test', '.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWD || '',
      database: process.env.DB_DATABASE || 'diflow',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'diflow-cursor-secret',
      signOptions: { expiresIn: '7d' },
    }),
    AuthModule,
    PostsModule,
    RedisModule,
    UploadModule,
    TimerModule,
  ],
  controllers: [AppController],
  // 注册为全局守卫
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    RedisService,
    LoggerService,
    TimerService,
  ],
})
export class AppModule {}
