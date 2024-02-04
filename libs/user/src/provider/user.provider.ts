import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repository'
import { USER_ROLE } from '../constants'

@Injectable()
export class UserProvider {
  constructor(private readonly userRepository: UserRepository) {}

  async createAnonymous() {
    const inserted = await this.userRepository.insert({
      role: USER_ROLE.ANONYMOUS,
    })
    return this.userRepository.findOneById(inserted)
  }
}
