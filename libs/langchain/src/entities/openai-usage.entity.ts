import { Column, Entity, Index } from 'typeorm'
import { CommonEntity } from '@slibs/database'

const Description = {
  key: `uniq`,
  date: `YYYY-MM-DD (KST)`,
  model: `model name`,
  promptTokens: `prompt tokens`,
  completionTokens: `completion tokens`,
  totalTokens: `total tokens`,
}

@Entity()
@Index('OPENAI_USAGE_UNIQUE', ['key', 'date', 'model'], { unique: true })
export class OpenAIUsage extends CommonEntity {
  @Column({
    type: 'varchar',
    comment: Description.key,
    length: 40,
    nullable: false,
  })
  key: string

  @Column({
    type: 'varchar',
    comment: Description.date,
    length: 'YYYY-MM-DD'.length,
    nullable: false,
  })
  date: string

  @Column({
    type: 'varchar',
    comment: Description.model,
    length: '40',
    nullable: false,
  })
  model: string

  @Column({ type: 'int', comment: Description.promptTokens, default: 0 })
  promptTokens: number

  @Column({ type: 'int', comment: Description.completionTokens, default: 0 })
  completionTokens: number

  @Column({ type: 'int', comment: Description.totalTokens, default: 0 })
  totalTokens: number
}
