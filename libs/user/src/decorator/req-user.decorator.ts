import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { IAuthRequest } from '@slibs/common'

export const ReqUser: () => any = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IAuthRequest>()
    return request.user
  },
)
