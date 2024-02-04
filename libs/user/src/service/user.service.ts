import { Injectable, Logger } from '@nestjs/common'
import { JWTUtils } from '@slibs/common'
import { UserProvider, EmailAccountProvider } from '../provider'
import { UserConfig } from '../config'
import { UserWithToken } from '../dto'

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name)

  constructor(
    private readonly userProvider: UserProvider,
    private readonly emailAccountProvider: EmailAccountProvider,
  ) {}

  async createAnonymous(): Promise<UserWithToken> {
    const anon = await this.userProvider.createAnonymous()
    const token = await this.sign(anon.id)

    this.logger.log(`CREATE ANONYMOUS USER:: id:${anon.id}`)

    return new UserWithToken(anon, token)
  }

  async sign(id: number) {
    return JWTUtils.sign(
      { id },
      {
        secret: UserConfig.JWT_SECRET,
        expiresIn: UserConfig.JWT_EXPIRED_IN_SECOND,
      },
    )
  }

  async verify(token: string) {
    return JWTUtils.verify<{ id: number; iat: number; exp: number }>(
      token,
      UserConfig.JWT_SECRET,
    )
  }
}
