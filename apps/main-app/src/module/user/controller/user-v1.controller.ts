import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiSwagger } from '@slibs/swagger'
import {
  ReqUser,
  User,
  USER_ROLE,
  UserRoleAuthorized,
  UserService,
  UserWithToken,
} from '@slibs/user'
import { CommonResponse } from '@slibs/common'
import { ClientAuthorized } from '@slibs/client-secret'
import { UserRoleRule } from '../rule'
import {
  CreateEmailVerifyCodePayload,
  LoginWithEmailPayload,
  SignUserWithEmailPayload,
} from '../dto'

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

  @UserRoleAuthorized(new UserRoleRule().setAcceptRole(USER_ROLE.ANONYMOUS))
  @Post('email-account/verify')
  @ApiSwagger({ summary: `Send Email For signup.` })
  async createEmailVerifyCode(
    @Body() body: CreateEmailVerifyCodePayload,
    @ReqUser() reqUser: User,
  ): Promise<CommonResponse<void>> {
    await this.userService.sendEmailForVerify(body.email, reqUser)
    return CommonResponse.success()
  }

  @UserRoleAuthorized(new UserRoleRule())
  @Post('email-account/sign')
  @ApiSwagger({ summary: `Sign up with email.` })
  async signWithEmail(
    @Body() body: SignUserWithEmailPayload,
    @ReqUser() reqUser: User,
  ): Promise<CommonResponse<void>> {
    await this.userService.signWithEmail(
      body.email,
      body.password,
      body.code,
      reqUser,
    )
    return CommonResponse.success()
  }

  @Post('email-account/login')
  @ApiSwagger({ type: UserWithToken, summary: `Login with email.` })
  async loginWithEmail(
    @Body() body: LoginWithEmailPayload,
  ): Promise<CommonResponse<UserWithToken>> {
    const res = await this.userService.loginWithEmail(body.email, body.password)
    return CommonResponse.success({ data: res })
  }

  @UserRoleAuthorized(new UserRoleRule())
  @Get('self')
  @ApiSwagger({ type: User, summary: `Get User info self.` })
  async getSelf(@ReqUser() reqUser: User): Promise<CommonResponse<User>> {
    return CommonResponse.success({ data: reqUser })
  }
}
