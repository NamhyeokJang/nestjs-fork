import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1706095113723 implements MigrationInterface {
    name = 'Migration1706095113723'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "api_key" (
                "createdAt" TIMESTAMP NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL,
                "key" uuid NOT NULL,
                "name" character varying,
                "expiredAt" TIMESTAMP,
                "lastAccessedAt" TIMESTAMP,
                "meta" jsonb NOT NULL DEFAULT '{}',
                CONSTRAINT "PK_fb080786c16de6ace7ed0b69f7d" PRIMARY KEY ("key")
            );
            COMMENT ON COLUMN "api_key"."createdAt" IS '생성시각';
            COMMENT ON COLUMN "api_key"."updatedAt" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "api_key"."key" IS 'unique key';
            COMMENT ON COLUMN "api_key"."name" IS 'name';
            COMMENT ON COLUMN "api_key"."expiredAt" IS 'expired at';
            COMMENT ON COLUMN "api_key"."lastAccessedAt" IS 'last accessed at';
            COMMENT ON COLUMN "api_key"."meta" IS 'meta data'
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."admin_user_role_enum" AS ENUM('MANAGER', 'ADMIN', 'MASTER')
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_user" (
                "createdAt" TIMESTAMP NOT NULL,
                "updatedAt" TIMESTAMP NOT NULL,
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                "role" "public"."admin_user_role_enum" NOT NULL DEFAULT 'MANAGER',
                "loggedAt" TIMESTAMP,
                CONSTRAINT "UQ_840ac5cd67be99efa5cd989bf9f" UNIQUE ("email"),
                CONSTRAINT "PK_a28028ba709cd7e5053a86857b4" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "admin_user"."createdAt" IS '생성시각';
            COMMENT ON COLUMN "admin_user"."updatedAt" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "admin_user"."id" IS '일련번호';
            COMMENT ON COLUMN "admin_user"."email" IS 'email';
            COMMENT ON COLUMN "admin_user"."password" IS 'password';
            COMMENT ON COLUMN "admin_user"."name" IS 'name';
            COMMENT ON COLUMN "admin_user"."role" IS 'role';
            COMMENT ON COLUMN "admin_user"."loggedAt" IS 'last logged at'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "admin_user"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."admin_user_role_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "api_key"
        `);
    }

}
