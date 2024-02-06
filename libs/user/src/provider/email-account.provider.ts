import { Injectable } from '@nestjs/common'
import { CryptoUtils, DayUtils } from '@slibs/common'
import { EmailAccountRepository } from '../repository'
import { EmailAccount, User } from '../entities'

@Injectable()
export class EmailAccountProvider {
  constructor(
    private readonly emailAccountRepository: EmailAccountRepository,
  ) {}

  async getById(id: number) {
    return this.emailAccountRepository.findOneById(id, qb =>
      qb.leftJoinAndSelect('e.user', 'user'),
    )
  }

  async getByEmail(email: string) {
    return this.emailAccountRepository.findOneByEmail(email)
  }

  async create(email: string, password: string, user: User) {
    const inserted = await this.emailAccountRepository.insert({
      email,
      password: await CryptoUtils.genSaltedStr(password),
      userId: user.id,
    })

    return this.getById(inserted as number)
  }

  async checkPassword(account: EmailAccount, password: string) {
    return CryptoUtils.compareSalted(password, account.password)
  }

  async updateLoggedAt(account: EmailAccount) {
    return this.emailAccountRepository.update(account.id, {
      loggedAt: DayUtils.getNowDate(),
    })
  }
}
