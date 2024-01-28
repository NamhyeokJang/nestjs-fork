export enum EMBEDDING_FILE_TYPE {
  MARKDOWN = 'text/markdown',
  TEXT = 'text/plain',
  CSV = 'text/csv',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  PDF = 'application/pdf',
}

export enum EMBEDDING_FILE_STATUS {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  DELETING = 'DELETING',
  DELETED = 'DELETED',
}
