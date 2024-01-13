import { Column, Entity } from 'typeorm'
import { CommonEntity } from '@slibs/database'
import { ADMIN_ROLE, ADMIN_ROLE_LEVEL } from '../constants'
import { IAdmin } from '../interface'

const Description = {
  email: 'email',
  password: 'password',
  name: 'name',
  role: 'role',
  loggedAt: `last logged at`,
}

@Entity()
export class AdminUser extends CommonEntity {
  @Column({
    type: 'varchar',
    comment: Description.email,
    unique: true,
    nullable: false,
  })
  email: string

  @Column({ type: 'varchar', comment: Description.password, nullable: false })
  password: string

  @Column({ type: 'varchar', comment: Description.name, nullable: false })
  name: string

  @Column({
    type: 'enum',
    enum: ADMIN_ROLE,
    comment: Description.role,
    nullable: false,
    default: ADMIN_ROLE.MANAGER,
  })
  role: ADMIN_ROLE

  @Column({ type: 'timestamp', comment: Description.loggedAt, nullable: true })
  loggedAt: Date | null

  get roleLv() {
    return ADMIN_ROLE_LEVEL[this.role]
  }

  toAdmin(): IAdmin {
    return {
      id: this.id.toString(),
      email: this.email,
      role: this.role,
      roleLv: this.roleLv,
    }
  }
}
