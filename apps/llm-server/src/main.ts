import { NestFactory } from '@nestjs/core';
import { LlmServerModule } from './llm-server.module';

async function bootstrap() {
  const app = await NestFactory.create(LlmServerModule);
  await app.listen(3000);
}
bootstrap();
