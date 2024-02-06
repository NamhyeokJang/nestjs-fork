import { Injectable } from '@nestjs/common'
import { DayUtils, RandomUtils } from '@slibs/common'
import { MailerService } from '@slibs/mailer'
import { User, UserEmailVerify } from '../entities'
import { UserEmailVerifyRepository } from '../repository'

@Injectable()
export class UserEmailVerifyProvider {
  constructor(
    private readonly userEmailVerifyRepository: UserEmailVerifyRepository,
    private readonly mailerService: MailerService,
  ) {}

  async createVerify(email: string, user: User) {
    const code = RandomUtils.genStrCode(6)
    const expiredAt = DayUtils.getNow().add(5, 'm').toDate()
    await this.userEmailVerifyRepository.insert({
      email,
      code,
      expiredAt,
      userId: user.id,
    })

    await this.mailerService.sendMail({
      to: email,
      content: { subject: `회원가입 이메일 인증`, text: `CODE: ${code}` },
    })
  }

  async updateVerifyAt(verify: UserEmailVerify) {
    await this.userEmailVerifyRepository.update(verify.id, {
      verifyAt: DayUtils.getNowDate(),
    })
  }

  async findOne(email: string, user: User) {
    return this.userEmailVerifyRepository.findLatestOne(email, user.id)
  }
}
