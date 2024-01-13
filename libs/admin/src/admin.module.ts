import { DynamicModule, MiddlewareConsumer, Module } from '@nestjs/common'
import AdminJS, { CurrentAdmin } from 'adminjs'
import session from 'express-session'
import Connect from 'connect-pg-simple'
import { Database, Resource } from '@adminjs/typeorm'
import { AdminModule as AdminJSModule } from '@adminjs/nestjs'
import { AdminConfig } from './config'

AdminJS.registerAdapter({ Database, Resource })
const ConnectSession = Connect(session)
const sessionStore = new ConnectSession({
  conObject: {
    connectionString: AdminConfig.SESSION_CONNECT_STRING,
  },
  tableName: 'admin_session',
})

@Module({})
export class AdminModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(
        session({
          store: sessionStore,
          resave: false,
          saveUninitialized: false,
          name: AdminConfig.COOKIE_NAME,
          secret: AdminConfig.COOKIE_PASSWORD,
        }),
      )
      .forRoutes('admin')
  }

  static forRoot(): DynamicModule {
    return {
      module: AdminModule,
      imports: [
        AdminJSModule.createAdminAsync({
          useFactory: () => ({
            adminJsOptions: {
              rootPath: '/admin',
              resources: [],
            },
            auth: {
              authenticate: async (email: string, password: string) => {
                return {
                  email,
                  title: password,
                  id: 1,
                } as unknown as CurrentAdmin
              },
              cookieName: AdminConfig.COOKIE_NAME,
              cookiePassword: AdminConfig.COOKIE_PASSWORD,
            },
            sessionOptions: {
              store: sessionStore,
              secret: AdminConfig.COOKIE_PASSWORD,
              resave: false,
              saveUninitialized: false,
            },
          }),
        }),
      ],
    }
  }
}
