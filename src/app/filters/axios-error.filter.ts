import { ApiErrorResponseDto } from '@app/my-library/dtos/api-error-response.dto'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { AxiosError } from 'axios'

@Catch(AxiosError)
export class AxiosErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: AxiosError, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    
    const statusCode = exception.status || HttpStatus.INTERNAL_SERVER_ERROR

    const responseBody: ApiErrorResponseDto = {
      message: exception.message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode)
  }

}
