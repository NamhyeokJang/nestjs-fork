import * as path from 'path'
import * as process from 'process'

export class LocalPathUtils {
  static PATH = path.join(process.cwd())

  static ASSETS = path.join(LocalPathUtils.PATH, 'assets')

  static getPath(...p: string[]) {
    return path.join(...p)
  }
}
