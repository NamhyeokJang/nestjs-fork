import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1707133463374 implements MigrationInterface {
  name = 'Migration1707133463374'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "admin_session" (
            "sid" varchar NOT NULL COLLATE "default",
            "sess" json NOT NULL,
            "expire" timestamp(6) NOT NULL
        ) WITH (OIDS=FALSE);
        `)
    await queryRunner.query(`
        ALTER TABLE "admin_session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
        `)
    await queryRunner.query(`
        CREATE INDEX "IDX_session_expire" ON "admin_session" ("expire");
        `)
    await queryRunner.query(`
        CREATE TYPE "public"."admin_user_role_enum" AS ENUM('MANAGER', 'ADMIN', 'MASTER')
        `)
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
    `)
    await queryRunner.query(`
        CREATE UNIQUE INDEX "IDX_840ac5cd67be99efa5cd989bf9" ON "admin_user" ("email")
    `)
    await queryRunner.query(`
        INSERT INTO "admin_user" (created_at, updated_at, id, email, password, role, logged_at, name) VALUES ('2024-01-14 02:24:28.941000', '2024-01-14 02:24:28.941000', 2, 'master@example.com', '$2b$10$sHVNbRuGbAeR7QiFo9A2ju/P9kGCYGW6.UIYxUkRHQoVC1Kq4YpVK', 'MASTER', null, 'master');
      `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "admin_user"
        `)
    await queryRunner.query(`
            DROP TYPE "public"."admin_user_role_enum"
        `)
    await queryRunner.query(`
        DROP INDEX "public"."IDX_session_expire";
      `)
    await queryRunner.query(`
        DROP TABLE "admin_session"
        `)
  }
}
