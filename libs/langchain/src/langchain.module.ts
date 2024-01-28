import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PgQueueModule } from '@slibs/pg-queue'
import { StorageModule } from '@slibs/storage'
import { EmbeddingFile, OpenAIUsage } from './entities'
import { EmbeddingFileRepository, OpenAIUsageRepository } from './repository'
import { EmbeddingService, LangChainService } from './service'
import { EmbeddingFileProvider, VectorStoreProvider } from './provider'

@Module({
  imports: [
    StorageModule.forFeature('local', 'langchain'),
    TypeOrmModule.forFeature([OpenAIUsage, EmbeddingFile]),
    PgQueueModule,
  ],
  providers: [
    EmbeddingFileRepository,
    EmbeddingFileProvider,
    VectorStoreProvider,
    OpenAIUsageRepository,
    EmbeddingService,
    LangChainService,
  ],
  exports: [LangChainService, EmbeddingService],
})
export class LangChainModule {}
