## AdminJS session 테이블 쿼리 
```sql
CREATE TABLE "admin_session" (
                                 "sid" varchar NOT NULL COLLATE "default",
                                 "sess" json NOT NULL,
                                 "expire" timestamp(6) NOT NULL
)
    WITH (OIDS=FALSE);

ALTER TABLE "admin_session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "admin_session" ("expire");
```