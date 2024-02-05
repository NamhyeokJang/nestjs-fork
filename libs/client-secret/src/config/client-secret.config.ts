import { get } from 'env-var'

export class ClientSecretConfig {
  static readonly HEADER = get('CLIENT_SECRET_HEADER').required().asString()
  static readonly SECRET = get('CLIENT_SECRET_KEY').required().asString()
}
