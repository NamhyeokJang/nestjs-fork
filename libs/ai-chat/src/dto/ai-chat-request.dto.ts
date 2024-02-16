import { ApiProperty } from '@nestjs/swagger'
import { FunctionDefinition } from '@slibs/langchain'
import { IsObject, IsString } from 'class-validator'
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

export class SimpleFunctionCallingPayload {
  @ApiProperty({ example: { name: 'func' }, description: 'schema' })
  @IsObject()
  schema: FunctionDefinition

  @ApiProperty({ example: 'prompt', description: 'prompt' })
  @IsString()
  prompt: string
}
