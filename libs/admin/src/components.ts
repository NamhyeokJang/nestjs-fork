import { ComponentLoader } from 'adminjs'
import * as path from 'path'
import * as process from 'process'

const componentLoader = new ComponentLoader()
const basePath = path.join(process.cwd(), 'assets', 'adminjs')

function register(key: string, paths: Array<string>) {
  return componentLoader.add(key, path.join(basePath, ...paths))
}

const Components = {
  EDIT_ADMIN_PASSWORD: register('EDIT_ADMIN_PASSWORD', [
    'admin-user',
    'edit',
    'NewPassword.tsx',
  ]),
}

export { componentLoader, Components }
