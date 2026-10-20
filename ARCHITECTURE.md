# Pyadra Architecture

> The technical map, reconciled with the code and a read-only check of production on **September 19, 2026**, with the fixes of **September 22** recorded below (not deployed).
> For business rules and copy, the source of truth is [Company_Master.md](docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md);
> for the database, [supabase/README.md](supabase/README.md); for each project, its doc in `docs/pyadra_obsidian/Pyadra/04_Projects/`.

## Overview

Pyadra is a Next.js 16 (App Router) application that hosts Pyadra's own pages and the project rooms. Projects share one codebase, one Supabase database, one Stripe account and one Resend account, while keeping **strict per-project boundaries in code** so any project can migrate out later. One project already has: EterniCapsule runs as its own deployment (see [Related repositories](#related-repositories)).

**Key decisions:**

- **Monolith first, split when earned** — one founder, fast iteration; a project moves to its own deployment when it needs its own release cycle
- **No Three.js** — all "3D" (capsule, spheres) is CSS/Framer Motion; the dependency was removed in July 2026 as unused
- **One table per concern** — the database was fully reset July 14, 2026 (migration `0008_full_reset_baseline.sql`, the single schema source of truth)
- **Per-project data access** — Orbit's table is reached ONLY through `src/app/lib/orbit-db.ts`; setting `ORBIT_SUPABASE_URL` + `ORBIT_SUPABASE_SERVICE_ROLE_KEY` moves Orbit to its own database with zero code changes
- **Editable parameters, not hardcodes** — `pyadra_settings` (key/JSONB) read via `getSetting(key, fallback)`; changing a row in Supabase updates the site without a deploy

## System map

```
Browser (React + Framer Motion)
        ↕
Next.js 16 App Router (Vercel project "pyadra")
├── Pages: home · exhibitions · exhibitions/galaxy · 4 project dashboards ·
│          store · eduardo · manifesto · legal/{privacy,terms} ·
│          archive/[id] · transmission-confirmed
├── middleware.ts: legacy redirects · security headers · strict CSP ·
│                  CORS on /api/* · rate limiting (30 req/min/IP on /api/*,
│                  Stripe webhook exempt)
└── API routes
    ├── /api/observer                 → creates the visitor's Observer number (home, /eduardo)
    ├── /api/donate                   → Orbit Stripe checkout ($5–$1,000 AUD); GET = health check
    ├── /api/session                  → post-payment lookup → archive link
    ├── /api/stats/orbit-fund         → raised + goal + episodes (goal/episodes from pyadra_settings)
    ├── /api/contact                  → every enquiry/idea dialog → pyadra@pyadra.io (Resend)
    ├── /api/airtasker-stats          → Kangaroo reputation numbers (server-side fetch, 1 h cache, fallback 248/213)
    ├── /api/vcard                    → Eduardo's contact card (vCard 3.0) for /eduardo
    └── /api/stripe/webhook           → signature-verified; handles metadata.project_id = "orbit-77" only
        ↕
Supabase (PostgreSQL, RLS on, zero public policies)   Stripe   Resend
```

The EterniCapsule showcase page (`/exhibitions/galaxy/ethernicapsule`) links out to eternicapsule.com and tries to read `https://eternicapsule.com/api/stats` from the browser — see Known issues.

## Related repositories

