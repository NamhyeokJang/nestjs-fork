import { get } from 'env-var'

export class SwaggerConfig {
  static readonly ENABLED = get('SWAGGER_ENABLED').default('false').asBool()
  static readonly PATH = get('SWAGGER_PATH').default('doc').asString()
  static readonly TITLE = get('SWAGGER_TITLE')
    .default('Swagger Title')
    .asString()
  static readonly DESCRIPTION = get('SWAGGER_DESCRIPTION')
    .default('Swagger Description')
    .asString()
  static readonly VERSION = get('SWAGGER_VERSION').default('0.0.0.0').asString()
}
