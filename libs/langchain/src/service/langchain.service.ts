import { Injectable, Logger } from '@nestjs/common'
import {
  ChatOpenAI,
  OpenAI,
  PromptTemplate,
  LLMResult,
  RunnableSequence,
  StringOutputParser,
  formatDocumentsAsString,
} from '../core'
import { OpenAIUsageRepository } from '../repository'
import { LangchainConfig } from '../config'
import { VectorStoreProvider } from '../provider'
import { OpenAIModel } from '../interface'
import { BaseCache } from '@langchain/core/caches'
import { LocalFileCache } from 'langchain/cache/file_system'
import { LocalPathUtils } from '@slibs/common'
import { Serialized } from '@langchain/core/load/serializable'
import dedent from 'dedent'

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly openaiUsageRepository: OpenAIUsageRepository,
    private readonly vectorStoreProvider: VectorStoreProvider,
  ) {}

  async getLocalCache() {
    return LocalFileCache.create(
      LocalPathUtils.getPath(
        LocalPathUtils.PATH,
        'local_storage',
        '.llm_cache',
      ),
    )
  }

  getChatModel(key: string, model: OpenAIModel, cache?: BaseCache) {
    return new ChatOpenAI({
      openAIApiKey: LangchainConfig.OPENAI_API_KEY,
      modelName: model,
      temperature: 0,
      cache,
      callbacks: [
        {
          handleLLMStart(llm: Serialized, prompts: string[], ..._args): any {
            console.log(dedent`----- prompt ----
            ${prompts}`)
          },
          handleLLMEnd: async (output: LLMResult, ..._args) => {
            await this.openaiUsageRepository.traceUsage(key, model, output)
          },
        },
      ],
    })
  }

  getModel(key: string, model: OpenAIModel) {
    return new OpenAI({
      openAIApiKey: LangchainConfig.OPENAI_API_KEY,
      modelName: model,
      callbacks: [
        {
          handleLLMEnd: async (output: LLMResult, ..._args) => {
            await this.openaiUsageRepository.traceUsage(key, model, output)
          },
        },
      ],
    })
  }

  async simpleCompletion(
    key: string,
    model: OpenAIModel,
    prompt: string,
    isCache = false,
  ): Promise<string> {
    const cache = isCache ? await this.getLocalCache() : undefined
    return this.getChatModel(key, model, cache)
      .pipe(new StringOutputParser())
      .invoke(prompt)
  }

  async simpleRagCompletion(
    key: string,
    model: OpenAIModel,
    question: string,
  ): Promise<string> {
    const prompt = PromptTemplate.fromTemplate(
      `Answer the question based only on the following context: {context}
      Question: {question}
      Answer: `,
    )

    const chain = RunnableSequence.from([
      {
        question: ({ question }) => question,
        context: async ({ question }) => {
          const retriever = await this.vectorStoreProvider.asRetriever(key)
          const docs = await retriever.getRelevantDocuments(question)
          return formatDocumentsAsString(docs)
        },
      },
      prompt,
      this.getChatModel(key, model),
      new StringOutputParser(),
    ])

    return chain.invoke({ question })
  }
}
