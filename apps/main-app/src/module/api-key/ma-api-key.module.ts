import { Module } from '@nestjs/common'
import { ApiKeyModule } from '@slibs/api-key'
import { ApiKeyControllerV1 } from './controller'
import { AdminModule } from '@slibs/admin'
import { ApiKeyOptions } from './admin'

@Module({
  imports: [ApiKeyModule.forRoot(), AdminModule.forFeature([ApiKeyOptions])],
  controllers: [ApiKeyControllerV1],
})
export class MaApiKeyModule {}
