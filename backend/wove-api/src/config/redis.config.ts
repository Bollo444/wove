import { ConfigService } from '@nestjs/config';
import { BullModuleOptions } from '@nestjs/bull';
// import { RedisOptions } from 'ioredis'; // For CacheModule if using ioredis directly

// dotenv.config(); // No longer needed here

export const redisOptionsFactory = (configService: ConfigService) => {
  const host = configService.get<string>('REDIS_HOST', 'localhost');
  const port = configService.get<number>('REDIS_PORT', 6379);
  const password = configService.get<string>('REDIS_PASSWORD');

  return {
    host,
    port,
    ...(password && { password }), // Add password only if it exists
  };
};

export const bullConfigFactory = (configService: ConfigService): BullModuleOptions => {
  const redisConnectionOptions = redisOptionsFactory(configService);
  return {
    redis: redisConnectionOptions,
    defaultJobOptions: {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      removeOnComplete: true,
      // removeOnFail: 1000, // Consider keeping failed jobs for inspection
    },
  };
};

// For direct use with CacheModule if not using redisOptionsFactory directly in app.module
// export const cacheManagerRedisConfig = (configService: ConfigService): RedisOptions => {
//   return redisOptionsFactory(configService);
// };
