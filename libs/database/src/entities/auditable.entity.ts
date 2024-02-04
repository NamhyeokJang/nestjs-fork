import { BaseEntity, BeforeInsert, BeforeUpdate, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { DayUtils } from '@slibs/common'

const Description = {
  createdAt: '생성시각',
  updatedAt: '마지막 업데이트 시각',
}

export abstract class Auditable extends BaseEntity {
  @ApiProperty({
    example: new Date().toISOString(),
    description: Description.createdAt,
  })
  @Column({
    type: 'timestamp',
    comment: Description.createdAt,
    nullable: false,
  })
  createdAt: Date

  @ApiProperty({
    example: new Date().toISOString(),
    description: Description.updatedAt,
  })
  @Column({
    type: 'timestamp',
    comment: Description.updatedAt,
    nullable: false,
  })
  updatedAt: Date

  @BeforeInsert()
  beforeInsert() {
    const now = DayUtils.getNowDate()
    this.createdAt = now
    this.updatedAt = now
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updatedAt = DayUtils.getNowDate()
  }
}
