import { CommonEntity } from '@slibs/database'
import { Column, Entity } from 'typeorm'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { USER_ROLE, USER_ROLE_LV } from '../constants'
import { Exclude } from 'class-transformer'

const Description = {
  role: `user's role`,
  nickname: `user's name`,
}

@Entity()
export class User extends CommonEntity {
  @ApiProperty({ example: USER_ROLE.USER, description: Description.role })
  @Column({ type: 'enum', enum: USER_ROLE, comment: Description.role })
  role: USER_ROLE

  @ApiPropertyOptional({ example: 'sample', description: Description.nickname })
  @Column({
    type: 'varchar',
    comment: Description.nickname,
    length: 40,
    nullable: true,
  })
  nickname: string | null

  @Exclude()
  get roleLv() {
    return USER_ROLE_LV[this.role]
  }
}
