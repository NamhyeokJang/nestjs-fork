import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommonRepository } from '@slibs/database'
import { EmailVerify } from '../entities'

@Injectable()
export class EmailVerifyRepository extends CommonRepository<EmailVerify> {
  constructor(
    @InjectRepository(EmailVerify)
    private readonly repository: Repository<EmailVerify>,
  ) {
    super(repository)
  }

  get pkField() {
    return 'id'
  }
}
