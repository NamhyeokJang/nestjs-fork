import { Module } from '@nestjs/common';
import { LlmServerController } from './llm-server.controller';
import { LlmServerService } from './llm-server.service';

@Module({
  imports: [],
  controllers: [LlmServerController],
  providers: [LlmServerService],
})
export class LlmServerModule {}
