import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common'
import { Observable, tap } from 'rxjs'
import { Request } from 'express'

@Injectable()
export class RouterLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name)

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const rType = context.getType<string>()
    const request = context.switchToHttp().getRequest<Request>()
    const st = new Date().getTime()

    if (rType === 'graphql') {
      return next.handle()
    }

    return next.handle().pipe(
      tap(() => {
        if (request.path === '/health-check') {
          return
        }

        if (request.path === '/favicon.ico') {
          return
        }

        const et = new Date().getTime()
        const message: string =
          `Method: ${request.method}; ` +
          `Path: ${request.path}; ` +
          `Time: ${et - st}ms;`

        this.logger.log(message)
      }),
    )
  }
}
