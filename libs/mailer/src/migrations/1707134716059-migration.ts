import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1707134716059 implements MigrationInterface {
  name = 'Migration1707134716059'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "email_verify" (
            "created_at" TIMESTAMP NOT NULL,
            "updated_at" TIMESTAMP NOT NULL,
            "id" SERIAL NOT NULL,
            "key" character varying(20) NOT NULL,
            "email" character varying NOT NULL,
            "code" character varying(10) NOT NULL,
            "expired_at" TIMESTAMP NOT NULL,
            CONSTRAINT "PK_58749aeaa40bfafb1debe261ca0" PRIMARY KEY ("id")
        );
        COMMENT ON COLUMN "email_verify"."created_at" IS '생성시각';
        COMMENT ON COLUMN "email_verify"."updated_at" IS '마지막 업데이트 시각';
        COMMENT ON COLUMN "email_verify"."id" IS '일련번호';
        COMMENT ON COLUMN "email_verify"."key" IS 'key (ex. user key)';
        COMMENT ON COLUMN "email_verify"."email" IS 'email';
        COMMENT ON COLUMN "email_verify"."code" IS 'verify code';
        COMMENT ON COLUMN "email_verify"."expired_at" IS 'expired at'
        `)
    await queryRunner.query(`
        CREATE INDEX "IDX_e2b33de8b83eb62c68b6309c64" ON "email_verify" ("key", "email")
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "public"."IDX_e2b33de8b83eb62c68b6309c64"
        `)
    await queryRunner.query(`
        DROP TABLE "email_verify"
        `)
  }
}
