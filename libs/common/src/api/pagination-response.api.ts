import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IPagination } from './api.interface'
import { CommonResponseCode } from './common-response-code.api'

class Pagination implements IPagination {
  @ApiProperty({ example: 1, description: 'page' })
  page!: number

  @ApiProperty({ example: 10, description: 'page size' })
  pageSize!: number

  @ApiProperty({ example: 10, description: 'total count' })
  total!: number

  constructor(config?: { page?: number; pageSize?: number; total?: number }) {
    this.page = config?.page ?? 1
    this.pageSize = config?.pageSize ?? 10
    this.total = config?.total ?? 0
  }
}

export class PaginationResponse<DATA, FILTER extends object> {
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

  @ApiProperty({ description: 'api response data' })
  readonly data!: DATA[]

  @ApiProperty({ type: Pagination, description: 'page info' })
  readonly pagination: Pagination

  @ApiPropertyOptional({ description: 'filter options' })
  readonly filter?: FILTER

  constructor(config: {
    message?: string
    data?: DATA[]
    pagination?: IPagination
    filter?: FILTER
  }) {
    const { message, data, pagination } = config
    this.code = CommonResponseCode.SUCCESS.code
    this.message = message ?? CommonResponseCode.SUCCESS.message
    this.data = data ?? []
    const { page, pageSize, total } = pagination ?? {
      page: 1,
      pageSize: 10,
      total: 0,
    }
    this.pagination = new Pagination({ page, pageSize, total })
    this.filter = config?.filter
  }

  static success<DATA, FILTER extends object>(config: {
    message?: string
    data?: DATA[]
    pagination?: IPagination
    filter?: FILTER
  }) {
    return new PaginationResponse({
      message: config.message,
      data: config.data,
      pagination: config.pagination,
      filter: config.filter,
    })
  }
}
