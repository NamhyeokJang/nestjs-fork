import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CommonResponseCode } from './common-response-code.api'
import { IResponseCode } from './api.interface'

export class CommonResponse<T> {
  @ApiProperty({
    example: CommonResponseCode.SUCCESS.code,
    description: 'api status code.',
  })
  readonly code!: number

  @ApiProperty({
    example: new Date().getTime(),
    description: 'api response timestamp',
  })
  readonly timestamp!: number

  @ApiPropertyOptional({
    example: CommonResponseCode.SUCCESS.message,
    description: 'api response message.',
  })
  readonly message?: string

  @ApiPropertyOptional({ description: 'api response data' })
  readonly data?: T

  constructor(config: { code: number; message?: string; data?: T }) {
    const { code, message, data } = config
    this.code = code
    this.message = message
    this.data = data
  }

  static success<T>(config?: { message?: string; data?: T }) {
    const code = CommonResponseCode.SUCCESS.code
    const message = config?.message ?? CommonResponseCode.SUCCESS.message
    const data = config?.data

    return new CommonResponse<T>({ code, message, data })
  }

  static error<T>(config?: {
    responseCode: IResponseCode
    message?: string
    data?: T
  }) {
    const code = config?.responseCode.code ?? CommonResponseCode.INTERNAL.code
    const message =
      config?.message ??
      config?.responseCode.message ??
      CommonResponseCode.INTERNAL.message
    const data = config?.data

    return new CommonResponse<T>({ code, message, data })
  }

  static raw<T>(config: { code: number; message: string; data?: T }) {
    return new CommonResponse<T>({
      code: config.code,
      message: config.message,
      data: config.data,
    })
  }
}
