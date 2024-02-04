import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { EmailAccount } from '../entities'

@Injectable()
export class EmailAccountRepository extends CommonRepository<EmailAccount> {
  constructor(
    @InjectRepository(EmailAccount)
    private readonly repository: Repository<EmailAccount>,
  ) {
    super(repository)
  }

  get pkField() {
    return 'id'
  }

  async findOneByEmail(email: string) {
    return this.repository.findOneByOrFail({ email })
  }
}
