# Pyadra — Database (Supabase)

One shared Supabase project today, but tables are **owned per project** and code
access is segregated so any project can be migrated to its own database later
by flipping env vars — no code changes.

_Reconciled with the code on September 19, 2026._

## Table ownership

| Project | Tables | Client (only entry point) |
|---|---|---|
| **Orbit 77** (independent, migratable) | `orbit_support_credentials` (one row per contribution; archive groups by `supporter_email`) | `src/app/lib/orbit-db.ts` → `getOrbitSupabase()` |
| **EterniCapsule** (external — standalone repo `pyadra/eternicapsule`, deployed since August 26, 2026; still this same Supabase project) | `ethernicapsule_capsules` | Its own `db.ts` → `getSupabase()`, in the eternicapsule repo — **not** this repo's `src/app/lib/db.ts`. No Pyadra code has read or written this table since September 15, 2026; `src/app/lib/database.types.ts` still lists its shape for reference only. |
| **Pyadra (its own pages)** | `pyadra_observers` (Observer ticket counter — home and `/eduardo`), `pyadra_settings` (editable site parameters — read via `src/app/lib/settings.ts` → `getSetting()`) | `src/app/lib/db.ts` → `getSupabase()` |

Removed July 2026: `home_scans` (legacy home scan game), `orbit_applications`
(crew form retired), `figurine_orders` (Figuitoon sells via its own Shopify;
its museum page is a showcase only — no internal checkout), `orbit_supporters`
(the supporter identity now lives on each credential row).

> ⚠ Known defect outside this repo (September 19, 2026): the eternicapsule app's
> `/api/stats` filters on a column named `unlock_date`, which does not exist in
> this schema (the column is `deliver_at`). Its counts therefore can't be trusted
> until that's fixed. See ARCHITECTURE.md → Known issues.

## Rules

1. Never query another project's tables through the wrong client.
2. Orbit 77 code must import from `orbit-db.ts`, never `db.ts`.
3. No SQL joins across project boundaries — they would block future migration.

## Migrations

**`0008_full_reset_baseline.sql` is the single source of truth** (July 14, 2026).
The live DB had drifted from migrations 0000–0006 (columns added by hand:
`deliver_at`, `guardian_key_delivered`, `pending` status; RLS disabled on two
tables; legacy `home_scans` data). Since all data was test data (owner
confirmation recorded in the migration header), 0008 drops everything and
recreates the schema clean, matching the code.
Migrations 0000–0006 are kept for history only — never run them again.
(There is no `0007` file; the 0008 header says "Replaces migrations 0000–0007".)

## Migrating Orbit 77 out (when the time comes)

1. Create the new Supabase project.
2. Run the Orbit part of `0008_full_reset_baseline.sql` there (the shared `update_updated_at_column()` function + `orbit_support_credentials`, its indexes, trigger and RLS line).
3. Set `ORBIT_SUPABASE_URL` and `ORBIT_SUPABASE_SERVICE_ROLE_KEY` in the environment.
4. If real data exists by then, copy the `orbit_support_credentials` rows over, then drop the table from the shared DB.

Until those env vars are set, `getOrbitSupabase()` falls back to the shared
`NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.
