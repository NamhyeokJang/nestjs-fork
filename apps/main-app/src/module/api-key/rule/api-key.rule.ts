import { ApiKey, IApiKeyRule } from '@slibs/api-key'
import { IApiKeyMeta } from '../interface'

export class ApiKeyRule implements IApiKeyRule {
  async check(apiKey: ApiKey) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const meta = apiKey.meta as IApiKeyMeta

    return true
  }
}
