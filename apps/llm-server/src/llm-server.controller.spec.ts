import { Test, TestingModule } from '@nestjs/testing';
import { LlmServerController } from './llm-server.controller';
import { LlmServerService } from './llm-server.service';

describe('LlmServerController', () => {
  let llmServerController: LlmServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LlmServerController],
      providers: [LlmServerService],
    }).compile();

    llmServerController = app.get<LlmServerController>(LlmServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(llmServerController.getHello()).toBe('Hello World!');
    });
  });
});
