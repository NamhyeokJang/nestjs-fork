import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { ServeStaticModule } from '@nestjs/serve-static'
import { HealthCheckModule } from '@slibs/health-check'
import {
  AppErrorFilter,
  LocalPathUtils,
  RouterLoggerInterceptor,
} from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { AdminLocale, MaApiKeyModule } from './module'
import { AdminModule } from '@slibs/admin'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: LocalPathUtils.ASSETS,
    }),
    HealthCheckModule,
    DatabaseModule.forRoot(),
    MaApiKeyModule,
    AdminModule.forRoot({ locale: AdminLocale }),
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
