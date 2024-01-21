import { get } from 'env-var'

export class DatabaseConfig {
  static readonly HOST = get('DATABASE_HOST').required().asString()
  static readonly PORT = get('DATABASE_PORT').required().asPortNumber()
  static readonly NAME = get('DATABASE_NAME').required().asString()
  static readonly USERNAME = get('DATABASE_USERNAME').required().asString()
  static readonly PASSWORD = get('DATABASE_PASSWORD').required().asString()
  static readonly ENABLED_LOGGING = get('DATABASE_ENABLED_LOGGING')
    .default('false')
    .asBool()
  static readonly ENABLED_SYNC = get('DATABASE_ENABLED_SYNC')
    .default('false')
    .asBool()
  static readonly CONNECT_STRING = `postgres://${DatabaseConfig.USERNAME}:${DatabaseConfig.PASSWORD}:@${DatabaseConfig.HOST}:${DatabaseConfig.PORT}/${DatabaseConfig.NAME}`
}
