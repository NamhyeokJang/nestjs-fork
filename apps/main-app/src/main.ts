import { NestFactory } from '@nestjs/core'
import { MainAppModule } from './main-app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { VersioningType } from '@nestjs/common'
import { swaggerSetup } from '@slibs/swagger'
import dedent from 'dedent'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(MainAppModule)
  app.enableVersioning({ type: VersioningType.URI })

  swaggerSetup(app)

  await app.listen(3000)
}

bootstrap()
  .then(url => console.log(dedent(`🚀🚀 START SERVER `)))
  .catch(ex => console.error(ex))
