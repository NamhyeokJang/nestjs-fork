import { CurrentAdmin } from 'adminjs'

export interface IAdminAuthenticate {
  (email: string, password: string): Promise<CurrentAdmin | null>
}
