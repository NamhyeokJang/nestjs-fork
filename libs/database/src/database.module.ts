import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DatabaseConfig } from './config'
import { DataSource, DataSourceOptions, EntitySchema } from 'typeorm'
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

@Module({})
export class DatabaseModule {
  static forRoot(entities: Array<EntitySchema> = []) {
    // init transaction context  before init module
    initializeTransactionalContext()
    return {
      module: DatabaseModule,
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => {
            return {
              type: 'postgres',
              host: DatabaseConfig.HOST,
              port: DatabaseConfig.PORT,
              database: DatabaseConfig.NAME,
              username: DatabaseConfig.USERNAME,
              password: DatabaseConfig.PASSWORD,
              entities,
              logging: DatabaseConfig.ENABLED_LOGGING,
              synchronize: DatabaseConfig.ENABLED_SYNC,
              namingStrategy: new SnakeNamingStrategy(),
              autoLoadEntities: true,
            }
          },
          dataSourceFactory: async (
            options?: DataSourceOptions,
          ): Promise<DataSource> => {
            if (!options) {
              throw new Error(`Not found Datasource Options`)
            }
            return addTransactionalDataSource(new DataSource(options))
          },
        }),
      ],
      exports: [TypeOrmModule],
    }
  }
}
