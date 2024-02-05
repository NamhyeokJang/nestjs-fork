import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1707133909880 implements MigrationInterface {
  name = 'Migration1707133909880'

  public async up(queryRunner: QueryRunner): Promise<void> {
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
        `)
    await queryRunner.query(`
        CREATE UNIQUE INDEX "IDX_fb080786c16de6ace7ed0b69f7" ON "api_key" ("key")
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP INDEX "public"."IDX_fb080786c16de6ace7ed0b69f7"
        `)
    await queryRunner.query(`
        DROP TABLE "api_key"
        `)
  }
}
