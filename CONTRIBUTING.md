# Contributing to Pyadra

> How to work on this codebase — human or AI. Current as of July 14, 2026.

## Read first, in this order

1. [VISION.md](VISION.md) — the philosophy
2. [docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md](docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md) — ⭐ the operational source of truth (business model, museum layer, the 14 non-negotiable rules)
3. The doc of the project you're touching, in `docs/pyadra_obsidian/Pyadra/04_Projects/` — its **COPY DECK** holds every visible string, verbatim
4. [ARCHITECTURE.md](ARCHITECTURE.md) + [supabase/README.md](supabase/README.md) — technical map and database ownership

## Setup

```bash
git clone https://github.com/pyadra/pyadra.git && cd pyadra
npm install
cp .env.example .env.local     # Stripe test keys, Supabase, Resend
npm run dev                     # http://localhost:3000
```

- **Node**: v20.19+ (vitest is pinned to v3 for Node 20.11 compatibility — don't bump it casually)
- **Database**: run `supabase/migrations/0008_full_reset_baseline.sql` in the Supabase SQL Editor
- **Webhooks locally**: `stripe listen --forward-to localhost:3000/api/stripe/webhook` (use the printed `whsec_` in `.env.local`)

## The working rules (these are enforced, not suggestions)

1. **Copy comes from the deck.** Every visible string is copied verbatim from the project doc's COPY DECK. If you need a string that isn't there, add it to the deck first. If code and deck disagree, the deck wins.
2. **The page never claims what the code doesn't do.** Found a gap? The copy gets corrected the same day (Company_Master non-negotiable #13).
3. **No new hardcodes.** Live data from the DB, or a `pyadra_settings` row read with `getSetting(key, fallback)`.
4. **Docs reconcile with code.** A meaningful page change updates the project doc in the same session: bump its version, add a dated changelog note, refresh the "last reconciled" stamp (see the reconciliation ritual in `Project_Standard_Template`).
5. **Privacy in the same commit.** Any new data-collecting feature updates `/legal/privacy` alongside the code.
6. **Design System v1.** Fraunces / DM Sans / IBM Plex Mono; type scale `.t-d1`–`.t-d6` (six sizes, never a seventh); surface `#EDEFED`; accent emerald `#059669`. Dark backgrounds and other typefaces live only *inside* project experiences that chose them (e.g. EterniCapsule's ceremonial world). Black and gold `#FFB000` are NOT Pyadra colors.
7. **Copy voice.** Never: "buy now", "add to cart", "shop", "checkout", "sign up", "get started", "disrupting", "passive income", "guaranteed returns".

## Code standards

- TypeScript everywhere; no `any` unless annotated with a reason
- Server components by default; `'use client'` only when needed
- Tailwind utility-first; match the file's existing idiom
- Zero build warnings; `sanitizeString()` on every user input that reaches the DB or an email

## Before you push (`main` auto-deploys to production)

```bash
npm run verify     # lint + typecheck + unit tests + build + smoke
# or minimally:
npm run smoke      # 22 route/API checks against the production build
```

If smoke is red, do not push. When you add a page or API, add its check to `scripts/smoke.mjs` in the same commit.

## Commits

Conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`, `security:`, `test:`), imperative subject, body explaining the why. English.

## Contact

[pyadra@pyadra.io](mailto:pyadra@pyadra.io) — the only real inbox.

---

***Lo que dejas importa.***
