# Pyadra Architecture

> The technical map, current as of July 14, 2026. For business rules and copy, the source of truth is
> [docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md](docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md);
> for the database, [supabase/README.md](supabase/README.md); for each project, its doc in `docs/pyadra_obsidian/Pyadra/04_Projects/`.

## Overview

Pyadra is a monolithic Next.js 16 (App Router) application. All projects share one codebase, one Supabase database, one Stripe account and one Resend account, while keeping **strict per-project boundaries in code** so any project can migrate out later.

**Key decisions:**

- **Monolith over microservices** — one founder, fast iteration
- **No Three.js** — all "3D" (capsule, spheres) is CSS/Framer Motion; the dependency was removed in July 2026 as unused
- **One table per concern** — the database was fully reset July 14, 2026 (migration `0008_full_reset_baseline.sql`, the single schema source of truth)
- **Per-project data access** — Orbit's table is reached ONLY through `src/app/lib/orbit-db.ts`; setting `ORBIT_SUPABASE_URL` + `ORBIT_SUPABASE_SERVICE_ROLE_KEY` moves Orbit to its own database with zero code changes
- **Editable parameters, not hardcodes** — `pyadra_settings` (key/JSONB) read via `getSetting(key, fallback)`; changing a row in Supabase updates the site without a deploy

## System map

```
Browser (React + Framer Motion)
        ↕
Next.js 16 App Router (Vercel)
├── Pages: home · exhibitions/galaxy · 4 project dashboards · store ·
│          archive/[id] · transmission-confirmed · legal · manifesto
├── middleware.ts: legacy redirects · security headers · strict CSP ·
│                  rate limiting (30 req/min/IP on /api/*, Stripe webhook exempt)
└── API routes
    ├── /api/observer                 → creates the visitor's Observer number
    ├── /api/donate                   → Orbit Stripe checkout ($5–$1,000 AUD)
    ├── /api/session                  → post-payment lookup → archive link
    ├── /api/stats/orbit-fund         → raised + goal + episodes (goal/episodes from pyadra_settings)
    ├── /api/stats/ethernicapsule     → live capsule counts
    ├── /api/ethernicapsule/checkout  → pending capsule + Stripe session (128-bit keys, hashed)
    ├── /api/ethernicapsule/verify    → key check → previewed/opened transitions
    ├── /api/ethernicapsule/edit      → 24h grace-period edit (sender key)
    ├── /api/ethernicapsule/guardian-access → time-vault unlock (token, after deliver_at)
    ├── /api/contact                  → enquiry forms → pyadra@pyadra.io (Resend)
    ├── /api/airtasker-stats          → Kangaroo live reputation numbers
    └── /api/stripe/webhook           → signature-verified; routes by metadata.project_id
        ↕
Supabase (PostgreSQL, RLS on, zero public policies)   Stripe   Resend
```

## Database (4 tables — full definitions in `supabase/migrations/0008_full_reset_baseline.sql`)

| Table | Owner | Notes |
|---|---|---|
| `pyadra_observers` | Museum | Visitor ticket counter. No IP addresses (privacy decision July 14, 2026). |
| `pyadra_settings` | Museum | key/JSONB site parameters. Live keys: `orbit.funding_goal_aud`, `orbit.episodes_live`. |
| `orbit_support_credentials` | Orbit 77 | One row per contribution; carries supporter identity; archive groups by `supporter_email`. Access ONLY via `orbit-db.ts`. |
| `ethernicapsule_capsules` | EterniCapsule | Status enum pending→sealed→previewed→opened; keys stored as SHA-256 hashes; message plaintext at rest (client-side AES is the top roadmap item — see the truth note in the project doc). |

Removed in the July 2026 reset: `orbit_supporters`, `orbit_applications` (crew form retired), `figurine_orders` (Figuitoon sells only on its Shopify), `home_scans` (legacy).

## Security posture (July 14, 2026)

- RLS enabled on all tables, **zero public policies** — all access server-side via service role
- Stripe webhook signature verification; amounts validated server-side
- Rate limiting 30 req/min/IP on `/api/*` (in-memory, middleware)
- Strict CSP (`connect-src 'self'` + Vercel Analytics only), HSTS, X-Frame-Options
- Input sanitization on every form (`sanitizeString`) — user strings are interpolated into emails
- EterniCapsule keys: 128 bits of entropy, hash-only storage — lost keys are unrecoverable
- No cron jobs — EterniCapsule delivery is on-demand (guardian token after `deliver_at`)
- Visitor data minimal: no IPs, no tracking cookies (Vercel Analytics is cookie-free)

## Payments

```
Client → checkout API → Stripe Hosted Checkout → payment
      → /api/stripe/webhook (signature-verified, idempotent upserts)
      → DB update + Resend emails → confirmation page
```

One monolithic webhook routes by `metadata.project_id` (`orbit-77`, `ethernicapsule`). This is the known blocker for project independence — splitting it is each project's P0 independence task.

## Deployment & quality gates

- Vercel, `main` auto-deploys. Domain: www.pyadra.io (apex redirects to www).
- **Before every push:** `npm run smoke` — boots the production build on a scratch port and checks 22 routes/APIs (pages render, old URLs redirect, APIs degrade gracefully without env keys). `npm run verify` = lint + typecheck + vitest + build + smoke.
- Env vars: `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY` (+ optional `ORBIT_SUPABASE_*` for Orbit's future dedicated DB).

---

_Last reconciled with production: July 14, 2026._
