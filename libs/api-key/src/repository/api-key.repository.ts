import { Injectable } from '@nestjs/common'
import { CommonRepository } from '@slibs/database'
import { ApiKey } from '../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ApiKeyRepository extends CommonRepository<ApiKey> {
  constructor(
    @InjectRepository(ApiKey)
    private readonly repository: Repository<ApiKey>,
  ) {
    super(repository)
  }

  get pkField(): string {
    return 'key'
  }
}
