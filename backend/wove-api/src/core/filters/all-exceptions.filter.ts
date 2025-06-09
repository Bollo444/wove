import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const httpStatus =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    const errorResponse = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      // Include stack trace in development for easier debugging
      ...(process.env.NODE_ENV === 'development' && { stack: (exception as Error)?.stack }),
    };

    // Log the error
    this.logger.error(
      `HTTP Status: ${httpStatus} Error Message: ${JSON.stringify(message)} Path: ${request.url} Method: ${request.method}`,
      (exception as Error)?.stack,
      AllExceptionsFilter.name,
    );

    // For critical errors, you might want to send notifications (e.g., to Sentry, Slack)
    if (httpStatus === HttpStatus.INTERNAL_SERVER_ERROR) {
      // Example: this.notificationService.sendCriticalErrorAlert(errorResponse);
      this.logger.fatal(`Critical unhandled exception: ${JSON.stringify(errorResponse)}`);
    }

    httpAdapter.reply(response, errorResponse, httpStatus);
  }
}
