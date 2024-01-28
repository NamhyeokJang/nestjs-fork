import { DataSourceOptions } from 'typeorm'
import { DatabaseConfig } from '../config'

export const postgresOptions: DataSourceOptions = {
  type: 'postgres',
  host: DatabaseConfig.HOST,
  port: DatabaseConfig.PORT,
  database: DatabaseConfig.NAME,
  username: DatabaseConfig.USERNAME,
  password: DatabaseConfig.PASSWORD,
  logging: DatabaseConfig.ENABLED_LOGGING,
  synchronize: DatabaseConfig.ENABLED_SYNC,
}
