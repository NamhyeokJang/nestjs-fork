import { applyDecorators, Type } from '@nestjs/common'
import { isArray } from 'lodash'
import {
  ApiExtraModels,
  ApiResponse,
  getSchemaPath,
  ApiQueryOptions,
  ApiQuery,
  ApiOperation,
} from '@nestjs/swagger'
import { CommonResponse, PaginationResponse } from '@slibs/common'

export const ApiSwagger = <TModel extends Type<unknown>>(opt: {
  type?: TModel | [TModel]
  summary: string
  queries?: ApiQueryOptions[]
}) => {
  if (!opt.type) {
    return applyDecorators(
      ApiOperation({ summary: opt.summary }),
      ApiResponse({ type: opt.type }),
      ...(opt.queries ?? []).map(q => ApiQuery(q)),
    )
  }

  const model = isArray(opt.type) ? opt.type[0] : opt.type
  let properties = {}

  if (isArray(opt.type)) {
    properties = {
      data: { type: 'array', items: { $ref: getSchemaPath(model) } },
    }
  } else {
    properties = {
      data: { $ref: getSchemaPath(model) },
    }
  }

  return applyDecorators(
    ApiExtraModels(
      isArray(opt.type) ? PaginationResponse : CommonResponse,
      model,
    ),
    ApiOperation({ summary: opt.summary }),
    ApiResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(
              isArray(opt.type) ? PaginationResponse : CommonResponse,
            ),
          },
          { properties },
        ],
      },
    }),
    ...(opt.queries ?? []).map(q => ApiQuery(q)),
  )
}
