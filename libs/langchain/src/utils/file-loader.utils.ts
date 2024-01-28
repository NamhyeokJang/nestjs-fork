import { CommonException, CommonResponseCode } from '@slibs/common'
import { EMBEDDING_FILE_TYPE } from '../constants'
import {
  CSVLoader,
  DocxLoader,
  PDFLoader,
  PPTXLoader,
  TextLoader,
  BaseDocumentLoader,
} from '../core'

export function getFileLoader(
  buffer: Buffer,
  mimeType: string,
): BaseDocumentLoader {
  const blob = new Blob([buffer], { type: mimeType })
  switch (mimeType) {
    case EMBEDDING_FILE_TYPE.MARKDOWN:
    case EMBEDDING_FILE_TYPE.TEXT:
      return new TextLoader(blob)
    case EMBEDDING_FILE_TYPE.CSV:
      return new CSVLoader(blob)
    case EMBEDDING_FILE_TYPE.PDF:
      return new PDFLoader(blob)
    case EMBEDDING_FILE_TYPE.DOCX:
      return new DocxLoader(blob)
    case EMBEDDING_FILE_TYPE.PPTX:
      return new PPTXLoader(blob)
  }

  throw new CommonException(
    CommonResponseCode.BAD_REQUEST,
    `${mimeType}::loader is not supported`,
  )
}
