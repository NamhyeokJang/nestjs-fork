import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AssertUtils, CommonResponseCode, DayUtils } from '@slibs/common'
import { ApiKeyService } from '../service'
import { IApiKeyRule } from '../interface'

@Injectable()
export class ApiKeyGuard<META extends object> implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly service: ApiKeyService<META>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const rule = this.reflector.get<IApiKeyRule>(
      'apiKeyRule',
      context.getHandler(),
    )

    const key = request.get('x-api-key')
    AssertUtils.ensure(key, CommonResponseCode.UNAUTHORIZED)

    const apiKey = await this.service.getByKey(key).catch(() => null)
    AssertUtils.ensure(apiKey, CommonResponseCode.ACCESS_DENIED)

    const now = DayUtils.getNow()
    AssertUtils.ensure(
      !apiKey.expiredAt || DayUtils.getDay(apiKey.expiredAt).isAfter(now),
      CommonResponseCode.ACCESS_DENIED,
    )
    AssertUtils.ensure(
      await rule.check(apiKey),
      CommonResponseCode.ACCESS_DENIED,
    )

    return true
  }
}
