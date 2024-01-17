import { Column, Entity, PrimaryColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Auditable } from '@slibs/database'
import { UUIDUtils } from '@slibs/common'

const Description = {
  key: `unique key`,
  name: `name`,
  expiredAt: `expired at`,
  meta: `meta data`,
}

@Entity()
export class ApiKey extends Auditable {
  @ApiProperty({ example: UUIDUtils.v4(), description: Description.key })
  @PrimaryColumn({ type: 'uuid', comment: Description.key, nullable: false })
  key!: string

  @ApiPropertyOptional({ example: 'sample', description: Description.name })
  @Column({ type: 'varchar', comment: Description.name, nullable: true })
  name: string | null

  @ApiPropertyOptional({
    example: new Date().toISOString(),
    description: Description.expiredAt,
  })
  @Column({ type: 'timestamp', comment: Description.expiredAt, nullable: true })
  expiredAt: Date | null

  @Exclude()
  @Column({ type: 'jsonb', comment: Description.meta, default: '{}' })
  meta: object
}
