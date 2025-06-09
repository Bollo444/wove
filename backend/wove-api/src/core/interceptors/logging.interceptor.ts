import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const userId = (request as any).user?.id || 'anonymous'; // Assuming user is attached to request

    this.logger.log(`[${userId}] ==> ${method} ${url} - IP: ${ip} - Agent: ${userAgent}`);

    return next.handle().pipe(
      tap(data => {
        const delay = Date.now() - now;
        this.logger.log(
          `[${userId}] <== ${method} ${url} - Status: ${response.statusCode} - ${delay}ms`,
        );
        // Optionally log response data (be careful with sensitive info)
        // if (process.env.NODE_ENV === 'development') {
        //   this.logger.debug(`Response data: ${JSON.stringify(data)}`);
        // }
      }),
    );
  }
}
