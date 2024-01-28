import { ISaveFile, IUploadFile } from '../interface'
import { OnModuleInit } from '@nestjs/common'

export abstract class BaseStorageProvider implements OnModuleInit {
  async onModuleInit() {
    await this.ensureConfig()
  }

  abstract get type(): string

  abstract get(dirname: string, key: string): Promise<Buffer>

  abstract save(file: IUploadFile, dirname: string): Promise<ISaveFile>
  abstract delete(dirname: string, key: string): Promise<void>

  abstract ensureConfig(): void | Promise<void>
}
