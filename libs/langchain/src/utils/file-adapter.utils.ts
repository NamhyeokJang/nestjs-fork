import { MemoryStoredFile } from 'nestjs-form-data'
import { AssertUtils, CommonException, CommonResponseCode } from '@slibs/common'
import { EMBEDDING_FILE_TYPE } from '../constants'

export interface IAdaptedFile {
  filename: string
  buffer: Buffer
  mimeType: string
}

export class FileAdapterUtils {
  static to(file: any): IAdaptedFile {
    if (file instanceof MemoryStoredFile) {
      return {
        buffer: file.buffer,
        mimeType: file.mimeType,
        filename: file.originalName,
      }
    }

    throw new CommonException(
      CommonResponseCode.BAD_REQUEST,
      `Invalid File ${file.constructor.name}`,
    )
  }

  static checkFileType(adapted: IAdaptedFile) {
    AssertUtils.ensure(
      Object.values(EMBEDDING_FILE_TYPE).includes(adapted.mimeType as any),
      CommonResponseCode.BAD_REQUEST,
      `${adapted.mimeType} type is not supported mimetype`,
    )
  }
}
