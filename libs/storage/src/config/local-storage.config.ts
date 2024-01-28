import { get } from 'env-var'

export class LocalStorageConfig {
  static readonly PATH = get('STORAGE_LOCAL_PATH').asString()
}
