import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { MainAppService } from './main-app.service'
import { HealthCheckModule } from '@slibs/health-check'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import {
  AppErrorFilter,
  ModuleUtils,
  RouterLoggerInterceptor,
} from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { ApiKeyModule } from '@slibs/api-key'
import * as controllers from './controller'

@Module({
  imports: [
    HealthCheckModule,
    DatabaseModule.forRoot(),
    ApiKeyModule.forRoot(),
  ],
  controllers: [...ModuleUtils.exports(controllers)],
  providers: [
    MainAppService,
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
