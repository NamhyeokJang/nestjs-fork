import { Module } from '@nestjs/common'
import { ApiKeyModule } from '@slibs/api-key'
import { ApiKeyControllerV1 } from './controller'

@Module({
  imports: [ApiKeyModule.forRoot()],
  controllers: [ApiKeyControllerV1],
})
export class MaApiKeyModule {}
