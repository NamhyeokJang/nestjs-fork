#!/bin/bash

lib=$1

if [ $lib ]; then
  echo "migration [$1] start"
else
  echo "input target lib for migration"
  exit 1
fi

# create ormconfig for migration
cat > tmp.ormconfig.ts <<EOF
import { DataSource } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const libs = ['$1']
const libsEntities = libs.map(v => \`libs/\${v}/src/entities/*.entity.ts\`)

export default new DataSource({
  type: 'postgres',
  host: '0.0.0.0',
  port: 5432,
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  entities: [...libsEntities],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsTableName: 'typeorm-migrations',
})
EOF

# run generate migration file
pnpm typeorm migration:generate libs/$1/src/migrations/migration -p -d tmp.ormconfig.ts

# remove tmp file
rm tmp.ormconfig.ts