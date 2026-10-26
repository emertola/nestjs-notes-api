import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? (exception as HttpException).getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const body = isHttpException
      ? (exception as HttpException).getResponse()
      : null;

    let message: string;
    if (typeof body === 'object' && body !== null && 'message' in body) {
      message = (body as any).message;
    } else if (isHttpException) {
      message = (exception as HttpException).message;
    } else {
      message = 'Internal server error';
    }

    if (status >= 500) {
      let stack: string | undefined;
      if (exception instanceof Error) {
        stack = exception.stack;
      } else if (typeof exception === 'string') {
        stack = exception;
      } else {
        stack = JSON.stringify(exception);
      }
      this.logger.error(`${request.method} ${request.url}`, stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
