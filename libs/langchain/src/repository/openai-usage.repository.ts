import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommonRepository } from '@slibs/database'
import { DayUtils } from '@slibs/common'
import { OpenAIUsage } from '../entities'
import { LLMResult } from '@langchain/core/outputs'

@Injectable()
export class OpenAIUsageRepository extends CommonRepository<OpenAIUsage> {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    @InjectRepository(OpenAIUsage)
    private readonly repository: Repository<OpenAIUsage>,
  ) {
    super(repository)
  }

  get pkField() {
    return 'id'
  }

  async traceUsage(key: string, model: string, output: LLMResult) {
    const out = output.llmOutput
    if (!out?.tokenUsage) {
      this.logger.warn(`Can't trace LLM Usage.`)
      return
    }

    await this.upsert(key, model, {
      promptTokens: out?.tokenUsage?.promptTokens,
      completionTokens: out?.tokenUsage?.completionTokens,
      totalTokens: out?.tokenUsage?.totalTokens,
    })
  }

  private async upsert(
    key: string,
    model: string,
    usage: {
      promptTokens: number
      completionTokens: number
      totalTokens: number
    },
  ) {
    const now = DayUtils.getNow()
    const date = now.toDate()
    const token = now.format('YYYY-MM-DD')

    const query = `
        INSERT INTO ${this.repository.metadata.tableName} (created_at, updated_at, key, date, model, prompt_tokens, completion_tokens, total_tokens)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (key, date, model)
        DO UPDATE SET
          prompt_tokens = EXCLUDED.prompt_tokens + ${this.repository.metadata.tableName}.prompt_tokens,
          completion_tokens = EXCLUDED.completion_tokens + ${this.repository.metadata.tableName}.completion_tokens,
          total_tokens = EXCLUDED.total_tokens + ${this.repository.metadata.tableName}.total_tokens,
          updated_at = EXCLUDED.updated_at`

    const params = [
      date,
      date,
      key,
      token,
      model,
      usage.promptTokens,
      usage.completionTokens,
      usage.totalTokens,
    ]
    await this.repository.query(query, params)
  }
}
