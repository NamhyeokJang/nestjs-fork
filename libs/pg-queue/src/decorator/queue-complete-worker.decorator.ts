import { applyDecorators, SetMetadata } from '@nestjs/common'
import { ON_COMPLETE_WORKER_QUEUE_NAME, WORKER_OPTIONS } from '../constants'
import { IWorkOptions } from '../interface'

export function QueueCompleteWorker(
  name: string,
  options?: IWorkOptions,
): MethodDecorator {
  return applyDecorators(
    SetMetadata(ON_COMPLETE_WORKER_QUEUE_NAME, name),
    SetMetadata(WORKER_OPTIONS, options),
  )
}
