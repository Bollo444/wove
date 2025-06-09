import { Module, Global } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
// You might add a custom logger service here later if needed
// import { LoggerService } from './logging/logger.service';

@Global() // Make this module global so its providers are available everywhere
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    // If you create a custom LoggerService, provide it here
    // LoggerService,
  ],
  // If LoggerService is created and needs to be used elsewhere, export it
  // exports: [LoggerService],
})
export class CoreModule {}
