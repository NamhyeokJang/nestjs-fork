import { Column, Entity, Index } from 'typeorm'
import { CommonEntity } from '@slibs/database'
import { ApiProperty } from '@nestjs/swagger'
import { UUIDUtils } from '@slibs/common'
import { EMBEDDING_FILE_STATUS } from '../constants'
import { IEmbeddingFileMetadata } from '../interface'

const Description = {
  key: `uuid v4`,
  filename: `filename`,
  status: `embedding status`,
  owner: `owner uniq key`,
  metadata: `metadata`,
}

@Entity()
@Index(['owner'], { unique: false })
export class EmbeddingFile extends CommonEntity {
  @ApiProperty({ example: UUIDUtils.v4(), description: Description.key })
  @Column({ type: 'uuid', comment: Description.key, nullable: false })
  key: string

  @ApiProperty({ example: 'filename', description: Description.filename })
  @Column({ type: 'varchar', comment: Description.filename, nullable: false })
  filename: string

  @ApiProperty({
    example: EMBEDDING_FILE_STATUS.PENDING,
    description: Description.status,
  })
  @Column({
    type: 'enum',
    enum: EMBEDDING_FILE_STATUS,
    comment: Description.status,
    default: EMBEDDING_FILE_STATUS.PENDING,
  })
  status: EMBEDDING_FILE_STATUS

  @ApiProperty({ example: `user`, description: Description.owner })
  @Column({
    type: 'varchar',
    comment: Description.owner,
    length: 20,
    nullable: false,
  })
  owner: string

  @ApiProperty({ example: {}, description: Description.metadata })
  @Column({ type: 'jsonb', comment: Description.metadata, default: '{}' })
  metadata: IEmbeddingFileMetadata
}
