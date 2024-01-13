import { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { SwaggerConfig } from './config'

export function swaggerSetup(app: INestApplication): void {
  if (!SwaggerConfig.ENABLED) {
    return
  }

  const builder = new DocumentBuilder()
    .setTitle(SwaggerConfig.TITLE)
    .setDescription(SwaggerConfig.DESCRIPTION)
    .setVersion(SwaggerConfig.VERSION)
    .addBearerAuth({ type: 'http', in: 'header', bearerFormat: 'JWT' })
    .build()

  const document = SwaggerModule.createDocument(app, builder)

  SwaggerModule.setup(SwaggerConfig.PATH, app, document)
}
