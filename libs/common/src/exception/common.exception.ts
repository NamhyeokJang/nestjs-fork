import { IResponseCode } from '../api'

export class CommonException<T> extends Error {
  readonly code: number
  readonly data?: T

  constructor(responseCode: IResponseCode, message?: string, data?: T) {
    super(message || responseCode.message)

    this.code = responseCode.code
    this.data = data
  }
}
