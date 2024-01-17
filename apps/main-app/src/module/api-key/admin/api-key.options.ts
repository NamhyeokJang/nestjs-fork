import {
  ADMIN_ROLE,
  ADMIN_SIDE,
  checkRole,
  IAdminJSResource,
} from '@slibs/admin'
import { ApiKey } from '@slibs/api-key'
import { Components } from '@slibs/admin/components'
import { DayUtils, UUIDUtils } from '@slibs/common'

export const ApiKeyOptions: IAdminJSResource = {
  order: 2,
  option: {
    resource: ApiKey,
    options: {
      navigation: ADMIN_SIDE.API_KEY,
      listProperties: ['createdAt', 'updatedAt', 'key', 'expiredAt'],
      showProperties: ['createdAt', 'updatedAt', 'key', 'expiredAt'],
      filterProperties: ['key', 'expiredAt'],
      editProperties: ['expiredAt'],
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
          before: [
            (request, _context) => {
              if (request.method === 'get') return request

              const now = DayUtils.getNowDate()
              request.payload = {
                key: UUIDUtils.v4(),
                createdAt: now,
                updatedAt: now,
                ...request.payload,
              }

              return request
            },
          ],
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
          before: [
            (request, _context) => {
              if (request.method === 'get') return request

              request.payload = {
                ...request.payload,
                updatedAt: DayUtils.getNowDate(),
              }

              return request
            },
          ],
        },
        delete: {
          isAccessible: checkRole(ADMIN_ROLE.ADMIN),
          isVisible: checkRole(ADMIN_ROLE.ADMIN),
        },
      },
    },
  },
}
