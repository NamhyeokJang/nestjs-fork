import { Module } from '@nestjs/common'
import { ApiKeyModule } from '@slibs/api-key'
import { AdminModule } from '@slibs/admin'
import { ApiKeyAdminOptions } from './admin'

@Module({
  imports: [
    ApiKeyModule.forRoot(),
    AdminModule.forFeature([ApiKeyAdminOptions]),
  ],
})
export class MaApiKeyModule {}
