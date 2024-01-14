import { ComponentLoader } from 'adminjs'
import * as path from 'path'
import { LocalPathUtils } from '@slibs/common'

const componentLoader = new ComponentLoader()
const basePath = LocalPathUtils.getPath(LocalPathUtils.ASSETS, 'adminjs')

function register(key: string, paths: Array<string>) {
  return componentLoader.add(key, path.join(basePath, ...paths))
}

const Components = {
  EDIT_ADMIN_PASSWORD: register('EDIT_ADMIN_PASSWORD', [
    'admin-user',
    'edit',
    'NewPassword.tsx',
  ]),
  SHOW_API_KEY_KEY: register('SHOW_API_KEY_KEY', [
    'api-key',
    'show',
    'Key.tsx',
  ]),
}

export { componentLoader, Components }
