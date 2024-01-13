import { CurrentAdmin, ResourceWithOptions } from 'adminjs'
import { ADMIN_ROLE } from '../constants'

export interface IAdmin extends CurrentAdmin {
  role: ADMIN_ROLE
  roleLv: number
}

export interface IAdminJSResource extends ResourceWithOptions {}
