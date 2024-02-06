import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { InjectRepository } from '@nestjs/typeorm'
import { IsNull, Repository } from 'typeorm'
import { UserEmailVerify } from '../entities'

@Injectable()
export class UserEmailVerifyRepository extends CommonRepository<UserEmailVerify> {
  constructor(
    @InjectRepository(UserEmailVerify)
    private readonly repository: Repository<UserEmailVerify>,
  ) {
    super(repository)
  }

  get pkField() {
    return 'id'
  }

  async findLatestOne(email: string, userId: number) {
    return this.repository.findOne({
      where: { email, userId, verifyAt: IsNull() },
      order: { id: 'DESC' },
    })
  }
}
