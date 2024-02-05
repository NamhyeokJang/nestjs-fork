import { Column, Entity, Index } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { CommonEntity } from '@slibs/database'

const Description = {
  key: `key (ex. user key)`,
  email: `email`,
  code: `verify code`,
  expiredAt: `expired at`,
}

@Entity()
@Index(['key', 'email'], { unique: false })
export class EmailVerify extends CommonEntity {
  @ApiProperty({ example: 'uniq', description: Description.key })
  @Column({
    type: 'varchar',
    comment: Description.key,
    length: 20,
    nullable: false,
  })
  key: string

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
}
