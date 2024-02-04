import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm'
import { User } from './user.entity'
import { ApiProperty } from '@nestjs/swagger'
import { Exclude } from 'class-transformer'
import { CommonEntity } from '@slibs/database'

const Description = {
  email: `email`,
  password: `password`,
  loggedAt: `last logged at`,
  user: `user info`,
}

@Entity('email')
@Index(['email'], { unique: true })
export class EmailAccount extends CommonEntity {
  @ApiProperty({
    example: 'sample@example.com',
    description: Description.email,
  })
  @Column({ type: 'varchar', comment: Description.email, nullable: false })
  email: string

  @Exclude()
  @Column({ type: 'varchar', comment: Description.password, nullable: false })
  password: string

  @ApiProperty({
    example: new Date().toISOString(),
    description: Description.loggedAt,
  })
  @Column({ type: 'timestamp', comment: Description.loggedAt, nullable: true })
  loggedAt: Date

  @Exclude()
  @Column({ type: 'int', comment: Description.user, nullable: false })
  userId: number

  @ApiProperty({ type: User, description: Description.user })
  @OneToOne(() => User, { eager: true, nullable: false })
  @JoinColumn({ name: 'user_id' })
  user: User
}
