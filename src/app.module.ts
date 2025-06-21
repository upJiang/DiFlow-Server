import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CursorModule } from './modules/cursor/cursor.module';
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
    AuthModule,
    CursorModule,
    RedisModule,
    UploadModule,
    TimerModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, LoggerService, TimerService],
})
export class AppModule {}
