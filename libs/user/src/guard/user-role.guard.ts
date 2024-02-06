import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import {
  AssertUtils,
  CommonResponseCode,
  DayUtils,
  IAuthRequest,
} from '@slibs/common'
import { IUserRoleRule } from '../interface'
import { UserService } from '../service'

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<IAuthRequest>()

    const rule = this.reflector.get<IUserRoleRule>(
      'userRoleRule',
      context.getHandler(),
    )

    const authorization = request.get('Authorization')
    AssertUtils.ensure(
      authorization && authorization.split(' ').length === 2,
      CommonResponseCode.UNAUTHORIZED,
    )

    const [key, token] = authorization.split(' ')
    AssertUtils.ensure(key === 'Bearer', CommonResponseCode.UNAUTHORIZED)

    const parsed = await this.userService.verifyToken(token).catch(() => null)
    AssertUtils.ensure(parsed, CommonResponseCode.UNAUTHORIZED)
    AssertUtils.ensure(
      DayUtils.isAfterNow(DayUtils.getDay(parsed.exp * 1000).toDate()),
      CommonResponseCode.UNAUTHORIZED,
    )

    const user = await this.userService
      .findUserById(parsed.id)
      .catch(() => null)
    AssertUtils.ensure(user, CommonResponseCode.NOT_FOUND)
    AssertUtils.ensure(await rule.check(user), CommonResponseCode.UNAUTHORIZED)

    request.authType = 'user-role'
    request.user = user
    request.isAuthorized = true

    return request.isAuthorized
  }
}
