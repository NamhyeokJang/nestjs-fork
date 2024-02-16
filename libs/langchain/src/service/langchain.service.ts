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

@Injectable()
export class LangChainService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly openaiUsageRepository: OpenAIUsageRepository,
    private readonly vectorStoreProvider: VectorStoreProvider,
  ) {}

  getChatModel(key: string, model: OpenAIModel) {
    return new ChatOpenAI({
      openAIApiKey: LangchainConfig.OPENAI_API_KEY,
      modelName: model,
      temperature: 0,
      callbacks: [
        {
          // handleLLMStart(
          //   llm: Serialized,
          //   prompts: string[],
          //   runId: string,
          //   parentRunId?: string,
          //   extraParams?: Record<string, unknown>,
          //   tags?: string[],
          //   metadata?: Record<string, unknown>,
          //   name?: string,
          // ): any {
          //   console.log(prompts)
          // },
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
  ): Promise<string> {
    return this.getChatModel(key, model)
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
      argv => {
        console.log(`---- prompt -----`)
        console.log(argv.value)
        return argv
      },
      this.getChatModel(key, model),
      new StringOutputParser(),
    ])

    return chain.invoke({ question })
  }
}
