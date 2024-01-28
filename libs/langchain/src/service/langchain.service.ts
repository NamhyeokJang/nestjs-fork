import { Injectable, Logger } from '@nestjs/common'
import {
  ChatOpenAI,
  OpenAI,
  ChatPromptTemplate,
  PromptTemplate,
  LLMResult,
  RunnableSequence,
  StringOutputParser,
  formatDocumentsAsString,
} from '../core'
import { OpenAIUsageRepository } from '../repository'
import { LangchainConfig } from '../config'
import { VectorStoreProvider } from '../provider'
import { DOC_TYPE } from '../constants'
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

  async chat(input: string, project: string, key: string) {
    const prompt = PromptTemplate.fromTemplate(`
    Use the following pieces of context to answer the question at the end. If you don't know the answer, just say that you don't know, don't try to make up an answer.
    ----------------
    CONTEXT: {context}
    ----------------
    CHAT HISTORY: {chatHistory}
    ----------------
    QUESTION: {question}
    ----------------
    Helpful Answer:
      `)

    const chain = RunnableSequence.from([
      {
        question: ({ question }) => {
          return question
        },
        context: async ({ question }) => {
          const retriever = await this.vectorStoreProvider.asRetriever(
            project,
            { filter: { owner: key, type: DOC_TYPE.EMBEDDING } },
          )
          const relevantDocs = await retriever.getRelevantDocuments(question)
          return formatDocumentsAsString(relevantDocs)
        },
        chatHistory: async ({ question }) => {
          const retriever = await this.vectorStoreProvider.asRetriever(
            project,
            { filter: { owner: key, type: DOC_TYPE.CHAT } },
          )
          const relevantDocs = await retriever.getRelevantDocuments(question)
          return formatDocumentsAsString(relevantDocs)
        },
      },
      prompt,
      this.getChatModel(key, 'gpt-3.5-turbo'),
      new StringOutputParser(),
      async (answer: string, ..._args) => {
        await this.vectorStoreProvider.addChatHistory(
          project,
          { question: input, answer },
          { owner: key },
        )
        return answer
      },
    ])

    return chain.invoke({ question: input })
  }

  async invoke(key: string, model: OpenAIModel, prompt: string): Promise<any> {
    return this.getChatModel(key, model).invoke(prompt)
  }

  prompt() {
    return ChatPromptTemplate.fromMessages([
      ['system', 'You are a world class technical documentation writer.'],
      ['user', '{input}'],
    ])
  }
}
