export interface IUploadFile {
  filename: string
  buffer: Buffer
}

export interface ISaveFile {
  type: 'local'
  key: string
}
