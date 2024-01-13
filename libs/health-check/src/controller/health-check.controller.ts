import { ApiTags } from '@nestjs/swagger'
import { Controller, Get } from '@nestjs/common'
import * as process from 'process'
import { HealthCheckResponse } from '../dto'
import { ApiSwagger } from '@slibs/swagger'
import { CommonResponse } from '@slibs/common'

@ApiTags('Health Check')
@Controller('health-check')
export class HealthCheckController {
  @Get()
  @ApiSwagger({ type: HealthCheckResponse, summary: `health check API` })
  check(): CommonResponse<HealthCheckResponse> {
    return CommonResponse.success({
      data: { check: 1, uptime: process.uptime() },
    })
  }
}
