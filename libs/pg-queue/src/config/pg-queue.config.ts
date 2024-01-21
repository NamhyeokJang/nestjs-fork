import { DatabaseConfig } from '@slibs/database'
import { get } from 'env-var'

export class PgQueueConfig {
  static readonly CONNECT_STRING = DatabaseConfig.CONNECT_STRING
  static readonly SCHEMA = get('PG_QUEUE_SCHEMA').asString()
}
