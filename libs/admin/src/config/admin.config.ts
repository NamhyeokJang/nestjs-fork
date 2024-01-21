import { get } from 'env-var'
import { DatabaseConfig } from '@slibs/database'

export class AdminConfig {
  static readonly COOKIE_NAME = get('ADMIN_COOKIE_NAME').required().asString()
  static readonly COOKIE_PASSWORD = get('ADMIN_COOKIE_PASSWORD')
    .required()
    .asString()
  static readonly SESSION_CONNECT_STRING = DatabaseConfig.CONNECT_STRING
}
