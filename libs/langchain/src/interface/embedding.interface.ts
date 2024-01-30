export interface IEmbeddingJob {
  fileId: number
  mimeType: string
  owner: string // owner uniq key
  metadata?: Record<string, any>
}

export interface IRemoveEmbeddedJob {
  fileId: number
  owner: string
}
