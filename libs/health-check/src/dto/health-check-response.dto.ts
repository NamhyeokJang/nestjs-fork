import { ApiProperty } from '@nestjs/swagger'

export class HealthCheckResponse {
  @ApiProperty({ example: 1, description: 'if ok return 1' })
  check: number

  @ApiProperty({ example: new Date().getTime(), description: 'uptime' })
  uptime: number
}
