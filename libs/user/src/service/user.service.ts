import { Injectable, Logger } from '@nestjs/common'
import {
  AssertUtils,
  CommonResponseCode,
  DayUtils,
  JWTUtils,
} from '@slibs/common'
import { Transactional } from 'typeorm-transactional'
import {
  EmailAccountProvider,
  UserEmailVerifyProvider,
  UserProvider,
} from '../provider'
import { UserConfig } from '../config'
import { USER_ROLE } from '../constants'
import { UserWithToken } from '../dto'
import { User } from '../entities'

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly userProvider: UserProvider,
    private readonly emailAccountProvider: EmailAccountProvider,
    private readonly emailVerifyProvider: UserEmailVerifyProvider,
  ) {}

  async findUserById(id: number) {
    return this.userProvider.findOne(id)
  }

  async createAnonymous(): Promise<UserWithToken> {
    const anon = await this.userProvider.createAnonymous()
    const token = await this.signToken(anon.id)

    this.logger.log(`CREATE ANONYMOUS USER:: id:${anon.id}`)

    return new UserWithToken(anon, token)
  }

  async sendEmailForVerify(email: string, user: User) {
    return await this.emailVerifyProvider.createVerify(email, user)
  }

  @Transactional()
  async signWithEmail(
    email: string,
    password: string,
    code: string,
    user: User,
  ) {
    const verifyCode = await this.emailVerifyProvider.findOne(email, user)

    AssertUtils.ensure(
      verifyCode &&
        DayUtils.isAfterNow(verifyCode.expiredAt) &&
        verifyCode.code === code,
      CommonResponseCode.BAD_REQUEST,
      'Invalid code',
    )

    await this.emailVerifyProvider.updateVerifyAt(verifyCode)
    await this.emailAccountProvider.create(email, password, user)
    await this.userProvider.updateRole(user, USER_ROLE.USER)
  }

  async loginWithEmail(
    email: string,
    password: string,
  ): Promise<UserWithToken> {
    const emailAccount = await this.emailAccountProvider.getByEmail(email)

    AssertUtils.ensure(
      await this.emailAccountProvider.checkPassword(emailAccount, password),
      CommonResponseCode.BAD_REQUEST,
      `Invalid login info`,
    )

    await this.emailAccountProvider.updateLoggedAt(emailAccount)

    const user = emailAccount.user
    const token = await this.signToken(user.id)

    return new UserWithToken(user, token)
  }

  async signToken(id: number) {
    return JWTUtils.sign(
      { id },
      {
        secret: UserConfig.JWT_SECRET,
        expiresIn: UserConfig.JWT_EXPIRED_IN_SECOND,
      },
    )
  }

  async verifyToken(token: string) {
    return JWTUtils.verify<{ id: number; iat: number; exp: number }>(
      token,
      UserConfig.JWT_SECRET,
    )
  }
}
