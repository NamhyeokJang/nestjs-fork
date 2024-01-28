export interface IEmbeddingJob {
  fileId: number
  mimeType: string
  owner: string // owner uniq key
  project: string // embedding project name
  metadata?: Record<string, any>
}

export interface IRemoveEmbeddedJob {
  fileId: number
  project: string
}
