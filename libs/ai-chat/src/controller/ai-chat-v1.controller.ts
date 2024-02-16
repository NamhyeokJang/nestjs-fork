import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiSwagger } from '@slibs/swagger'
import { CommonResponse } from '@slibs/common'
import {
  RequestEmbeddingPayload,
  SimpleCompletionPayload,
  SimpleTextResponse,
} from '../dto'
import { AiChatService } from '../service'
import { FormDataRequest } from 'nestjs-form-data'

@ApiTags('AIChat')
@Controller({ version: '1', path: 'ai-chat' })
export class AiChatV1Controller {
  constructor(private readonly aiChatService: AiChatService) {}
  @Post('/simple-completion')
  @ApiSwagger({ type: SimpleTextResponse, summary: `simple completion` })
  async simpleCompletion(
    @Body() body: SimpleCompletionPayload,
  ): Promise<CommonResponse<SimpleTextResponse>> {
    const res = await this.aiChatService.simpleCompletion(body)
    return CommonResponse.success({ data: { text: res } })
  }

  @Post('/simple-completion/rag')
  @ApiSwagger({
    type: SimpleTextResponse,
    summary: `simple completion with rag`,
  })
  async simpleCompletionWithRag(
    @Body() body: SimpleCompletionPayload,
  ): Promise<CommonResponse<SimpleTextResponse>> {
    const res = await this.aiChatService.simpleRag(body)
    return CommonResponse.success({ data: { text: res } })
  }

  @Post('/embedding')
  @FormDataRequest()
  @ApiSwagger({ summary: 'request embedding' })
  async requestEmbedding(@Body() body: RequestEmbeddingPayload) {
    await this.aiChatService.requestEmbedding(body)
    return CommonResponse.success()
  }
}
