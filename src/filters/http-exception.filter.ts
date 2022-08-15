import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionMessage: { message: string } = exception.getResponse() as {
      message: string;
    };

    response.status(status).json({
      method: request.method,
      message: exceptionMessage.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
