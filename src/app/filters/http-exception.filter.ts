import { ApiErrorResponseDto } from '@app/my-library/dtos/api-error-response.dto'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    
    const statusCode = exception.getStatus()

    const responseBody: ApiErrorResponseDto = {
      message: this.getMessage(exception),
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode)
  }

  private getMessage(exception: HttpException) {
      const response = exception.getResponse()
      if (typeof response === 'string') return response
      return response['message']
  }

}
