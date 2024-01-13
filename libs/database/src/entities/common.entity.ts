import { PrimaryGeneratedColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { Auditable } from './auditable.entity'

const Description = {
  id: '일련번호',
}

export abstract class CommonEntity extends Auditable {
  @ApiProperty({ example: 1, description: Description.id })
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: Description.id,
  })
  readonly id: number
}
