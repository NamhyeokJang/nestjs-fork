import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { CommonResponse, CommonResponseCode } from '../api'
import { CommonException } from '../exception'
import { isArray } from 'lodash'
import dedent from 'dedent'
import { TypeORMError } from 'typeorm'

@Catch()
export class AppErrorFilter implements ExceptionFilter {
  private logger = new Logger(this.constructor.name)

  catch(exception: any, host: ArgumentsHost) {
    const rType = host.getType<string>()
    const request = host.switchToHttp().getRequest<Request>()
    const response = host.switchToHttp().getResponse<Response>()

    if (rType === 'graphql') {
      return
    }

    if (request.path === '/favicon.ico') {
      response.status(203)
      return response.end()
    }

    // class-validator 오류로 overwrite
    if (exception.response && isArray(exception.response?.message)) {
      exception.message = exception.response.message?.[0] ?? exception.message
    }

    let errorResponse: CommonResponse<unknown> = CommonResponse.error({
      responseCode: CommonResponseCode.INTERNAL,
      message: exception.message,
    })

    errorResponse = this.handleError(exception, errorResponse)

    const message: string = dedent(
      `Method: ${request.method} Path: ${request.path} Code: ${errorResponse.code} Error: ${errorResponse.message}`,
    )

    this.logger.error(message)

    // for debug log
    // console.error(exception)

    response.status(400)
    return response.send(errorResponse)
  }

  private handleError(
    error: unknown,
    errorResponse: CommonResponse<unknown>,
  ): CommonResponse<unknown> {
    if (error instanceof UnauthorizedException) {
      return CommonResponse.error({
        responseCode: CommonResponseCode.UNAUTHORIZED,
        message: CommonResponseCode.UNAUTHORIZED.message,
      })
    }

    if (error instanceof HttpException) {
      return CommonResponse.raw({
        code: error.getStatus(),
        message: error.message,
      })
    }

    if (error instanceof CommonException) {
      return CommonResponse.raw({
        code: error.code,
        message: error.message,
        data: error.data,
      })
    }

    // Typeorm not found error
    if (
      (error as any).message.startsWith('Could not find any entity of type')
    ) {
      const match = (error as any).message.match(/"(.*?)"/)
      const message = `NOT_FOUND_${match[1].toUpperCase()}`
      return CommonResponse.error({
        responseCode: {
          code: CommonResponseCode.NOT_FOUND.code,
          message,
        },
      })
    }

    if (error instanceof TypeORMError) {
      this.logger.error(`TypeORMError:: message:${error.message}`)
      return CommonResponse.error({
        responseCode: CommonResponseCode.INTERNAL,
      })
    }

    return errorResponse
  }
}
