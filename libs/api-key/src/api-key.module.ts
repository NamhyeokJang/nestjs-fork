import { DynamicModule, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApiKey } from './entities'
import { ApiKeyRepository } from './repository'
import { ApiKeyService } from './service'
import { ApiKeyGuard } from './guard'

@Module({})
export class ApiKeyModule {
  static forRoot(): DynamicModule {
    return {
      module: ApiKeyModule,
      imports: [TypeOrmModule.forFeature([ApiKey])],
      providers: [ApiKeyRepository, ApiKeyService, ApiKeyGuard],
      exports: [ApiKeyService],
    }
  }
}
