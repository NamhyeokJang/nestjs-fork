import { Global, Module } from '@nestjs/common'
import { ClientSecretGuard } from './guard'

@Global()
@Module({
  providers: [ClientSecretGuard],
})
export class ClientSecretModule {}
