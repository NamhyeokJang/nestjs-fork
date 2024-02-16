import { ApiProperty } from '@nestjs/swagger'

export class SimpleTextResponse {
  @ApiProperty({ example: 'text', description: 'text' })
  text: string
}
