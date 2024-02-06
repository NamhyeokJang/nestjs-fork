import { User } from '../entities'

export interface IUserRoleRule {
  check(user: User): Promise<boolean>
}
