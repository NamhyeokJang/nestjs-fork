import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import PgBoss, { JobInsert } from 'pg-boss'
import { PgQueueConfig } from '../config'
import {
  IBulkEnqueueOptions,
  IEnqueueOptions,
  IJob,
  IWorkOptions,
} from '../interface'
import { PQJob } from '../dto'
import { RegisterWorkerProvider } from '../provider'

@Injectable()
export class PgQueueService implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name)
  private readonly _client: PgBoss

  constructor(private readonly workerProvider: RegisterWorkerProvider) {
    this._client = new PgBoss({
      connectionString: PgQueueConfig.CONNECT_STRING,
      schema: PgQueueConfig.SCHEMA,
    })
  }

  async onModuleInit() {
    await this._client.start()
    await this.workerProvider.registerWorkers(this)
    this.logger.log(`START PG-QUEUE`)
  }

  // returning created job id
  async enqueue(
    name: string,
    data: object,
    options: IEnqueueOptions = {},
  ): Promise<string | null> {
    return this._client.send(name, data, options)
  }

  // create bulk insert
  async enqueueBulk<T>(
    name: string,
    data: Array<T>,
    options: IBulkEnqueueOptions = {},
  ) {
    const jobs = data.map(d => ({ name, data: d, ...options }))
    await this._client.insert(jobs as JobInsert[])
  }

  // get job info
  async getJob(id: string): Promise<IJob | null> {
    return this._client.getJobById(id)
  }

  // get pending job and change active
  async fetch<T>(name: string): Promise<IJob<T> | null> {
    return this._client.fetch(name)
  }

  // register work
  async registerWork(
    name: string,
    fn: (job: PQJob<any>) => Promise<any>,
    options: IWorkOptions = { teamSize: 10 },
  ): Promise<string> {
    this.logger.log(`REGISTERED_WORK:: name:${name}`)
    return this._client.work(name, options, async job => {
      return fn(new PQJob(this._client, job))
    })
  }

  async onComplete(
    name: string,
    fn: PgBoss.WorkHandler<any>,
    options: IWorkOptions = { teamSize: 10 },
  ) {
    return this._client.onComplete(name, options, fn)
  }
}
