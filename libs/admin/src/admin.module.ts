import { DynamicModule, MiddlewareConsumer, Module } from '@nestjs/common'
import AdminJS, { Locale } from 'adminjs'
import session from 'express-session'
import Connect from 'connect-pg-simple'
import { sortBy } from 'lodash'
import { DataSource } from 'typeorm'
import { Database, Resource } from '@adminjs/typeorm'
import { AdminModule as AdminJSModule } from '@adminjs/nestjs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CryptoUtils, DayUtils, UUIDUtils } from '@slibs/common'
import { DatabaseModule } from '@slibs/database'
import { AdminConfig } from './config'
import { AdminUserAdminOptions } from './constants'
import { IAdmin, IAdminJSResource } from './interface'
import { AdminUser } from './entities'
import { componentLoader } from './components'

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
  static options = new Map<string, IAdminJSResource>()
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

  static forFeature(resources: Array<IAdminJSResource>) {
    resources.forEach(r => this.options.set(UUIDUtils.v4(), r))
    return this
  }

  static forRoot(config?: { locale?: Locale }): DynamicModule {
    this.options.set(UUIDUtils.v4(), AdminUserAdminOptions)
    return {
      global: true,
      module: AdminModule,
      imports: [
        TypeOrmModule.forFeature([AdminUser]),
        AdminJSModule.createAdminAsync({
          imports: [DatabaseModule],
          inject: [DataSource],
          useFactory: (datasource: DataSource) => ({
            adminJsOptions: {
              rootPath: '/admin',
              resources: sortBy([...this.options.values()], 'order').map(
                o => o.option,
              ),
              componentLoader: componentLoader,
              locale: config?.locale,
            },
            auth: {
              authenticate: async (
                email: string,
                password: string,
              ): Promise<IAdmin | null> => {
                const repo = datasource.getRepository(AdminUser)
                const admin = await repo.findOneBy({ email })
                if (!admin) return null
                const check = await CryptoUtils.compareSalted(
                  password,
                  admin.password,
                )
                if (!check) {
                  return null
                }

                // register admin logged
                admin.loggedAt = DayUtils.getNowDate()
                await admin.save({ reload: false })

                return admin.toAdmin()
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
