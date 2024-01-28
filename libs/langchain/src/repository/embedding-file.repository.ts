import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CommonRepository } from '@slibs/database'
import { EmbeddingFile } from '../entities'

@Injectable()
export class EmbeddingFileRepository extends CommonRepository<EmbeddingFile> {
  constructor(
    @InjectRepository(EmbeddingFile)
    private readonly repository: Repository<EmbeddingFile>,
  ) {
    super(repository)
  }

  get pkField() {
    return 'id'
  }
}
