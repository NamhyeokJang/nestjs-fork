import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

/** 사용하고 있는 libs 에 대해서만 **/
const libs = ['api-key', 'admin', 'langchain', 'user', 'mailer']
const libsEntities = libs.map(v => `libs/${v}/src/entities/*.entity.ts`)
const migrations = libs.map(v => `libs/${v}/src/migrations/*.ts`)

export default new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  entities: [...libsEntities],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: `typeorm-migrations`,
  migrations: [...migrations],
})
