import { ApiProperty, ApiTags } from '@nestjs/swagger'
import { Body, Controller, Post } from '@nestjs/common'
import { ApiSwagger } from '@slibs/swagger'
import { IsOptional } from 'class-validator'
import { CommonResponse } from '@slibs/common'
import {
  FormDataRequest,
  IsFile,
  IsFiles,
  MemoryStoredFile,
} from 'nestjs-form-data'
import { EmbeddingService, LangChainService } from '@slibs/langchain'

export class RequestTestBody {
  @ApiProperty({ example: 'file' })
  @IsOptional()
  @IsFile()
  file: MemoryStoredFile

  @ApiProperty({ example: 'files' })
  @IsOptional()
  @IsFiles()
  files: Array<MemoryStoredFile>

  @ApiProperty({ example: 'user' })
  @IsOptional()
  user: string

  @ApiProperty({ example: 'name' })
  @IsOptional()
  project: string

  @ApiProperty({ example: 'name' })
  @IsOptional()
  question: string

  @ApiProperty({ example: 1 })
  @IsOptional()
  id: number
}

@ApiTags('Test')
@Controller('t')
export class TestController {
  constructor(
    private readonly embeddingService: EmbeddingService,
    private readonly langChainService: LangChainService,
  ) {}
  @Post('/embedding')
  @FormDataRequest()
  @ApiSwagger({ summary: 'embedding' })
  async embedding(@Body() body: RequestTestBody) {
    for (const file of body.files) {
      await this.embeddingService.enqueueForEmbeddingFile(
        body.project,
        body.user,
        file,
      )
    }
    return CommonResponse.success()
  }

  @Post('/embedding/d')
  @ApiSwagger({ summary: `remove embedded` })
  async removeEmbedded(@Body() body: RequestTestBody) {
    await this.embeddingService.enqueueForDeleteFile(body.project, body.id)
    return CommonResponse.success()
  }

  @Post('search')
  @ApiSwagger({ summary: `search` })
  async search(@Body() body: RequestTestBody) {
    // const r = await this.embeddingService.similarity(body.str, {
    //   user: body.user,
    // })
    return CommonResponse.success({ data: body })
  }

  @Post('search/f')
  @ApiSwagger({ summary: 'search score' })
  async searchWithScore(@Body() body: RequestTestBody) {
    // const r = await this.embeddingService.similarity(body.str, {
    //   user: body.user,
    // })
    console.log(body)

    return CommonResponse.success()
  }

  @Post('chat')
  @ApiSwagger({ summary: 'chat' })
  async chat(@Body() body: RequestTestBody) {
    const r = await this.langChainService.chat(
      body.question,
      body.project,
      body.user,
    )
    return CommonResponse.success({ data: r })
  }
}
