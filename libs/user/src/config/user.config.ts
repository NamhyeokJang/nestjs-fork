import { get } from 'env-var'

export class UserConfig {
  static readonly JWT_SECRET = get('USER_JWT_SECRET').required().asString()
  static readonly JWT_EXPIRED_IN_SECOND = get('USER_JWT_EXPIRED_IN_SECOND')
    .default(7 * 24 * 60 * 60)
    .asInt()
}
