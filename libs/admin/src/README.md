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

### default Admin
email/password: master@sample.com / 12341234
```sql
INSERT INTO public.admin_user (created_at, updated_at, id, email, password, role, logged_at, name) VALUES ('2024-01-14 02:24:28.941000', '2024-01-14 02:24:28.941000', 2, 'master@example.com', '$2b$10$sHVNbRuGbAeR7QiFo9A2ju/P9kGCYGW6.UIYxUkRHQoVC1Kq4YpVK', 'MASTER', null, 'master');

```