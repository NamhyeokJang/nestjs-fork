import { QueryFailedError } from 'typeorm'
import { AssertUtils, CommonResponseCode } from '@slibs/common'

export function QueryErrorCatcher() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      return originalMethod.apply(this, args).catch((ex: any) => {
        if (ex instanceof QueryFailedError) {
          const err = ex.driverError
          if (err?.constraint) {
            AssertUtils.throw(err.constraint)
          }
          if (err?.column) {
            AssertUtils.throw(
              CommonResponseCode.INTERNAL,
              `required "${err.column}"`,
            )
          }
        }

        console.error(ex)
        AssertUtils.throw(CommonResponseCode.INTERNAL, `Unhandled sql error`)
      })
    }
  }
}
