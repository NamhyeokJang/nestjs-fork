import { ApiTags } from '@nestjs/swagger'
import { Controller, Post } from '@nestjs/common'
import { ApiSwagger } from '@slibs/swagger'
import { UserService, UserWithToken } from '@slibs/user'
import { CommonResponse } from '@slibs/common'
import { ClientAuthorized } from '@slibs/client-secret'

@ApiTags('User')
@Controller({ version: '1', path: 'users' })
export class UserV1Controller {
  constructor(private readonly userService: UserService) {}

  @ClientAuthorized()
  @Post('anonymous')
  @ApiSwagger({ type: UserWithToken, summary: `Create Anonymous User.` })
  async createAnonymous() {
    const res = await this.userService.createAnonymous()
    return CommonResponse.success({ data: res })
  }
}
