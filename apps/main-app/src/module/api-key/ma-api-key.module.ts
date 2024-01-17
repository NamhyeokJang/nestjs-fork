import { Module } from '@nestjs/common'
import { ApiKeyModule } from '@slibs/api-key'
import { AdminModule } from '@slibs/admin'
import { ApiKeyOptions } from './admin'

@Module({
  imports: [ApiKeyModule.forRoot(), AdminModule.forFeature([ApiKeyOptions])],
})
export class MaApiKeyModule {}
