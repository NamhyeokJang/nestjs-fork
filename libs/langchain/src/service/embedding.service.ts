import { Injectable, Logger } from '@nestjs/common'
import { PgQueueService, PQJob, QueueWorker } from '@slibs/pg-queue'
import { Document, TokenTextSplitter } from '../core'
import { IEmbeddingJob, IRemoveEmbeddedJob } from '../interface'
import { EMBEDDING_FILE_STATUS, LANGCHAIN_QUEUE } from '../constants'
import { EmbeddingFileProvider, VectorStoreProvider } from '../provider'
import { getFileLoader } from '../utils'

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly queueService: PgQueueService,
    private readonly embeddingFileProvider: EmbeddingFileProvider,
    private readonly vectorStoreProvider: VectorStoreProvider,
  ) {}

  // enqueue for vector embedding from upload file
  async enqueueForEmbeddingFile(
    owner: string,
    file: any,
    metadata: Record<string, any> = {},
  ) {
    const embeddingFile = await this.embeddingFileProvider.save(
      owner,
      file,
      metadata,
    )
    await this.queueService.enqueue(
      LANGCHAIN_QUEUE.EMBEDDING,
      {
        fileId: embeddingFile.id,
        owner,
        metadata,
      },
      { retryLimit: 3 },
    )
  }

  async enqueueForDeleteFile(owner: string, fileId: number) {
    const file = await this.embeddingFileProvider.get(fileId)
    await this.queueService.enqueue(
      LANGCHAIN_QUEUE.REMOVE_EMBEDDED,
      {
        fileId: file.id,
        owner,
      },
      { retryLimit: 3 },
    )
  }

  // work batch for process vector embedding from upload file
  @QueueWorker(LANGCHAIN_QUEUE.EMBEDDING, { teamConcurrency: 10, teamSize: 10 })
  private async processEmbedding(job: PQJob<IEmbeddingJob>) {
    this.logger.log(`PROCESS_EMBEDDING:: job:${job.id}`)
    // get file
    const data = job.data
    const owner = data.owner
    const file = await this.embeddingFileProvider.get(data.fileId)
    await this.embeddingFileProvider.updateStatus(
      file,
      EMBEDDING_FILE_STATUS.IN_PROGRESS,
    )

    // try embedding file...
    try {
      const buffer = await this.embeddingFileProvider.getBuffer(file)
      const docs = await this.loadDocumentsFromFile(
        { buffer, mimeType: file.metadata.mimeType },
        { fileId: file.id, owner, ...job.data.metadata },
      )
      await this.vectorStoreProvider.addDocuments(owner, docs)
      await this.embeddingFileProvider.updateStatus(
        file,
        EMBEDDING_FILE_STATUS.COMPLETED,
      )
      this.logger.log(`PROCESS_EMBEDDING_COMPLETE:: job:${job.id}`)
    } catch (ex) {
      this.logger.error(`PROCESS_EMBEDDING_ERROR:: job:${job.id}, error:${ex}`)
      await this.embeddingFileProvider.updateStatus(
        file,
        EMBEDDING_FILE_STATUS.FAILED,
        { err: ex?.message },
      )
      await job.fail()
    }
  }

  // work batch for process delete embedded vector data
  @QueueWorker(LANGCHAIN_QUEUE.REMOVE_EMBEDDED, {
    teamConcurrency: 10,
    teamSize: 10,
  })
  private async processRemoveEmbedded(job: PQJob<IRemoveEmbeddedJob>) {
    this.logger.log(`PROCESS_REMOVE_EMBEDDED:: job:${job.id}`)
    const data = job.data
    const file = await this.embeddingFileProvider.get(data.fileId)
    await this.embeddingFileProvider.updateStatus(
      file,
      EMBEDDING_FILE_STATUS.DELETING,
    )
    try {
      await this.vectorStoreProvider.deleteDocuments(data.owner, {
        fileId: file.id,
      })
      await this.embeddingFileProvider.updateStatus(
        file,
        EMBEDDING_FILE_STATUS.DELETED,
      )
      this.logger.log(`PROCESS_REMOVE_EMBEDDED_COMPLETE:: job:${job.id}`)
    } catch (ex) {
      this.logger.error(
        `PROCESS_REMOVE_EMBEDDED_ERROR:: job:${job.id}, error:${ex}`,
      )
      await this.embeddingFileProvider.updateStatus(
        file,
        EMBEDDING_FILE_STATUS.FAILED,
      )
      await job.fail()
    }
  }

  private async loadDocumentsFromFile(
    file: { buffer: Buffer; mimeType: string },
    metadata: Record<string, any> = {},
  ): Promise<Array<Document>> {
    const loader = getFileLoader(file.buffer, file.mimeType)
    const docs = await loader.loadAndSplit(
      new TokenTextSplitter({
        encodingName: 'cl100k_base',
        chunkSize: 700,
        chunkOverlap: 1,
      }),
    )
    return docs.map((doc: Document) => ({
      ...doc,
      metadata: { ...doc.metadata, ...metadata },
      test: 1,
    }))
  }
}
