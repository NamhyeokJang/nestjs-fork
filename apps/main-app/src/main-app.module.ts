import { Module } from '@nestjs/common'
import { MainAppController } from './main-app.controller'
import { MainAppService } from './main-app.service'
import { HealthCheckModule } from '@slibs/health-check'

@Module({
  imports: [HealthCheckModule],
  controllers: [MainAppController],
  providers: [MainAppService],
})
export class MainAppModule {}
