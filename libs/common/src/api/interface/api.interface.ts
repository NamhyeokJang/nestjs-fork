import { Request } from 'express'

export interface IAuthRequest extends Request {
  isAuthorized?: boolean
  authType?: 'api-key' | 'user-role'
  user?: any
}

export interface IResponseCode {
  code: number
  message: string
}

export interface IPagination {
  page: number
  pageSize: number
  total: number
}
