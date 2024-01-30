import { Injectable, Logger } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'
import { postgresOptions } from '@slibs/database'
import { TypeORMVectorStore, OpenAIEmbeddings, Document } from '../core'
import { LangchainConfig } from '../config'

@Injectable()
export class VectorStoreProvider {
  private readonly logger = new Logger(this.constructor.name)
  private vectorStores = new Map<
    string,
    TypeORMVectorStore | Promise<TypeORMVectorStore>
  >()

  constructor(@InjectDataSource() private readonly datasource: DataSource) {}

  async addDocuments(name: string, docs: Array<Document>) {
    const vectorStore = await this.getVectorStore(name)
    await vectorStore.addDocuments(docs)
  }

  async addTextDocument(
    name: string,
    pageContent: string,
    metadata: Record<string, any> = {},
  ) {
    await this.addDocuments(name, [
      new Document({
        pageContent,
        metadata: { ...metadata, type: 'text' },
      }),
    ])
  }

  async deleteDocuments(name: string, filter: Record<string, any> = {}) {
    const vectorStore = await this.getVectorStore(name)
    const query = `DELETE FROM ${vectorStore.tableName} WHERE metadata @> $1`
    await this.datasource.query(query, [filter])
  }

  async asRetriever(
    name: string,
    opt?: { k?: number; filter?: Record<string, any> },
  ) {
    const vectorStore = await this.getVectorStore(name)
    return vectorStore.asRetriever({ k: opt?.k, filter: opt?.filter })
  }

  async similaritySearch(
    name: string,
    query: string,
    filter: Record<string, any> = {},
    topN = 3,
  ) {
    const vectorStore = await this.getVectorStore(name)
    return vectorStore.similaritySearch(query, topN, filter)
  }

  private async getVectorStore(name: string): Promise<TypeORMVectorStore> {
    const existingStore = this.vectorStores.get(name)
    if (existingStore) {
      return existingStore instanceof Promise
        ? await existingStore
        : existingStore
    }

    const vectorStorePromise = (async () => {
      const vectorStore = await TypeORMVectorStore.fromDataSource(
        new OpenAIEmbeddings({
          modelName: LangchainConfig.EMBEDDING_MODEL,
          openAIApiKey: LangchainConfig.OPENAI_API_KEY,
          stripNewLines: true,
        }),
        {
          postgresConnectionOptions: postgresOptions,
          tableName: `vector_${name}_documents`,
        },
      )
      await vectorStore.ensureTableInDatabase()
      this.vectorStores.set(name, vectorStore)
      this.logger.log(`INIT VectorStore:: name:${name}`)
      return vectorStore
    })()
    this.vectorStores.set(name, vectorStorePromise)

    return await vectorStorePromise
  }
}
