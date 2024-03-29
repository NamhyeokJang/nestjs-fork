import {
  ADMIN_ROLE,
  ADMIN_SIDE,
  checkRole,
  IAdminJSResource,
} from '@slibs/admin'
import { ApiKey } from '@slibs/api-key'
import { registerComponents } from '@slibs/admin'
import { DayUtils, UUIDUtils } from '@slibs/common'

export const ApiKeyAdminOptions: IAdminJSResource = {
  order: 2,
  option: {
    resource: ApiKey,
    options: {
      navigation: ADMIN_SIDE.API_KEY,
      listProperties: ['createdAt', 'updatedAt', 'key', 'name', 'expiredAt'],
      showProperties: [
        'createdAt',
        'updatedAt',
        'key',
        'name',
        'expiredAt',
        'lastAccessedAt',
      ],
      filterProperties: ['key', 'expiredAt'],
      editProperties: ['name', 'expiredAt'],
      properties: {
        key: {
          components: {
            list: registerComponents(
              'SHOW_API_KEY_KEY',
              'api-key/show/Key.tsx',
            ),
            show: registerComponents(
              'SHOW_API_KEY_KEY',
              'api-key/show/Key.tsx',
            ),
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
