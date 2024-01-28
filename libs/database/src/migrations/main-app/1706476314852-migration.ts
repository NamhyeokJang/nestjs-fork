import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1706476314852 implements MigrationInterface {
    name = 'Migration1706476314852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "open_ai_usage" (
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "id" SERIAL NOT NULL,
                "key" character varying(40) NOT NULL,
                "date" character varying(10) NOT NULL,
                "model" character varying(40) NOT NULL,
                "prompt_tokens" integer NOT NULL DEFAULT '0',
                "completion_tokens" integer NOT NULL DEFAULT '0',
                "total_tokens" integer NOT NULL DEFAULT '0',
                CONSTRAINT "PK_bf7163fc8c292141921f3e4df4c" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "open_ai_usage"."created_at" IS '생성시각';
            COMMENT ON COLUMN "open_ai_usage"."updated_at" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "open_ai_usage"."id" IS '일련번호';
            COMMENT ON COLUMN "open_ai_usage"."key" IS 'uniq';
            COMMENT ON COLUMN "open_ai_usage"."date" IS 'YYYY-MM-DD (KST)';
            COMMENT ON COLUMN "open_ai_usage"."model" IS 'model name';
            COMMENT ON COLUMN "open_ai_usage"."prompt_tokens" IS 'prompt tokens';
            COMMENT ON COLUMN "open_ai_usage"."completion_tokens" IS 'completion tokens';
            COMMENT ON COLUMN "open_ai_usage"."total_tokens" IS 'total tokens'
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "OPENAI_USAGE_UNIQUE" ON "open_ai_usage" ("key", "date", "model")
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."embedding_file_status_enum" AS ENUM(
                'PENDING',
                'IN_PROGRESS',
                'COMPLETED',
                'FAILED',
                'DELETING',
                'DELETED'
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "embedding_file" (
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "id" SERIAL NOT NULL,
                "key" uuid NOT NULL,
                "filename" character varying NOT NULL,
                "status" "public"."embedding_file_status_enum" NOT NULL DEFAULT 'PENDING',
                "owner" character varying(20) NOT NULL,
                "metadata" jsonb NOT NULL DEFAULT '{}',
                CONSTRAINT "PK_7e57392ae0d4726607bab791456" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "embedding_file"."created_at" IS '생성시각';
            COMMENT ON COLUMN "embedding_file"."updated_at" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "embedding_file"."id" IS '일련번호';
            COMMENT ON COLUMN "embedding_file"."key" IS 'uuid v4';
            COMMENT ON COLUMN "embedding_file"."filename" IS 'filename';
            COMMENT ON COLUMN "embedding_file"."status" IS 'embedding status';
            COMMENT ON COLUMN "embedding_file"."owner" IS 'owner uniq key';
            COMMENT ON COLUMN "embedding_file"."metadata" IS 'metadata'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_58ec73bca3f5821907576bc66f" ON "embedding_file" ("owner")
        `);
        await queryRunner.query(`
            CREATE TABLE "api_key" (
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "key" uuid NOT NULL,
                "name" character varying,
                "expired_at" TIMESTAMP,
                "last_accessed_at" TIMESTAMP,
                "meta" jsonb NOT NULL DEFAULT '{}',
                CONSTRAINT "PK_fb080786c16de6ace7ed0b69f7d" PRIMARY KEY ("key")
            );
            COMMENT ON COLUMN "api_key"."created_at" IS '생성시각';
            COMMENT ON COLUMN "api_key"."updated_at" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "api_key"."key" IS 'unique key';
            COMMENT ON COLUMN "api_key"."name" IS 'name';
            COMMENT ON COLUMN "api_key"."expired_at" IS 'expired at';
            COMMENT ON COLUMN "api_key"."last_accessed_at" IS 'last accessed at';
            COMMENT ON COLUMN "api_key"."meta" IS 'meta data'
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."admin_user_role_enum" AS ENUM('MANAGER', 'ADMIN', 'MASTER')
        `);
        await queryRunner.query(`
            CREATE TABLE "admin_user" (
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "name" character varying NOT NULL,
                "role" "public"."admin_user_role_enum" NOT NULL DEFAULT 'MANAGER',
                "logged_at" TIMESTAMP,
                CONSTRAINT "UQ_840ac5cd67be99efa5cd989bf9f" UNIQUE ("email"),
                CONSTRAINT "PK_a28028ba709cd7e5053a86857b4" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "admin_user"."created_at" IS '생성시각';
            COMMENT ON COLUMN "admin_user"."updated_at" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "admin_user"."id" IS '일련번호';
            COMMENT ON COLUMN "admin_user"."email" IS 'email';
            COMMENT ON COLUMN "admin_user"."password" IS 'password';
            COMMENT ON COLUMN "admin_user"."name" IS 'name';
            COMMENT ON COLUMN "admin_user"."role" IS 'role';
            COMMENT ON COLUMN "admin_user"."logged_at" IS 'last logged at'
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
        await queryRunner.query(`
            DROP INDEX "public"."IDX_58ec73bca3f5821907576bc66f"
        `);
        await queryRunner.query(`
            DROP TABLE "embedding_file"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."embedding_file_status_enum"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."OPENAI_USAGE_UNIQUE"
        `);
        await queryRunner.query(`
            DROP TABLE "open_ai_usage"
        `);
    }

}
