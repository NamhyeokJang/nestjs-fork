import { QueryFailedError } from 'typeorm'
import { AssertUtils, CommonResponseCode } from '@slibs/common'
import { Logger } from '@nestjs/common'

export function QueryErrorCatcher() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const logger = new Logger('QUERY ERROR')

    descriptor.value = function (...args: any[]) {
      return originalMethod.apply(this, args).catch((ex: any) => {
        if (ex instanceof QueryFailedError) {
          const err = ex.driverError
          logger.debug(`TABLE: ${err.table ?? 'unknown'}, message: ${ex}`)
          if (err.message.startsWith('duplicate key value')) {
            AssertUtils.throw(CommonResponseCode.BAD_REQUEST, 'already exists')
          }

          if (err?.column) {
            AssertUtils.throw(
              CommonResponseCode.INTERNAL,
              `required "${err.column}"`,
            )
          }
        }

        logger.error(ex)
        AssertUtils.throw(CommonResponseCode.INTERNAL, `Unhandled sql error`)
      })
    }
  }
}
