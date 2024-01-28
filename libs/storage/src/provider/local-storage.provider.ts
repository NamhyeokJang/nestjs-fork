import { Injectable } from '@nestjs/common'
import { LocalPathUtils, UUIDUtils } from '@slibs/common'
import { BaseStorageProvider } from './base-storage.provider'
import { ensureDir, readFile, writeFile } from 'fs-extra'
import { ISaveFile, IUploadFile } from '../interface'
import { LocalStorageConfig } from '../config'

@Injectable()
export class LocalStorageProvider extends BaseStorageProvider {
  get type() {
    return 'local'
  }
  async get(dirname: string, key: string) {
    const { getPath } = LocalPathUtils
    return readFile(getPath(LocalStorageConfig.PATH!, dirname, key))
  }

  async save(file: IUploadFile, dirname: string): Promise<ISaveFile> {
    const { getPath } = LocalPathUtils
    const p = getPath(LocalStorageConfig.PATH!, dirname)
    await ensureDir(p)

    const uuid = UUIDUtils.v4()
    await writeFile(getPath(p, uuid), file.buffer)
    return { type: 'local', key: uuid }
  }

  async delete(dirname: string, key: string) {
    //
  }

  ensureConfig() {
    const config = LocalStorageConfig
    if (!config.PATH) {
      throw new Error(`STORAGE_LOCAL_PATH required!`)
    }
  }
}
