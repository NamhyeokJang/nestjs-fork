import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { AssertUtils, CommonResponseCode } from '@slibs/common'
import { ClientSecretConfig } from '../config'

@Injectable()
export class ClientSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const key = request.get(ClientSecretConfig.HEADER)

    AssertUtils.ensure(
      key && key === ClientSecretConfig.SECRET,
      CommonResponseCode.UNAUTHORIZED,
    )

    return true
  }
}
