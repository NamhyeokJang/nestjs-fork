import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707058553132 implements MigrationInterface {
    name = 'Migration1707058553132'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TYPE "public"."user_role_enum" AS ENUM('ANONYMOUS', 'GUEST', 'USER', 'ADMIN', 'MASTER')
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "id" SERIAL NOT NULL,
                "role" "public"."user_role_enum" NOT NULL,
                "nickname" character varying(40),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "user"."created_at" IS '생성시각';
            COMMENT ON COLUMN "user"."updated_at" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "user"."id" IS '일련번호';
            COMMENT ON COLUMN "user"."role" IS 'user''s role';
            COMMENT ON COLUMN "user"."nickname" IS 'user''s name'
        `);
        await queryRunner.query(`
            CREATE TABLE "email" (
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "logged_at" TIMESTAMP,
                "user_id" integer NOT NULL,
                CONSTRAINT "REL_25f2e7a5a3fc2c9119ecfa4049" UNIQUE ("user_id"),
                CONSTRAINT "PK_1e7ed8734ee054ef18002e29b1c" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "email"."created_at" IS '생성시각';
            COMMENT ON COLUMN "email"."updated_at" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "email"."id" IS '일련번호';
            COMMENT ON COLUMN "email"."email" IS 'email';
            COMMENT ON COLUMN "email"."password" IS 'password';
            COMMENT ON COLUMN "email"."logged_at" IS 'last logged at';
            COMMENT ON COLUMN "email"."user_id" IS 'user info'
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_fee9013b697946e8129caba898" ON "email" ("email")
        `);
        await queryRunner.query(`
            ALTER TABLE "email"
            ADD CONSTRAINT "FK_25f2e7a5a3fc2c9119ecfa40493" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "email" DROP CONSTRAINT "FK_25f2e7a5a3fc2c9119ecfa40493"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_fee9013b697946e8129caba898"
        `);
        await queryRunner.query(`
            DROP TABLE "email"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
    }

}
