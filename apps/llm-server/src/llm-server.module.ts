import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { HealthCheckModule } from '@slibs/health-check'
import { DatabaseModule } from '@slibs/database'
import { AdminModule } from '@slibs/admin'
import { PgQueueModule } from '@slibs/pg-queue'
import { ServeStaticModule } from '@nestjs/serve-static'
import {
  AppErrorFilter,
  LocalPathUtils,
  RouterLoggerInterceptor,
} from '@slibs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: LocalPathUtils.ASSETS,
    }),
    HealthCheckModule,
    DatabaseModule.forRoot(),
    AdminModule.forRoot({}),
    PgQueueModule,
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
export class LlmServerModule {}
