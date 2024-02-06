import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString } from 'class-validator'

export class CreateEmailVerifyCodePayload {
  @ApiProperty({ example: 'sample@example.com', description: 'email' })
  @IsEmail()
  email: string
}

export class SignUserWithEmailPayload {
  @ApiProperty({ example: 'sample@example.com', description: 'email' })
  @IsEmail()
  email: string

  @ApiProperty({ example: `password`, description: `password` })
  @IsString()
  password: string

  @ApiProperty({ example: 'verify code', description: 'verify code' })
  @IsString()
  code: string
}

export class LoginWithEmailPayload {
  @ApiProperty({ example: `sample@example.com`, description: 'email' })
  @IsEmail()
  email: string

  @ApiProperty({ example: 'password', description: 'password' })
  @IsString()
  password: string
}
