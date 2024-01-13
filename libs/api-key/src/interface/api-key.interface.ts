import { ApiKey } from '../entities'

export interface IApiKeyRule {
  check(apikey: ApiKey): Promise<boolean>
}
