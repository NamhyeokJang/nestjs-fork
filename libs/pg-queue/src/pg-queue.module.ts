import { Module } from '@nestjs/common'
import { PgQueueService, WorkerProviderService } from './service'
import { DiscoveryModule } from '@nestjs/core'

@Module({
  imports: [DiscoveryModule],
  providers: [PgQueueService, WorkerProviderService],
  exports: [PgQueueService],
})
export class PgQueueModule {}
