import { IUserRoleRule, USER_ROLE_LV } from '@slibs/user'
import { User, USER_ROLE } from '@slibs/user'

export class UserRoleRule implements IUserRoleRule {
  private _minRole = USER_ROLE_LV[USER_ROLE.ANONYMOUS]
  private _acceptRole: Array<USER_ROLE> = Object.values(USER_ROLE)

  setMinRole(role: USER_ROLE) {
    this._minRole = USER_ROLE_LV[role]
    return this
  }

  setAcceptRole(role: USER_ROLE) {
    this._acceptRole = [role]
    return this
  }

  async check(user: User) {
    return user.roleLv >= this._minRole && this._acceptRole.includes(user.role)
  }
}
