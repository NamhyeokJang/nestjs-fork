import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { IUserRoleRule } from '../interface'
import { UserRoleGuard } from '../guard'

export const UserRoleAuthorized = (
  rule: IUserRoleRule,
): ((...args: any) => void) => {
  return applyDecorators(
    ApiBearerAuth(),
    SetMetadata('userRoleRule', rule),
    UseGuards(UserRoleGuard),
  )
}
