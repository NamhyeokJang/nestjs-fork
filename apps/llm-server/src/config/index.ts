import { get } from 'env-var'

export class LLMAppConfig {
  static readonly HOST = get('APP_HOST').default('0.0.0.0').asString()
  static readonly PORT = get('APP_PORT').default(4000).asPortNumber()
}
