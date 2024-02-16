import { Controller, Get } from '@nestjs/common';
import { LlmServerService } from './llm-server.service';

@Controller()
export class LlmServerController {
  constructor(private readonly llmServerService: LlmServerService) {}

  @Get()
  getHello(): string {
    return this.llmServerService.getHello();
  }
}
