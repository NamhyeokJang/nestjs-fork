import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { EmailVerify } from './entities'
import { MailerType } from './interface'
import { MAILER_PROVIDER_CONTEXT } from './constants'
import { GmailProvider } from './provider'
import { EmailVerifyRepository } from './repository'
import { MailerService } from './service'

@Module({})
export class MailerModule {
  static forRoot(type: MailerType): DynamicModule {
    const mailerProvider = ((type: MailerType) => {
      switch (type) {
        case 'gmail':
          return GmailProvider
      }
    })(type)

    return {
      global: true,
      module: MailerModule,
      imports: [TypeOrmModule.forFeature([EmailVerify])],
      providers: [
        {
          provide: MAILER_PROVIDER_CONTEXT,
          useClass: mailerProvider,
        },
        EmailVerifyRepository,
        MailerService,
      ],
      exports: [MailerService],
    }
  }
}
