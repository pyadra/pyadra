# Pyadra

> **Discover. Connect. Build. Buy.** — the public tagline (home and site metadata)
> ***Lo que dejas importa.*** *(What you leave behind matters.)* — the founding motto

Pyadra creates, develops and collaborates to turn ideas into real projects — and looks for the people who want to acquire them, operate them, support them, work on them, or carry them forward. The website presents those projects as a museum: exhibitions, project rooms with proof and honest risks, a museum shop. Built by a solo founder; Pyadra LLC, Delaware.

**📖 New here?** Read in this order:

1. **[VISION.md](VISION.md)** — the philosophy, and how the idea evolved
2. **[Company_Master.md](docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md)** — ⭐ the operational source of truth (rules, business model, the museum layer, verified current state, evidence labels)
3. The project doc in `docs/pyadra_obsidian/Pyadra/04_Projects/` for whichever project you're touching — its **COPY DECK** records every visible string
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** and **[supabase/README.md](supabase/README.md)** before touching code or data

## 🌟 Live on pyadra.io (checked September 19, 2026)

| | | |
|---|---|---|
| [Galaxy](https://www.pyadra.io/exhibitions/galaxy) | The orbital field — 4 projects | |
| [Orbit 77](https://www.pyadra.io/exhibitions/galaxy/orbit) | Podcast · Season 2 funding ($10k goal, live progress) | Open for support |
| [EterniCapsule](https://www.pyadra.io/exhibitions/galaxy/ethernicapsule) | Time-locked messages · $9 AUD per capsule — the product runs at [eternicapsule.com](https://eternicapsule.com) | Open for acquisition |
| [Figuitoon](https://www.pyadra.io/exhibitions/galaxy/figurines) | Custom 3D figurines (sells via its own Shopify) | Available to acquire |
| [Kangaroo Cleanup](https://www.pyadra.io/exhibitions/galaxy/kangaroo-cleanup) | Sydney cleanup business (paused) — handover | Looking for a partner |
| [Store](https://www.pyadra.io/store) | The museum shop — Pyadra's own books (reserve by email) | |
| [Digital business card](https://www.pyadra.io/eduardo) | Where the QR on Eduardo's printed card leads — being extended into cards for the team | |

Not on the site: **Byndi**, a mobile app in testing (its own repo) — see [its record](docs/pyadra_obsidian/Pyadra/04_Projects/Byndi.md).

Status, evidence and known defects: Company_Master §13.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Animation**: Framer Motion (+ pure CSS — no Three.js)
- **Database**: Supabase PostgreSQL (4 tables, RLS closed — see [supabase/README.md](supabase/README.md))
- **Payments**: Stripe (signature-verified webhook — Orbit 77 only)
- **Email**: Resend (single receiving inbox: pyadra@pyadra.io)
- **Styling**: Tailwind CSS v4 · Design System v1 (Fraunces + DM Sans + IBM Plex Mono, `#EDEFED` + emerald `#059669`)
- **Hosting**: Vercel (`main` auto-deploys)

## 🚀 Getting Started

```bash
git clone https://github.com/pyadra/pyadra.git && cd pyadra
npm install
cp .env.example .env.local    # then fill in Stripe / Supabase / Resend keys
npm run dev                   # http://localhost:3000
```

> `.env.example` holds placeholders only and is the one `.env*` file git tracks. Never commit real keys. What each variable does: [ARCHITECTURE.md](ARCHITECTURE.md#environment).

Database schema: run `supabase/migrations/0008_full_reset_baseline.sql` in the Supabase SQL Editor (it is the single schema source of truth; 0000–0006 are history only).

To test payments + emails locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook` and use the printed `whsec_` as `STRIPE_WEBHOOK_SECRET`.

## 📜 Scripts

- `npm run dev` / `build` / `start` — the usual
- `npm test` — unit tests (vitest)
- `npm run lint` — ESLint (not part of `verify`)
- `npm run smoke` — boots the production build and checks every route/API listed in `scripts/smoke.mjs`. **Run before every push to `main`** (it auto-deploys). Needs a prior `next build`.
- `npm run verify` — typecheck + unit tests + build + smoke (the pre-deploy gate)

## 📁 Structure

```
src/app/
├── page.tsx                      # Home — minimal room + Observer ticket
├── exhibitions/                  # Exhibitions hall
├── exhibitions/galaxy/           # Galaxy + the 4 project dashboards
├── store/                        # The museum shop
├── eduardo/                      # The founder's room (QR destination)
├── manifesto/                    # Why Pyadra exists
├── archive/[id]/                 # Orbit supporter archive
├── transmission-confirmed/       # Orbit post-payment
├── legal/{privacy,terms}/        # Delaware law
├── api/                          # observer, donate, session, stats/orbit-fund,
│                                 # contact, airtasker-stats, vcard, stripe/webhook
│                                 # (EterniCapsule's API lives in its own repo —
│                                 #  github.com/pyadra/eternicapsule)
└── lib/                          # db.ts, orbit-db.ts, settings.ts, email, validation
brand/card/                       # QR for the printed founder card
supabase/                         # README (table ownership) + migrations
docs/pyadra_obsidian/             # ⭐ Canonical documentation (Obsidian vault)
scripts/smoke.mjs                 # Deploy smoke suite
```

## 📏 The rules that bite (short version — full list in Company_Master §15)

- The page **never claims what the code doesn't do** — copy is corrected the same day a gap is found
- Copy is written in the project doc's **COPY DECK** first, never improvised in code; the deck records what's live
- No hardcoded numbers — live data, or a `pyadra_settings` row (editable in Supabase without deploys)
- No e-commerce language ("buy now", "add to cart", …)
- Visitor data is minimal: no IPs, no tracking cookies; any new data flow updates `/legal/privacy` in the same commit
- Black is not a Pyadra color — smoke gray `#EDEFED` is the surface; dark lives only inside project experiences

## 📄 License & Contact

Proprietary — All rights reserved. · [pyadra@pyadra.io](mailto:pyadra@pyadra.io) · [pyadra.io](https://pyadra.io)

---

***Lo que dejas importa.***
