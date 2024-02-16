import { Injectable } from '@nestjs/common'
import {
  EmbeddingService,
  LangChainService,
  OpenAIModel,
} from '@slibs/langchain'
import {
  RequestEmbeddingPayload,
  SimpleCompletionPayload,
} from '@slibs/ai-chat/dto'

@Injectable()
export class AiChatService {
  private key = 'ai_chat'
  private model: OpenAIModel = 'gpt-3.5-turbo-1106'

  constructor(
    private readonly langchainService: LangChainService,
    private readonly embeddingService: EmbeddingService,
  ) {}

  async simpleCompletion(payload: SimpleCompletionPayload) {
    return this.langchainService.simpleCompletion(
      this.key,
      this.model,
      payload.prompt,
    )
  }

  async requestEmbedding(payload: RequestEmbeddingPayload) {
    await Promise.all(
      payload.files.map(async f =>
        this.embeddingService.enqueueForEmbeddingFile(this.key, f),
      ),
    )
  }

  async simpleRag(payload: SimpleCompletionPayload) {
    return this.langchainService.simpleRagCompletion(
      this.key,
      this.model,
      payload.prompt,
    )
  }
}
