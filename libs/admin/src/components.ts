import { ComponentLoader } from 'adminjs'
import * as path from 'path'
import { LocalPathUtils } from '@slibs/common'

const componentLoader = new ComponentLoader()
const basePath = LocalPathUtils.getPath(LocalPathUtils.ASSETS, 'adminjs')

function registerComponents(key: string, p: string) {
  return componentLoader.add(key, path.join(basePath, p))
}

export { componentLoader, registerComponents }
