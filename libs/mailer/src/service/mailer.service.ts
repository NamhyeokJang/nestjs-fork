import { Inject, Injectable } from '@nestjs/common'
import { EmailVerifyRepository } from '../repository'
import { MAILER_PROVIDER_CONTEXT } from '../constants'
import { IMailerPayload, IMailerProvider } from '../interface'

@Injectable()
export class MailerService {
  constructor(
    private readonly emailVerifyRepository: EmailVerifyRepository,
    @Inject(MAILER_PROVIDER_CONTEXT)
    private readonly mailerProvider: IMailerProvider,
  ) {}

  async sendMail(payload: IMailerPayload) {
    return this.mailerProvider.send(payload)
  }

  // async sendVerifyCode()
}
