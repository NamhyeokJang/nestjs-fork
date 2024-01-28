import { Inject, Injectable } from '@nestjs/common'
import {
  STORAGE_DIRECTORY_CONTEXT,
  STORAGE_SERVICE_CONTEXT,
} from '../constants'
import { BaseStorageProvider } from '../provider'
import { IUploadFile } from '../interface'

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_DIRECTORY_CONTEXT) private readonly dirname: string,
    @Inject(STORAGE_SERVICE_CONTEXT)
    private readonly service: BaseStorageProvider,
  ) {}

  get type() {
    return this.service.type
  }

  async get(key: string) {
    return this.service.get(this.dirname, key)
  }

  async save(file: IUploadFile) {
    return this.service.save(file, this.dirname)
  }

  async delete(key: string) {
    return this.service.delete(this.dirname, key)
  }
}
