import { get } from 'env-var'
import { EmbeddingOpenAIModel } from '../interface'

export class LangchainConfig {
  static readonly OPENAI_API_KEY = get('OPENAI_API_KEY').required().asString()
  static readonly EMBEDDING_MODEL: EmbeddingOpenAIModel = get(
    'OPENAI_EMBEDDING_MODEL',
  )
    .required()
    .asEnum([
      'text-embedding-ada-002',
      'text-embedding-3-small',
      'text-embedding-3-large',
    ])
}
