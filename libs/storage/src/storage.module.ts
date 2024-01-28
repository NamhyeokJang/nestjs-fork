import { DynamicModule, Module, Provider } from '@nestjs/common'
import { LocalStorageProvider } from './provider'
import { STORAGE_DIRECTORY_CONTEXT, STORAGE_SERVICE_CONTEXT } from './constants'
import { StorageService } from './service'

type StorageType = 'local'

@Module({})
export class StorageModule {
  static forFeature(type: StorageType, dirname: string): DynamicModule {
    const providers: Array<Provider> = [
      { provide: STORAGE_DIRECTORY_CONTEXT, useValue: dirname },
      StorageService,
    ]
    switch (type) {
      case 'local':
        providers.push({
          provide: STORAGE_SERVICE_CONTEXT,
          useClass: LocalStorageProvider,
        })
    }

    return {
      module: StorageModule,
      providers,
      exports: [StorageService],
    }
  }
}
