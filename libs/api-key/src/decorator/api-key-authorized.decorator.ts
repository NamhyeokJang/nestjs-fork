import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { ApiKeyGuard } from '../guard'
import { IApiKeyRule } from '../interface'

export const ApiKeyAuthorized = (
  rule: IApiKeyRule,
): ((...args: any) => void) => {
  return applyDecorators(
    ApiHeader({ name: 'x-api-key', description: 'api-key' }),
    SetMetadata('apiKeyRule', rule),
    UseGuards(ApiKeyGuard),
  )
}
