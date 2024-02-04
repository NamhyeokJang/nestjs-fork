import { ApiProperty } from '@nestjs/swagger'
import { User } from '../entities'

export class UserWithToken {
  constructor(user: User, token: string) {
    this.user = user
    this.token = token
  }

  @ApiProperty({ type: User, description: 'user info' })
  user: User

  @ApiProperty({ example: 'secret', description: 'bearer token' })
  token: string
}
