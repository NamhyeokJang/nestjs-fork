import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { IsFiles, MemoryStoredFile } from 'nestjs-form-data'

export class SimpleCompletionPayload {
  @ApiProperty({ example: 'prompt', description: 'prompt' })
  @IsString()
  prompt: string
}

export class RequestEmbeddingPayload {
  @ApiProperty({ example: 'key', description: 'key' })
  @IsString()
  key: string

  @ApiProperty({
    type: Array<MemoryStoredFile>,
    example: 'files',
    description: 'files',
  })
  @IsFiles()
  files: Array<MemoryStoredFile>
}
