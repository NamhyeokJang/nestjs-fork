import { ADMIN_ROLE, ADMIN_ROLE_LEVEL } from '@slibs/admin/constants'
import { ActionContext } from 'adminjs'
import { IAdmin } from '@slibs/admin/interface'

export const checkRole = (role: ADMIN_ROLE) => {
  return (context: ActionContext) =>
    (context.currentAdmin as IAdmin).roleLv >= ADMIN_ROLE_LEVEL[role]
}
