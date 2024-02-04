import { Module } from '@nestjs/common'
import { UserModule } from '@slibs/user'
import { UserV1Controller } from './controller'

@Module({
  imports: [UserModule],
  controllers: [UserV1Controller],
})
export class MaUserModule {}
