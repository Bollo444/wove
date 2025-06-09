import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import { redisOptionsFactory, bullConfigFactory } from './config/redis.config'; // Corrected import names
import * as redisStore from 'cache-manager-redis-store';
import { QueueModule } from './queues/queue.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StoriesModule } from './modules/stories/stories.module';
import { ModerationModule } from './modules/moderation/moderation.module';
import { GatewayModule } from './modules/gateway/gateway.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { StorageModule } from './modules/storage/storage.module';
import { AiModule } from './modules/ai/ai.module';
import { CoreModule } from './core/core.module';
import { MultimediaModule } from './modules/multimedia/multimedia.module'; // Added
import { NotificationModule } from './notifications/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
      // Consider adding validation schema here for robustness
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => databaseConfig(configService),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => bullConfigFactory(configService), // Corrected usage
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Using redisOptionsFactory for CacheModule
        const redisOpts = redisOptionsFactory(configService);
        return {
          store: redisStore,
          ...redisOpts, // Spread the options like host, port, password
          isGlobal: true,
        };
      },
      inject: [ConfigService],
    }),
    CoreModule,
    QueueModule,
    AuthModule,
    UsersModule,
    StoriesModule,
    ModerationModule,
    GatewayModule,
    WebSocketModule,
    StorageModule.register(),
    AiModule.register(),
    MultimediaModule, // Added
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