| Repo | What | Deploy | Shares with Pyadra |
|---|---|---|---|
| `github.com/pyadra/eternicapsule` | EterniCapsule product (compose → checkout → seal → guardian → unlock) | Own Vercel project `eternicapsule`, same Vercel team as `pyadra`; eternicapsule.com. Repo created and deployed August 26, 2026; Pyadra retired its in-monolith copy September 15, 2026 | Supabase project (table `ethernicapsule_capsules`), Stripe account (own webhook endpoint, `project_id: "eternicapsule"`), Resend account |
| Byndi (local repo on the owner's machine — **no git remote configured**) | Mobile app (Expo / React Native), bundle ID `com.pyadra.byndi` | EAS builds; store publication unverified | Nothing on the Pyadra stack |

## Database (4 tables — full definitions in `supabase/migrations/0008_full_reset_baseline.sql`)

| Table | Owner | Notes |
|---|---|---|
| `pyadra_observers` | Pyadra | Visitor ticket counter. No IP addresses (privacy decision July 14, 2026). |
| `pyadra_settings` | Pyadra | key/JSONB site parameters. Live keys: `orbit.funding_goal_aud`, `orbit.episodes_live`. |
| `orbit_support_credentials` | Orbit 77 | One row per contribution; carries supporter identity; archive groups by `supporter_email`. Access ONLY via `orbit-db.ts`. |
| `ethernicapsule_capsules` | EterniCapsule (external — written only by the eternicapsule.com app since September 15, 2026) | Status enum pending→sealed→previewed→opened; keys stored as SHA-256 hashes; message plaintext at rest (client-side AES is the top roadmap item — see the truth note in the project doc). |

Removed in the July 2026 reset: `orbit_supporters`, `orbit_applications` (crew form retired), `figurine_orders` (Figuitoon sells only on its Shopify), `home_scans` (legacy).

## Security posture (pyadra.io — July 14, 2026; CSP re-checked on production September 19, 2026)

- RLS enabled on all tables, **zero public policies** — all access server-side via service role
- Stripe webhook signature verification; amounts validated server-side
- Rate limiting 30 req/min/IP on `/api/*` (in-memory, per server instance — stops casual abuse, not a distributed guarantee)
- Strict CSP (`connect-src`: self + Vercel Analytics + eternicapsule.com, which the showcase reads its stats from), HSTS, X-Frame-Options
- Input sanitization on every form (`sanitizeString`) — user strings are interpolated into emails
- EterniCapsule keys: 128 bits of entropy, hash-only storage — now enforced by the eternicapsule.com app, not Pyadra
- No cron jobs — EterniCapsule delivery is on-demand (guardian token after `deliver_at`)
- Visitor data minimal: no IPs, no tracking cookies (Vercel Analytics is cookie-free)

## Payments

```
Client → /api/donate → Stripe Hosted Checkout → payment
      → /api/stripe/webhook (signature-verified, idempotent upsert on the session id)
      → orbit_support_credentials + Resend credential email → /transmission-confirmed
```

Pyadra's webhook routes by `metadata.project_id` and today only handles `orbit-77` — the known blocker for Orbit's independence (EterniCapsule cleared the same blocker with its own endpoint). The Pyadra Store takes no payments (reserve-by-email).

## Environment

Variables the code in this repo actually reads (checked September 19, 2026):

| Variable | Used by | Required |
|---|---|---|
| `STRIPE_SECRET_KEY` | `/api/donate`, webhook | Yes, for payments |
| `STRIPE_WEBHOOK_SECRET` | webhook | Yes, for payments |
| `NEXT_PUBLIC_SUPABASE_URL` | `db.ts` (+ Orbit fallback) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | `db.ts` (+ Orbit fallback) | Yes |
| `RESEND_API_KEY` | contact + credential emails | Yes, for email |
| `NEXT_PUBLIC_SITE_URL` | middleware CORS origin; `/api/donate` return-URL fallback | Recommended (falls back to `http://localhost:3000`) |
| `ORBIT_SUPABASE_URL`, `ORBIT_SUPABASE_SERVICE_ROLE_KEY` | `orbit-db.ts` | Optional — Orbit's future dedicated DB |

`.env.example` is in the repo again (September 22, 2026) and lists exactly these. Commented out there, because no code reads them but CI still sets them for its build: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL`. Which values are set in Vercel production was not inspected.

Sender identities in code: `Pyadra Contact <contact@pyadra.io>` (contact API) and `Orbit 77 <orbit77@pyadra.io>` (credential email). Replies and enquiries go to `pyadra@pyadra.io`.

## Deployment & quality gates

- Vercel, `main` auto-deploys. `pyadra.io` redirects (307) to `www.pyadra.io` — verified September 19, 2026.
- **Before every push:** `npm run smoke` — boots the production build on port 3499 and checks **21 routes/APIs** (as of September 19, 2026): pages render, old URLs redirect, APIs degrade gracefully without env keys. When you add a page or API, add its check to `scripts/smoke.mjs` in the same commit. This is the one place the count is recorded.
- `npm run verify` = `tsc --noEmit` + vitest + `next build` + smoke. It does **not** run ESLint — run `npm run lint` separately.
- **CI (GitHub Actions):** on push/PR to `main` — typecheck, lint (non-blocking), unit tests, coverage (non-blocking), build with mock env vars. `security.yml`: npm audit (non-blocking) + CodeQL, also weekly. All runs through September 16, 2026 were green.
- Unit tests: 22 tests in `src/app/lib/__tests__/` (email + validation), passing on September 19, 2026.
- Node: Next.js 16 needs Node ≥ 20.9. The owner's machine runs Node 20.11, which is why vitest stays on v3; CI uses Node 20.x.

## Known issues — found September 19, fixed September 22, 2026

**None of these fixes is deployed.** The ones in the eternicapsule repo need that repo committed and deployed before they change anything live.

| # | Issue | Fix | Where |
|---|---|---|---|
| 1 | Galaxy sphere said `Hosted on Pyadra` for EterniCapsule — outdated since the split (Galaxy.md v4.1 had recorded a fix never made in code) | Now `Independently deployed (eternicapsule.com)` | `src/app/exhibitions/galaxy/page.tsx` |
| 2 | Showcase caption said `$9 AUD per capsule · client-side sealed`, though nothing is sealed or encrypted client-side (non-negotiable #13) | Now `key-locked` | `src/app/exhibitions/galaxy/ethernicapsule/page.tsx` |
| 3 | The showcase fetches `https://eternicapsule.com/api/stats` from the browser, but the CSP `connect-src` didn't allow that origin | `https://eternicapsule.com` added to `connect-src` | `src/middleware.ts` |
| 4 | That endpoint answered `Access-Control-Allow-Origin: https://pyadra.io` while the site is served from `https://www.pyadra.io` | Both origins allowed, echoed back with `Vary: Origin` | eternicapsule repo, `src/app/api/stats/route.ts` |
| 5 | That endpoint filtered on `unlock_date`, a column that doesn't exist (it's `deliver_at`), so the query errored and every count came back 0 | Uses `deliver_at` | eternicapsule repo, same file |
| 6 | No rate limiting on eternicapsule.com's API (Pyadra's middleware wasn't ported at the split) | Same limiter as Pyadra: 30 req/min/IP, Stripe webhook exempt | eternicapsule repo, new `src/middleware.ts` |
| 7 | `/api/observer` returned a random 1–100 id when the DB was unavailable, and the browser stored it as permanent | Returns `{ id: null }`; both pages show no ticket rather than a fake number | `src/app/api/observer/route.ts`, `page.tsx`, `eduardo/page.tsx` |
| 8 | `/legal/privacy` didn't cover contact forms, described EterniCapsule collection as pyadra.io's, and said only the home counted Observers | New section 4 for contact forms; EterniCapsule and Observer sections corrected; effective date now September 2026 | `src/app/legal/privacy/page.tsx` |
| 9 | `.env.example` was excluded by `.gitignore` (`.env*`) | `!.env.example` added; the template now lists the variables the code actually reads | `.gitignore`, `.env.example` |
| 10 | `.github/labeler.yml` still pointed at pre-April paths | Rewritten against the current structure | `.github/labeler.yml` |

**Open, not code:** the Orbit fund's $10 is most likely the owner's own test payment — if so, that row should be removed from the database so the public progress bar counts only real support.

---

_Last reconciled with code and production: September 22, 2026._
