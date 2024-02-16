import { Injectable } from '@nestjs/common'
import {
  EmbeddingService,
  LangChainService,
  OpenAIModel,
  PromptTemplate,
  JsonOutputFunctionsParser,
} from '@slibs/langchain'
import {
  RequestEmbeddingPayload,
  SimpleCompletionPayload,
  SimpleFunctionCallingPayload,
} from '../dto'

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

  async simpleFunctionCalling(payload: SimpleFunctionCallingPayload) {
    const model = this.langchainService.getChatModel(this.key, this.model)
    const prompt = PromptTemplate.fromTemplate(`{prompt}`)

    return prompt
      .pipe(
        model.bind({
          functions: [payload.schema],
          function_call: { name: payload.schema.name },
        }),
      )
      .pipe(new JsonOutputFunctionsParser())
      .invoke({ prompt: payload.prompt })
  }
}
