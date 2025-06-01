import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { RateLimiterMiddleware } from './middleware/rate-limiter.middleware';
import { RoleGuard } from './guards/role.guard';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Module({
  imports: [ConfigModule],
  providers: [
    // Register RoleGuard as a global guard
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    // Register TransformInterceptor as a global interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Add RateLimiter as a provider
    RateLimiterMiddleware,
  ],
  exports: [RateLimiterMiddleware],
})
export class GatewayModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiterMiddleware)
      .exclude(
        // Exclude health check endpoint from rate limiting
        { path: 'health', method: RequestMethod.GET },
      )
      .forRoutes('*'); // Apply to all other routes
  }
}
