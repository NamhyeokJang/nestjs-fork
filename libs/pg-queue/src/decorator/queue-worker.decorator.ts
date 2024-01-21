import { applyDecorators, SetMetadata } from '@nestjs/common'
import { REGISTER_WORKER_QUEUE_NAME, WORKER_OPTIONS } from '../constants'
import { IWorkOptions } from '../interface'

export function QueueWorker(
  name: string,
  options?: IWorkOptions,
): MethodDecorator {
  return applyDecorators(
    SetMetadata(REGISTER_WORKER_QUEUE_NAME, name),
    SetMetadata(WORKER_OPTIONS, options),
  )
}
