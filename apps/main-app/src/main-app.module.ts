import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { NestjsFormDataModule } from 'nestjs-form-data'
import { HealthCheckModule } from '@slibs/health-check'
import {
  AppErrorFilter,
  LocalPathUtils,
  RouterLoggerInterceptor,
} from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { AdminLocale, MaApiKeyModule, MaUserModule } from './module'
import { AdminModule } from '@slibs/admin'
import { PgQueueModule } from '@slibs/pg-queue'
import { LangChainModule } from '@slibs/langchain'
import { ClientSecretModule } from '@slibs/client-secret'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: LocalPathUtils.ASSETS,
    }),
    NestjsFormDataModule.config({ isGlobal: true }),
    DatabaseModule.forRoot(),
    AdminModule.forRoot({ locale: AdminLocale }),
    PgQueueModule,
    HealthCheckModule,
    MaApiKeyModule,
    LangChainModule,
    MaUserModule,
    ClientSecretModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: RouterLoggerInterceptor },
    { provide: APP_FILTER, useClass: AppErrorFilter },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true, whitelist: true }),
    },
  ],
})
export class MainAppModule {}
