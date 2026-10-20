# Contributing to Pyadra

> How to work on this codebase — human or AI. Current as of September 19, 2026.

## Read first, in this order

1. [VISION.md](VISION.md) — the philosophy
2. [docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md](docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md) — ⭐ the operational source of truth (business definition, museum layer, the 14 non-negotiable rules, evidence labels in §0)
3. The doc of the project you're touching, in `docs/pyadra_obsidian/Pyadra/04_Projects/` — its **COPY DECK** holds every visible string, verbatim
4. [ARCHITECTURE.md](ARCHITECTURE.md) + [supabase/README.md](supabase/README.md) — technical map, environment, known issues and database ownership

## Setup

```bash
git clone https://github.com/pyadra/pyadra.git && cd pyadra
npm install
cp .env.example .env.local      # placeholders only — fill in real keys
npm run dev                     # http://localhost:3000
```

- **Node**: ≥ 20.9 (Next.js 16's minimum). The owner's machine runs 20.11 — vitest is pinned to v3 for that reason; don't bump it casually. CI uses Node 20.x.
- **Env template**: `.env.example` is tracked (every other `.env*` is ignored) — what each variable does is in ARCHITECTURE.md → Environment. Never commit real keys.
- **Database**: run `supabase/migrations/0008_full_reset_baseline.sql` in the Supabase SQL Editor
- **Webhooks locally**: `stripe listen --forward-to localhost:3000/api/stripe/webhook` (use the printed `whsec_` in `.env.local`)

## The working rules (these are enforced, not suggestions)

1. **Copy is written in the deck first.** Every visible string is copied verbatim from the project doc's COPY DECK. If you need a string that isn't there, add it to the deck first. The deck also *records* what's live: if you find the deck and the live page disagree, update the deck to the live string the same day — and if the live string is false, mark it ⚠ and fix the page (Company_Master §6).
2. **The page never claims what the code doesn't do.** Found a gap? The copy gets corrected the same day (Company_Master non-negotiable #13).
3. **No new hardcodes.** Live data from the DB, or a `pyadra_settings` row read with `getSetting(key, fallback)`.
4. **Docs reconcile with code.** A meaningful page change updates the project doc in the same session: bump its version, add a dated changelog note, refresh the "last reconciled" stamp (see the reconciliation ritual in `Project_Standard_Template`). If a project's proof numbers change, update Galaxy's sphere line **and** the `/eduardo` project row in the same commit.
5. **Label your claims.** In docs, say whether something is implemented, deployed, verified in real use, an owner decision, a plan or an open proposal (Company_Master §0). Never fill a gap with an invented figure, price, date or owner.
6. **Privacy in the same commit.** Any new data-collecting feature updates `/legal/privacy` alongside the code.
7. **Design System v1.** Fraunces / DM Sans / IBM Plex Mono; type scale `.t-d1`–`.t-d6` (six sizes, never a seventh); surface `#EDEFED`; accent emerald `#059669`. Dark backgrounds and other typefaces live only *inside* project experiences that chose them (e.g. EterniCapsule's ceremonial world). Black and gold `#FFB000` are NOT Pyadra colors.
8. **Copy voice.** Never: "buy now", "add to cart", "shop", "checkout", "sign up", "get started", "disrupting", "passive income", "guaranteed returns". (Some live strings already use "shop" and "checkout" — the scope of this ban is an open owner question in Company_Master §11; don't add new uses.)

## Code standards

- TypeScript everywhere; no `any` unless annotated with a reason
- Server components by default; `'use client'` only when needed
- Tailwind utility-first; match the file's existing idiom
- Zero build warnings; `sanitizeString()` on every user input that reaches the DB or an email

## Before you push (`main` auto-deploys to production)

```bash
npm run lint       # ESLint — not included in verify
npm run verify     # typecheck + unit tests + build + smoke
# or minimally, after a build:
npm run smoke      # every route/API check in scripts/smoke.mjs
```

If smoke is red, do not push. When you add a page or API, add its check to `scripts/smoke.mjs` in the same commit.

## Commits

Conventional prefixes (`feat:`, `fix:`, `docs:`, `chore:`, `security:`, `test:`), imperative subject, body explaining the why. English.

## Contact

[pyadra@pyadra.io](mailto:pyadra@pyadra.io) — the only real inbox.

---

***Lo que dejas importa.***
