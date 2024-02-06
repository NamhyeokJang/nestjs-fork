import { DynamicModule, Module } from '@nestjs/common'
import { MailerType } from './interface'
import { MAILER_PROVIDER_CONTEXT } from './constants'
import { GmailProvider } from './provider'
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
      providers: [
        {
          provide: MAILER_PROVIDER_CONTEXT,
          useClass: mailerProvider,
        },
        MailerService,
      ],
      exports: [MailerService],
    }
  }
}
