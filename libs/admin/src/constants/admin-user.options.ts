import { CryptoUtils } from '@slibs/common'
import { IAdminJSResource } from '../interface'
import { AdminUser } from '../entities'
import { ADMIN_ROLE, ADMIN_SIDE } from '../constants'
import { checkRole } from '../utils'
import { registerComponents } from '../components'

export const AdminUserOptions: IAdminJSResource = {
  order: 1,
  option: {
    resource: AdminUser,
    options: {
      navigation: ADMIN_SIDE.ADMIN_USER,
      listProperties: ['id', 'name', 'email', 'role', 'loggedAt'],
      showProperties: ['id', 'name', 'email', 'role', 'loggedAt'],
      filterProperties: ['id', 'email', 'name', 'role'],
      editProperties: ['name', 'email', 'role', 'newPassword'],
      properties: {
        newPassword: {
          components: {
            edit: registerComponents(
              'EDIT_ADMIN_PASSWORD',
              'admin-user/edit/NewPassword.tsx',
            ),
          },
        },
      },
      sort: {
        direction: 'desc',
        sortBy: 'id',
      },
      actions: {
        new: {
          isAccessible: checkRole(ADMIN_ROLE.MASTER),
          isVisible: checkRole(ADMIN_ROLE.MASTER),
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
          isAccessible: checkRole(ADMIN_ROLE.MASTER),
          isVisible: checkRole(ADMIN_ROLE.MASTER),
          before: [
            async (request, _context) => {
              if (request.method === 'get') return request
              // if new password, hashed password
              if (request?.payload?.['newPassword']) {
                request.payload.password = await CryptoUtils.genSaltedStr(
                  request.payload['newPassword'],
                )
                delete request.payload['newPassword']
              }

              return request
            },
          ],
        },
        delete: {
          isAccessible: checkRole(ADMIN_ROLE.MASTER),
          isVisible: checkRole(ADMIN_ROLE.MASTER),
        },
      },
    },
  },
}
