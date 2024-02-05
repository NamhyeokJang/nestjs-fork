import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1707135282048 implements MigrationInterface {
    name = 'Migration1707135282048'

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
            CREATE TABLE "email_account" (
                "created_at" TIMESTAMP NOT NULL,
                "updated_at" TIMESTAMP NOT NULL,
                "id" SERIAL NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "logged_at" TIMESTAMP,
                "user_id" integer NOT NULL,
                CONSTRAINT "REL_7a868948b6ac436d404eacf8ce" UNIQUE ("user_id"),
                CONSTRAINT "PK_21a4813c9e9dd0de067dc542c57" PRIMARY KEY ("id")
            );
            COMMENT ON COLUMN "email_account"."created_at" IS '생성시각';
            COMMENT ON COLUMN "email_account"."updated_at" IS '마지막 업데이트 시각';
            COMMENT ON COLUMN "email_account"."id" IS '일련번호';
            COMMENT ON COLUMN "email_account"."email" IS 'email';
            COMMENT ON COLUMN "email_account"."password" IS 'password';
            COMMENT ON COLUMN "email_account"."logged_at" IS 'last logged at';
            COMMENT ON COLUMN "email_account"."user_id" IS 'user info'
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX "IDX_a7a173fb9d13834d84fcdd7849" ON "email_account" ("email")
        `);
        await queryRunner.query(`
            ALTER TABLE "email_account"
            ADD CONSTRAINT "FK_7a868948b6ac436d404eacf8ce6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "email_account" DROP CONSTRAINT "FK_7a868948b6ac436d404eacf8ce6"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_a7a173fb9d13834d84fcdd7849"
        `);
        await queryRunner.query(`
            DROP TABLE "email_account"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_role_enum"
        `);
    }

}
