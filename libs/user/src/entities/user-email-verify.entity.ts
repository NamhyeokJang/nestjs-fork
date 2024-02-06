import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { CommonEntity } from '@slibs/database'
import { Exclude } from 'class-transformer'
import { User } from './user.entity'

const Description = {
  email: `email`,
  code: `verify code`,
  expiredAt: `expired at`,
  verifyAt: `verify at`,
  user: `user`,
}

@Entity()
@Index(['userId', 'email'], { unique: false })
export class UserEmailVerify extends CommonEntity {
  @ApiProperty({
    example: 'sample@example.com',
    description: Description.email,
  })
  @Column({ type: 'varchar', comment: Description.email, nullable: false })
  email: string

  @ApiProperty({ example: 'verify code', description: Description.code })
  @Column({
    type: 'varchar',
    comment: Description.code,
    length: 10,
    nullable: false,
  })
  code: string

  @ApiProperty({
    example: new Date().toISOString(),
    description: Description.expiredAt,
  })
  @Column({
    type: 'timestamp',
    comment: Description.expiredAt,
    nullable: false,
  })
  expiredAt: Date

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: Description.verifyAt,
  })
  @Column({ type: 'timestamp', comment: Description.verifyAt, nullable: true })
  verifyAt: Date | null

  @Exclude()
  @Column({ type: 'int', comment: Description.user, nullable: false })
  userId: number

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: User
}
