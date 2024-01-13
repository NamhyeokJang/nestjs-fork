// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
import { NestFactory } from '@nestjs/core'
import { VersioningType } from '@nestjs/common'
import dedent from 'dedent'
import { swaggerSetup } from '@slibs/swagger'
import { MainAppConfig } from './config'
import { NestExpressApplication } from '@nestjs/platform-express'
import { MainAppModule } from './main-app.module'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainAppModule)
  app.enableVersioning({ type: VersioningType.URI })

  swaggerSetup(app)

  const { HOST, PORT } = MainAppConfig

  await app.listen(PORT, HOST)

  return `${HOST}:${PORT}`
}

bootstrap()
  .then(url => console.log(dedent(`🚀🚀 START SERVER ${url}`)))
  .catch(ex => console.error(ex))
