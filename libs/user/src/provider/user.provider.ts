import { Injectable } from '@nestjs/common'
import { UserRepository } from '../repository'
import { USER_ROLE } from '../constants'
import { User } from '../entities'

@Injectable()
export class UserProvider {
  constructor(private readonly userRepository: UserRepository) {}

  async createAnonymous() {
    const inserted = await this.userRepository.insert({
      role: USER_ROLE.ANONYMOUS,
    })
    return this.userRepository.findOneById(inserted)
  }

  async updateRole(user: User, role: USER_ROLE) {
    await this.userRepository.update(user.id, { role })
  }

  async findOne(id: number) {
    return this.userRepository.findOneById(id)
  }
}
