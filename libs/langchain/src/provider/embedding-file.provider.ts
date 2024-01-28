import { Injectable } from '@nestjs/common'
import { StorageService } from '@slibs/storage'
import { EMBEDDING_FILE_STATUS } from '../constants'
import { EmbeddingFile } from '../entities'
import { EmbeddingFileRepository } from '../repository'
import { FileAdapterUtils } from '../utils'

@Injectable()
export class EmbeddingFileProvider {
  private fileAdapter = FileAdapterUtils

  constructor(
    private readonly embeddingFileRepository: EmbeddingFileRepository,
    private readonly storageService: StorageService,
  ) {}

  async get(id: number): Promise<EmbeddingFile> {
    return this.embeddingFileRepository.findOneById(id)
  }

  async save(
    owner: string,
    uploaded: any,
    metadata: Record<string, any> = {},
  ): Promise<EmbeddingFile> {
    const file = this.fileAdapter.to(uploaded)
    this.fileAdapter.checkFileType(file)

    // save file...
    const saved = await this.storageService.save({
      filename: file.filename,
      buffer: file.buffer,
    })

    // insert to database
    const inserted = await this.embeddingFileRepository.insert({
      owner,
      key: saved.key,
      filename: file.filename,
      metadata: {
        ...metadata,
        mimeType: file.mimeType,
        storage: this.storageService.type,
      },
    })
    return this.embeddingFileRepository.findOneById(inserted)
  }

  async updateStatus(
    file: EmbeddingFile,
    status: EMBEDDING_FILE_STATUS,
    metadata: Record<string, any> = {},
  ): Promise<void> {
    await this.embeddingFileRepository.update(file.id, {
      status,
      metadata: { ...file.metadata, ...metadata },
    })
  }

  async getBuffer(file: EmbeddingFile): Promise<Buffer> {
    return this.storageService.get(file.key)
  }
}
