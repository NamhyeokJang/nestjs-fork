import { ApiTags } from '@nestjs/swagger'
import { Body, Controller, Logger, Post } from '@nestjs/common'
import { CommonResponse } from '@slibs/common'
import {
  ApiKey,
  ApiKeyAuthorized,
  ApiKeyService,
  CreateApiKeyPayload,
} from '@slibs/api-key'
import { ApiSwagger } from '@slibs/swagger'
import { ApiKeyRule } from '../rule'
import { IApiKeyMeta } from '../interface'

@ApiTags('ApiKey')
@Controller({ path: 'api-key', version: '1' })
export class ApiKeyControllerV1 {
  private readonly logger = new Logger(this.constructor.name)

  constructor(private readonly apiKeyService: ApiKeyService<IApiKeyMeta>) {}

  @ApiKeyAuthorized(new ApiKeyRule())
  @ApiSwagger({ type: ApiKey, summary: `create api key` })
  @Post()
  async create(
    @Body() payload: CreateApiKeyPayload<IApiKeyMeta>,
  ): Promise<CommonResponse<ApiKey>> {
    const apiKey = await this.apiKeyService.create(payload)
    this.logger.log(`CREATE API-KEY::`)

    return CommonResponse.success({ data: apiKey })
  }
}
