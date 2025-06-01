import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { redisOptionsFactory } from '../../../config/redis.config';
import { RequestWithUser } from '../../../types/request.interface';

interface RateLimitConfig {
  points: number; // Number of requests
  duration: number; // Time window in seconds
  blockDuration: number; // Duration to block if limit exceeded (seconds)
}

@Injectable()
export class RateLimiterMiddleware implements NestMiddleware {
  private readonly redis: Redis;
  private readonly defaultConfig: RateLimitConfig = {
    points: 100, // 100 requests
    duration: 60, // per minute
    blockDuration: 300, // block for 5 minutes if exceeded
  };

  constructor(private readonly configService: ConfigService) {
    // Initialize Redis client
    const redisConfig = redisOptionsFactory(this.configService);
    this.redis = new Redis(redisConfig);
  }

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const key = this.getKey(req);
    const config = this.getRouteConfig(req);

    try {
      // Check if client is blocked
      const blockedUntil = await this.redis.get(`blocked:${key}`);
      if (blockedUntil && parseInt(blockedUntil) > Date.now()) {
        const timeLeft = Math.ceil((parseInt(blockedUntil) - Date.now()) / 1000);
        throw new HttpException(
          `Too many requests. Please try again in ${timeLeft} seconds.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Get current count
      const current = await this.redis.get(key);
      const points = current ? parseInt(current) : 0;

      if (points >= config.points) {
        // Block the client
        const blockUntil = Date.now() + config.blockDuration * 1000;
        await this.redis.set(`blocked:${key}`, blockUntil.toString(), 'EX', config.blockDuration);

        throw new HttpException(
          `Too many requests. Please try again in ${config.blockDuration} seconds.`,
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }

      // Increment counter
      if (points === 0) {
        await this.redis.set(key, '1', 'EX', config.duration);
      } else {
        await this.redis.incr(key);
      }

      // Set rate limit headers
      res.header('X-RateLimit-Limit', config.points.toString());
      res.header('X-RateLimit-Remaining', (config.points - points - 1).toString());

      next();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      next(error);
    }
  }

  private getKey(req: RequestWithUser): string {
    // Use IP and user ID (if authenticated) as key
    const ip = req.ip;
    const userId = req.user?.id || 'anonymous';
    return `rate-limit:${ip}:${userId}`;
  }

  private getRouteConfig(req: RequestWithUser): RateLimitConfig {
    // Customize rate limits based on route, user role, etc.
    const path = req.path;
    const method = req.method;
    const user = req.user;

    // Higher limits for authenticated users
    if (user?.id) {
      return {
        points: 200,
        duration: 60,
        blockDuration: 300,
      };
    }

    // Stricter limits for auth endpoints
    if (path.startsWith('/auth')) {
      return {
        points: 20,
        duration: 60,
        blockDuration: 600,
      };
    }

    return this.defaultConfig;
  }
}
