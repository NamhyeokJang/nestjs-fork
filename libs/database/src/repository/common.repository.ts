import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm'
import { CommonResponseCode, AssertUtils, DayUtils } from '@slibs/common'
import { isArray } from 'lodash'
import { QueryErrorCatcher } from '../decorator'

export abstract class CommonRepository<T extends ObjectLiteral> {
  constructor(private readonly _repository: Repository<T>) {}

  abstract get pkField(): string

  create(partial: Partial<T>): T {
    return this._repository.create(partial as T)
  }

  @QueryErrorCatcher()
  async insert(partial: Partial<T>): Promise<number | string> {
    const inst = this.create(partial)

    const result = await this._repository
      .createQueryBuilder()
      .insert()
      .values(inst)
      .execute()

    return result.identifiers[0][this.pkField]
  }

  async findOneById(
    pk: number | string,
    decorator?: (qb: SelectQueryBuilder<T>) => void,
  ): Promise<T> {
    const qb = this._repository
      .createQueryBuilder('e')
      .select()
      .where(`e.${this.pkField} = :pk`, { pk })

    if (decorator) {
      decorator(qb)
    }

    return qb.getOneOrFail()
  }

  async update(pk: number | string, updates: Partial<T>) {
    if (Object.keys(updates).length === 0) {
      AssertUtils.throw(CommonResponseCode.BAD_REQUEST, `no updates`)
    }

    const e = await this.findOneById(pk)
    AssertUtils.ensure(e, CommonResponseCode.NOT_FOUND)

    await this._repository
      .createQueryBuilder()
      .update()
      .set({ ...updates, updatedAt: DayUtils.getNow() })
      .andWhere(`${this.pkField} = :pk`, { pk })
      .execute()
  }

  async delete(pk: number | string) {
    await this._repository
      .createQueryBuilder()
      .delete()
      .where(`${this.pkField} = :pk`, { pk })
      .execute()
  }

  async query(config: {
    opt?: { skip: number; take: number }
    order?: { [key: string]: 'DESC' | 'ASC' }
    decorator?: (qb: SelectQueryBuilder<T>) => void
    filters?: object
  }) {
    let qb = this._repository.createQueryBuilder(`e`).select()

    if (config.decorator) {
      config.decorator(qb)
    }

    Object.entries(config.filters ?? {}).forEach(([key, value]) => {
      if (isArray(value)) {
        qb.andWhere(`e.${key} IN (:${key})`, { [key]: value })
      }
      qb.andWhere(`e.${key} = :${key}`, { [key]: value })
    })

    const { skip, take } = config.opt ?? { skip: 0, take: 10 }

    qb = qb.skip(skip).take(take)

    if (!config.order) {
      qb = qb.orderBy(`e.${this.pkField}`, 'DESC')
    } else {
      Object.entries(config.order).map(([key, value]) => {
        qb = qb.addOrderBy(key, value)
      })
    }

    return await qb.getManyAndCount()
  }
}
