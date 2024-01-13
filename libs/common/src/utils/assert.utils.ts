import { IResponseCode } from '../api'
import { CommonException } from '../exception'

export class AssertUtils {
  static ensure<T>(
    expr: T,
    responseCode: IResponseCode,
    message?: string,
    data?: T,
  ): asserts expr {
    if (!expr) {
      throw new CommonException(responseCode, message, data)
    }
  }

  static throw(
    responseCode: IResponseCode,
    message?: string,
  ): asserts responseCode {
    throw new CommonException(responseCode, message)
  }
}
