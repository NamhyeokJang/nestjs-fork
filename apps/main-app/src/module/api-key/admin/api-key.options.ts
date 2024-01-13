import {
  ADMIN_ROLE,
  ADMIN_SIDE,
  checkRole,
  IAdminJSResource,
} from '@slibs/admin'
import { ApiKey } from '@slibs/api-key'
import { Components } from '@slibs/admin/components'

export const ApiKeyOptions: IAdminJSResource = {
  order: 2,
  resource: ApiKey,
  options: {
    navigation: ADMIN_SIDE.API_KEY,
    listProperties: ['key', 'expiredAt'],
    filterProperties: ['key'],
    properties: {
      key: {
        components: {
          list: Components.SHOW_API_KEY_KEY,
          show: Components.SHOW_API_KEY_KEY,
        },
      },
    },
    actions: {
      new: {
        isAccessible: checkRole(ADMIN_ROLE.ADMIN),
        isVisible: checkRole(ADMIN_ROLE.ADMIN),
      },
      list: {
        isAccessible: checkRole(ADMIN_ROLE.ADMIN),
        isVisible: checkRole(ADMIN_ROLE.ADMIN),
      },
      show: {
        isAccessible: checkRole(ADMIN_ROLE.ADMIN),
        isVisible: checkRole(ADMIN_ROLE.ADMIN),
      },
      edit: {
        isAccessible: checkRole(ADMIN_ROLE.ADMIN),
        isVisible: checkRole(ADMIN_ROLE.ADMIN),
      },
      delete: {
        isAccessible: checkRole(ADMIN_ROLE.ADMIN),
        isVisible: checkRole(ADMIN_ROLE.ADMIN),
      },
    },
  },
}
