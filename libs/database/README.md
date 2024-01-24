## Migration


### ormconfig
example.
```typescript
import { DataSource } from 'typeorm'

/** 사용하고 있는 libs 에 대해서만 **/
const libs = ['api-key', 'admin']
const libsEntities = libs.map(v => `libs/${v}/src/entities/*.entity.ts`)

export default new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  entities: [...libsEntities], // migration 이 필요한 타켓 entity 경로 (wildcard 지원)
  migrationsTableName: `typeorm-migrations`,
  migrations: ['libs/database/src/migrations/main-app/*.ts'], // migration 파일 경로
})
```

### Usage
- create migration:  pnpm migration:gen {ormconfig path}
- run migration: pnpm migration:run {ormconfig path}
- revert migration: pnpm migration:revert {ormconfig path}
