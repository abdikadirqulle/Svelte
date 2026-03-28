# Finance Tracker — Project overview & prompt

Use this document as a quick **onboarding prompt** for people or AI agents working on the repo: what the app is, how it’s built, conventions to follow, and useful tasks.

---

## Project overview

**Finance Tracker** is a full-stack personal finance app built with **SvelteKit**. Users sign in with **Better Auth** (email/password or GitHub), manage **income and expense** line items stored in **PostgreSQL** (hosted on **Supabase**) via **Drizzle ORM**, and view summaries on a **dashboard**, full history on **transactions**, and **monthly aggregates** on **reports**. The UI uses **Tailwind CSS**, **TypeScript** everywhere, and **SvelteKit form actions** with `use:enhance` for progressive enhancement (no full page reload on submits).

---

## About the product

**Core user flows**

- **Authentication:** Sign up (`/sign-up`), sign in (`/login`), GitHub OAuth, sign out (form action on `/login?/signOut`).
- **Dashboard (`/dashboard`):** Total income, expenses, balance, spend/net ratios when income &gt; 0, recent transactions table, link to transactions.
- **Transactions (`/transactions`):** List/add/delete transactions; types `income` | `expense`; server-side validation; responsive table + mobile list.
- **Reports (`/report`):** Per-month income, expenses, net, and counts; all-time totals.
- **Root (`/`):** Redirects to `/dashboard` if authenticated, else `/login`.

**Data model**

- **Auth:** Better Auth tables — `user`, `session`, `account`, `verification` (`src/lib/server/db/auth.schema.ts`).
- **Finance:** `finance_transaction` — `id`, `user_id` → `user.id`, `type`, `amount`, `description`, `created_at` (`src/lib/server/db/schema.ts`).
- **DB access:** `src/lib/server/finance-db.ts` (queries); `src/lib/server/db/index.ts` (**`pg`** pool + Drizzle).

**Important paths**

| Path | Role |
|------|------|
| `src/lib/server/auth.ts` | Better Auth instance |
| `src/hooks.server.ts` | Session via Better Auth + `svelteKitHandler` |
| `src/routes/+layout.*` | Shell + nav when logged in |
| `drizzle/` | SQL migrations |
| `scripts/test-database.mjs` | `npm run db:test` — connectivity + table check |
| `scripts/disable-rls-supabase.sql` | Optional RLS fix on Supabase |

---

## Tech stack

| Layer | Technology |
|--------|------------|
| Framework | **SvelteKit** (Svelte 5, runes `$props`, `+page` / `+layout` / `+page.server`) |
| Language | **TypeScript** |
| Styling | **Tailwind CSS** v4 (`src/routes/layout.css`) |
| Auth & sessions | **better-auth** (minimal + Drizzle adapter + SvelteKit cookies) |
| Database | **PostgreSQL** (Supabase) |
| ORM & migrations | **Drizzle ORM** + **drizzle-kit** (`db:push`, `db:migrate`, `db:generate`) |
| DB driver (runtime) | **`pg`** (node-postgres) — Supabase TLS & encoded passwords in URI |
| CLI env | **dotenv** loaded in `drizzle.config.ts` |
| Auth HTTP | Default Better Auth base path **`/api/auth`** (see `svelteKitHandler` in hooks) |

---

## Rules & conventions

1. **TypeScript** for all new server and client code; match existing patterns (interfaces, `function` keyword for helpers where the codebase does).
2. **SvelteKit file layout:** use `+page.svelte` + `+page.server.ts` for load/actions; **do not** put form `actions` on `+layout.server.ts` (SvelteKit does not allow them there — use a page e.g. `/login` for `signOut`).
3. **Forms:** prefer SvelteKit **form actions** + **`use:enhance`** from `$app/forms` for mutations (login, transactions, logout targeting `/login`).
4. **Auth in loads:** gate protected routes with `if (!locals.user) throw redirect(303, '/login')`; use `locals.user.id` for `finance_transaction.user_id`.
5. **Database:** use Drizzle via `db` from `$lib/server/db` and helpers in `finance-db.ts`; avoid raw SQL in routes unless necessary.
6. **Environment:** `$env/dynamic/private` for `DATABASE_URL`, `ORIGIN`, `BETTER_AUTH_SECRET`, GitHub keys. **`ORIGIN`** must match the browser URL (e.g. `http://localhost:5173`). **`DATABASE_URL`:** one line; **`@` in password → `%40`**; prefer **direct** `:5432` URI for dev; `?sslmode=require` when needed.
7. **Supabase:** if inserts fail with permission/RLS issues, see `scripts/disable-rls-supabase.sql`. After schema changes, run **`npm run db:push`** (or migrate) and **`npm run db:test`**.
8. **Better Auth schema:** after auth config changes, regenerate with `npm run auth:schema` if required by Better Auth docs.
9. **Scope:** keep changes focused; don’t refactor unrelated files or add unsolicited docs unless asked.
10. **Security:** never commit `.env` or paste live secrets into chat; rotate leaked keys/passwords.

---

## Tasks (checklist for contributors)

**Setup**

- [ ] Copy `.env.example` → `.env`; set `ORIGIN`, `DATABASE_URL` (encoded password), `BETTER_AUTH_SECRET`, optional GitHub OAuth.
- [ ] GitHub OAuth callback: `{ORIGIN}/api/auth/callback/github`.
- [ ] `npm install` → `npm run db:test` → `npm run db:push` → `npm run dev`.

**Verification**

- [ ] Sign up → dashboard → add transaction → report shows month → log out → log in.
- [ ] Optional: GitHub sign-in end-to-end.

**Maintenance**

- [ ] Regenerate Drizzle migrations after schema edits: `npm run db:generate`; apply with `db:push` or `db:migrate`.
- [ ] Run `npm run check` before PRs; fix lint/format if required by the repo.

**Possible enhancements** (not implemented)

- [ ] Categories / tags for transactions; budgets; exports (CSV).
- [ ] Email verification / password reset (requires SMTP).
- [ ] E2E tests (Playwright) for auth + transactions.
- [ ] `experimental.joins` in Better Auth if using supported Drizzle relations.

---

## One-line prompt (for AI tools)

> **SvelteKit + TypeScript finance app:** Better Auth (email + GitHub) with Drizzle on Supabase Postgres; routes `/login`, `/sign-up`, `/dashboard`, `/transactions`, `/report`; transactions in `finance_transaction` keyed by `user.id`; form actions + `use:enhance`; Tailwind UI; env via `.env` (`ORIGIN`, `DATABASE_URL`, secrets). Follow `PROJECT.md` rules; do not use layout form actions; encode `@` in DB password as `%40` in `DATABASE_URL`.
