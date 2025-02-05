import { ApiErrorResponseDto } from '@app/my-library/dtos/api-error-response.dto'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { AxiosError } from 'axios'
import { QueryFailedError } from 'typeorm'

@Catch()
export class GlobalAgnosticFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const statusCode = this.getHttpStatus(exception)
    const message = this.getMessage(exception)

    const responseBody: ApiErrorResponseDto = {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode)
  }

  private getHttpStatus(exception: Error) {
    if (exception instanceof HttpException) return exception.getStatus()
    if (exception instanceof AxiosError) return exception.status || HttpStatus.INTERNAL_SERVER_ERROR
    if (exception instanceof QueryFailedError) return HttpStatus.CONFLICT
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private getMessage(exception: Error) {
    if (exception instanceof HttpException) {
      const response = exception.getResponse()
      if (typeof response === 'string') return response
      return response['message']
    }
    if (exception instanceof QueryFailedError) {
      return exception['detail']
    }
    return exception.message
  }
}
