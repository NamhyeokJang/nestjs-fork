import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { HealthCheckModule } from '@slibs/health-check'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AppErrorFilter, RouterLoggerInterceptor } from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { MaApiKeyModule } from './module'

@Module({
  imports: [HealthCheckModule, DatabaseModule.forRoot(), MaApiKeyModule],
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
