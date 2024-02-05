import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { ClientSecretConfig } from '../config'
import { ClientSecretGuard } from '../guard'

export const ClientAuthorized = (): ((...args: any) => void) => {
  return applyDecorators(
    ApiHeader({
      name: ClientSecretConfig.HEADER,
      required: true,
      description: 'client secret key',
    }),
    UseGuards(ClientSecretGuard),
  )
}
