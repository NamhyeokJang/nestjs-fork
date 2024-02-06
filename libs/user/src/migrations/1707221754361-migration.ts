import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707221754361 implements MigrationInterface {
    name = 'Migration1707221754361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_email_verify" (
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "code" character varying(10) NOT NULL,
                "expired_at" TIMESTAMP NOT NULL,
                "verify_at" TIMESTAMP,
                "user_id" integer NOT NULL,
                CONSTRAINT "PK_f08515080997ae8162aaff02164" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "user_email_verify"."created_at" IS '생성시각';
            COMMENT ON COLUMN "user_email_verify"."updated_at" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "user_email_verify"."id" IS '일련번호';
            COMMENT ON COLUMN "user_email_verify"."email" IS 'email';
            COMMENT ON COLUMN "user_email_verify"."code" IS 'verify code';
            COMMENT ON COLUMN "user_email_verify"."expired_at" IS 'expired at';
            COMMENT ON COLUMN "user_email_verify"."verify_at" IS 'verify at';
            COMMENT ON COLUMN "user_email_verify"."user_id" IS 'user'
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_562349e2105ed4c532c9d5c83b" ON "user_email_verify" ("user_id", "email")
        `);
        await queryRunner.query(`
            ALTER TABLE "user_email_verify"
            ADD CONSTRAINT "FK_3609cc429cb5d6f5024f5df6252" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_email_verify" DROP CONSTRAINT "FK_3609cc429cb5d6f5024f5df6252"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_562349e2105ed4c532c9d5c83b"
        `);
        await queryRunner.query(`
            DROP TABLE "user_email_verify"
        `);
    }

}
