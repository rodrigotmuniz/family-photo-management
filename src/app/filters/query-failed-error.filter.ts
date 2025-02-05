import { ApiErrorResponseDto } from '@app/my-library/dtos/api-error-response.dto'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { AxiosError } from 'axios'
import { QueryFailedError } from 'typeorm'

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: Error, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    
    const statusCode = HttpStatus.CONFLICT

    const responseBody: ApiErrorResponseDto = {
      message: exception['detail'],
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode)
  }

}
