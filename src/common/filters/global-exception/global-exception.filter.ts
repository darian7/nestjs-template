import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const httpHost = host.switchToHttp();
    const status = exception?.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const request = httpHost.getRequest();
    const response = httpHost.getResponse();
    const method = httpHost.getRequest()?.method;

    const errorResponse = {
      statusCode: status,
      message:
        (exception?.getResponse() as any)?.message ||
        exception?.message ||
        exception,
      timestamp: new Date().toISOString(),
      path: request.url,
      method,
    };

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter',
    );

    response.status(errorResponse.statusCode).json(errorResponse);
  }
}
