import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1707134186056 implements MigrationInterface {
  name = 'Migration1707134186056'

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
        `)
    await queryRunner.query(`
        CREATE UNIQUE INDEX "OPENAI_USAGE_UNIQUE" ON "open_ai_usage" ("key", "date", "model")
        `)
    await queryRunner.query(`
       CREATE TYPE "public"."embedding_file_status_enum" AS ENUM(
           'PENDING',
           'IN_PROGRESS',
           'COMPLETED',
           'FAILED',
           'DELETING',
           'DELETED'
       )
        `)
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
        `)
    await queryRunner.query(`
        CREATE INDEX "IDX_58ec73bca3f5821907576bc66f" ON "embedding_file" ("owner")
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "public"."IDX_58ec73bca3f5821907576bc66f"
        `)
    await queryRunner.query(`
            DROP TABLE "embedding_file"
        `)
    await queryRunner.query(`
           DROP TYPE "public"."embedding_file_status_enum"
        `)
    await queryRunner.query(`
        DROP INDEX "public"."OPENAI_USAGE_UNIQUE"
        `)
    await queryRunner.query(`
        DROP TABLE "open_ai_usage"
        `)
  }
}
