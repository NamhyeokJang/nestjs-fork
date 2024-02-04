import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailAccount, User } from './entities'
import { EmailAccountRepository, UserRepository } from './repository'
import { EmailAccountProvider, UserProvider } from './provider'
import { UserService } from './service'

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailAccount])],
  providers: [
    UserRepository,
    EmailAccountRepository,
    UserProvider,
    EmailAccountProvider,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
