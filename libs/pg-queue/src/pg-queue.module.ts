import { Module } from '@nestjs/common'
import { RegisterWorkerProvider } from './provider'
import { PgQueueService } from './service'
import { DiscoveryModule } from '@nestjs/core'

@Module({
  imports: [DiscoveryModule],
  providers: [PgQueueService, RegisterWorkerProvider],
  exports: [PgQueueService],
})
export class PgQueueModule {}
