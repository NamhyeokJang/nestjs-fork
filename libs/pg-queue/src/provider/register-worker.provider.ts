import { Injectable } from '@nestjs/common'
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'
import {
  ON_COMPLETE_WORKER_QUEUE_NAME,
  REGISTER_WORKER_QUEUE_NAME,
  WORKER_OPTIONS,
} from '../constants'
import { PgQueueService } from '../service'

@Injectable()
export class RegisterWorkerProvider {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  async registerWorkers(service: PgQueueService) {
    await Promise.all(
      this.discovery
        .getProviders()
        .filter(wrapper => wrapper.isDependencyTreeStatic())
        .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
        .map(async ({ instance }) => this.register(service, instance)),
    )
  }

  async register(service: PgQueueService, instance: any) {
    if (instance.constructor.name === 'String') return

    const methods = this.scanner.getAllMethodNames(instance)
    for (const method of methods) {
      const methodRef = instance[method]

      const worker = this.reflector.get(REGISTER_WORKER_QUEUE_NAME, methodRef)

      // register worker
      if (worker) {
        const options = this.reflector.get(WORKER_OPTIONS, methodRef)
        const originMethod = async (...args: unknown[]) =>
          methodRef.call(instance, ...args)

        await service.registerWork(worker, originMethod, options)
      }

      // register complete worker
      const complete = this.reflector.get(
        ON_COMPLETE_WORKER_QUEUE_NAME,
        methodRef,
      )
      if (complete) {
        const options = this.reflector.get(WORKER_OPTIONS, methodRef)
        const originMethod = async (...args: unknown[]) =>
          methodRef.call(instance, ...args)

        await service.onComplete(complete, originMethod, options)
      }
    }
  }
}
