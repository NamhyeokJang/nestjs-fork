import { Module } from '@nestjs/common'
import { LangChainModule } from '@slibs/langchain'
import { AiChatService } from './service'
import { AiChatV1Controller } from './controller'

@Module({
  imports: [LangChainModule],
  providers: [AiChatService],
  controllers: [AiChatV1Controller],
  exports: [AiChatService],
})
export class AiChatModule {}
