### environment 
- node 20.10.0
- postgres 15.5

### library
- pnpm
- nestjs
- typeorm
- adminjs
- swagger

### setting `.env` (develop)
```
### Database Config
DATABASE_HOST=0.0.0.0
DATABASE_PORT=5432
DATABASE_NAME=postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_ENABLED_LOGGING=false
DATABASE_ENABLED_SYNC=true

### Swagger Config
SWAGGER_ENABLED=true

### AdminJS
ADMIN_COOKIE_NAME=adminjs
ADMIN_COOKIE_PASSWORD=adminjs_secret
```


### run dev 
```bash
# run local database 
pnpm db:up

# run main-app 
pnpm start:dev main-app
```

### main command
```bash
# create new application
pnpm nest g app {name}

# create libs
pnpm nest g libs {name}
```

### database migration command
```bash
# run command for migration shell (only first)
chmod +x gen-migration.sh

# generate lib migration file 
pnpm migration:gen {lib name}

# run migration
pnpm migration:run {ormconfig path}

# revert migration
pnpm migration:revert {ormconfig path}
```

### next action
- [x] Database migration strategy
- [ ] Test 
- [ ] Optimize Docker image