# Pyadra — Database (Supabase)

One shared Supabase project today, but tables are **owned per project** and code
access is segregated so any project can be migrated to its own database later
by flipping env vars — no code changes.

## Table ownership

| Project | Tables | Client (only entry point) |
|---|---|---|
| **Orbit 77** (independent, migratable) | `orbit_support_credentials` (one row per contribution; archive groups by `supporter_email`) | `src/app/lib/orbit-db.ts` → `getOrbitSupabase()` |
| **EterniCapsule** (museum) | `ethernicapsule_capsules` | `src/app/lib/db.ts` → `getSupabase()` |
| **Pyadra (the museum itself)** | `pyadra_observers` (home ticket counter), `pyadra_settings` (editable site parameters — read via `src/app/lib/settings.ts` → `getSetting()`) | `src/app/lib/db.ts` → `getSupabase()` |

Removed July 2026: `home_scans` (legacy home scan game), `orbit_applications`
(crew form retired), `figurine_orders` (Figuitoon sells via its own Shopify;
its museum page is a showcase only — no internal checkout).

## Rules

1. Never query another project's tables through the wrong client.
2. Orbit 77 code must import from `orbit-db.ts`, never `db.ts`.
3. No SQL joins across project boundaries — they would block future migration.

## Migrations

**`0008_full_reset_baseline.sql` is the single source of truth** (July 14, 2026).
The live DB had drifted from migrations 0000–0006 (columns added by hand:
`deliver_at`, `guardian_key_delivered`, `pending` status; RLS disabled on two
tables; legacy `home_scans` data). Since all data was test data, 0008 drops
everything and recreates the schema clean, matching the code exactly.
Migrations 0000–0006 are kept for history only — never run them again.

## Migrating Orbit 77 out (when the time comes)

1. Create the new Supabase project.
2. Run the three Orbit migrations there.
3. Set `ORBIT_SUPABASE_URL` and `ORBIT_SUPABASE_SERVICE_ROLE_KEY` in the environment.
4. (If real data exists by then) copy the three `orbit_*` tables over, then drop them from the shared DB.

Until those env vars are set, `getOrbitSupabase()` falls back to the shared
`NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`.
