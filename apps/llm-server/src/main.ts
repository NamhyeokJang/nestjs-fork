// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

import { NestFactory } from '@nestjs/core'
import { LlmServerModule } from './llm-server.module'
import { VersioningType } from '@nestjs/common'
import { swaggerSetup } from '@slibs/swagger'
import { LLMAppConfig } from './config'
import dedent from 'dedent'

async function bootstrap() {
  const app = await NestFactory.create(LlmServerModule)
  app.enableVersioning({ type: VersioningType.URI })

  swaggerSetup(app)

  const { HOST, PORT } = LLMAppConfig

  await app.listen(PORT, HOST)

  return `${HOST}:${PORT}`
}

bootstrap()
  .then(url => console.log(dedent(`🚀🚀 START SERVER ${url}`)))
  .catch(ex => console.error(ex))
