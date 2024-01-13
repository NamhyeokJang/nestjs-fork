import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDateString, IsObject, IsOptional } from 'class-validator'

export class CreateApiKeyPayload<META extends object> {
  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: 'api key expired at',
  })
  @IsOptional()
  @IsDateString()
  expiredAt?: string

  @ApiProperty({ example: {}, description: 'meta data' })
  @IsObject()
  meta: META
}
