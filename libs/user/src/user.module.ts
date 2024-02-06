import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailAccount, User, UserEmailVerify } from './entities'
import {
  EmailAccountRepository,
  UserEmailVerifyRepository,
  UserRepository,
} from './repository'
import {
  EmailAccountProvider,
  UserEmailVerifyProvider,
  UserProvider,
} from './provider'
import { UserService } from './service'
import { UserRoleGuard } from './guard'

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailAccount, UserEmailVerify])],
  providers: [
    UserRepository,
    EmailAccountRepository,
    UserEmailVerifyRepository,
    UserProvider,
    EmailAccountProvider,
    UserEmailVerifyProvider,
    UserRoleGuard,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
