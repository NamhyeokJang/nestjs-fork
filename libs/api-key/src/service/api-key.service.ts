import { Injectable } from '@nestjs/common'
import {
  AssertUtils,
  CommonResponseCode,
  DayUtils,
  UUIDUtils,
} from '@slibs/common'
import { ApiKey } from '../entities'
import { ApiKeyRepository } from '../repository'
import { CreateApiKeyPayload } from '../dto'

@Injectable()
export class ApiKeyService<META extends object> {
  constructor(private readonly repository: ApiKeyRepository) {}

  async create(payload: CreateApiKeyPayload<META>): Promise<ApiKey> {
    AssertUtils.ensure(
      !payload.expiredAt ||
        DayUtils.getDay(payload.expiredAt).isAfter(DayUtils.getNow()),
      CommonResponseCode.BAD_REQUEST,
      'invalid expired at',
    )

    const key = UUIDUtils.v4()
    const pk = await this.repository.insert({
      key,
      meta: payload.meta,
      expiredAt: DayUtils.getDay(payload.expiredAt).toDate(),
    })

    return this.repository.findOneById(pk)
  }

  getByKey(key: string) {
    return this.repository.findOneById(key)
  }

  async deprecate(key: string) {
    await this.repository.update(key, { expiredAt: DayUtils.getNow().toDate() })
  }
}
