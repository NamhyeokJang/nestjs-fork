import PgBoss from 'pg-boss'
import { IJob } from '../interface'

export class Job<T> {
  constructor(
    private client: PgBoss,
    private readonly raw: IJob<T>,
  ) {}

  get id() {
    return this.raw.id
  }

  get data() {
    return this.raw.data
  }

  async cancel() {
    return await this.client.cancel(this.id)
  }

  async resume() {
    return this.client.resume(this.id)
  }

  async complete() {
    return this.client.complete(this.id)
  }

  async fail() {
    return this.client.fail(this.id)
  }
}
