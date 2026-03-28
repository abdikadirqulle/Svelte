-- Run in Supabase → SQL Editor if inserts fail with “permission” / RLS errors.
-- Safe if you only access Postgres from your server with DATABASE_URL (not anon API).

alter table if exists public."user" disable row level security;
alter table if exists public.session disable row level security;
alter table if exists public.account disable row level security;
alter table if exists public.verification disable row level security;
alter table if exists public.finance_transaction disable row level security;
alter table if exists public.task disable row level security;
