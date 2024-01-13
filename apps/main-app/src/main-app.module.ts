import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common'
import { MainAppController } from './main-app.controller'
import { MainAppService } from './main-app.service'
import { HealthCheckModule } from '@slibs/health-check'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import { AppErrorFilter, RouterLoggerInterceptor } from '@slibs/common'
import { DatabaseModule } from '@slibs/database'

@Module({
  imports: [HealthCheckModule, DatabaseModule.forRoot()],
  controllers: [MainAppController],
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
