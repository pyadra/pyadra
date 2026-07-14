# Pyadra

> **Lo que dejas importa.**
> *(What you leave behind matters.)*

Pyadra is a digital museum where real projects live, can be experienced today, and can be taken further — supported, partnered on, or acquired. Built by a solo founder; Pyadra LLC, Delaware.

**📖 New here?** Read in this order:

1. **[VISION.md](VISION.md)** — the philosophy (why Pyadra exists)
2. **[docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md](docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md)** — ⭐ the operational source of truth (rules, business model, the museum layer)
3. The project doc in `docs/pyadra_obsidian/Pyadra/04_Projects/` for whichever project you're touching — its **COPY DECK** is the verbatim source of every visible string

## 🌟 Live (pyadra.io)

| | | |
|---|---|---|
| [Galaxy](https://pyadra.io/exhibitions/galaxy) | The orbital field — 4 live projects | |
| [Orbit 77](https://pyadra.io/exhibitions/galaxy/orbit) | Podcast · Season 2 funding ($10k goal, live progress) | Open for support |
| [EterniCapsule](https://pyadra.io/exhibitions/galaxy/ethernicapsule) | Time-locked messages · $9 AUD per capsule | Open for acquisition |
| [Figuitoon](https://pyadra.io/exhibitions/galaxy/figurines) | Custom 3D figurines (sells via its own Shopify) | Available to acquire |
| [Kangaroo Cleanup](https://pyadra.io/exhibitions/galaxy/kangaroo-cleanup) | Sydney cleanup business handover | Looking for a partner |
| [Store](https://pyadra.io/store) | The museum shop — Pyadra's own books | |

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Animation**: Framer Motion (+ pure CSS — no Three.js)
- **Database**: Supabase PostgreSQL (4 tables, RLS closed — see [supabase/README.md](supabase/README.md))
- **Payments**: Stripe (signature-verified webhook)
- **Email**: Resend (single inbox: pyadra@pyadra.io)
- **Styling**: Tailwind CSS v4 · Design System v1 (Fraunces + DM Sans + IBM Plex Mono, `#EDEFED` + emerald `#059669`)
- **Hosting**: Vercel (`main` auto-deploys)

## 🚀 Getting Started

```bash
git clone https://github.com/pyadra/pyadra.git && cd pyadra
npm install
cp .env.example .env.local   # fill in Stripe / Supabase / Resend keys
npm run dev                   # http://localhost:3000
```

Database schema: run `supabase/migrations/0008_full_reset_baseline.sql` in the Supabase SQL Editor (it is the single schema source of truth; 0000–0007 are history only).

To test payments + emails locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook` and use the printed `whsec_` as `STRIPE_WEBHOOK_SECRET`.

## 📜 Scripts

- `npm run dev` / `build` / `start` — the usual
- `npm test` — unit tests (vitest)
- `npm run smoke` — boots the production build and checks 22 routes/APIs. **Run before every push to `main`** (it auto-deploys).
- `npm run verify` — lint + typecheck + tests + build + smoke (the full pre-deploy gate)

## 📁 Structure

```
src/app/
├── page.tsx                      # Home — minimal room + Observer ticket
├── exhibitions/galaxy/           # Galaxy + the 4 project dashboards
├── store/                        # The museum shop
├── archive/[id]/                 # Orbit supporter archive
├── transmission-confirmed/       # Orbit post-payment
├── legal/{privacy,terms}/        # Accurate + Delaware law
├── api/                          # donate, session, stats, observer,
│                                 # contact, ethernicapsule/*, stripe/webhook
└── lib/                          # db.ts, orbit-db.ts, settings.ts, email, validation
supabase/                         # README (table ownership) + migrations
docs/pyadra_obsidian/             # ⭐ Canonical documentation (Company_Master + project docs)
scripts/smoke.mjs                 # Deploy smoke suite
```

## 📏 The rules that bite (short version — full list in Company_Master §15)

- The page **never claims what the code doesn't do** — copy is corrected the same day a gap is found
- Every visible string comes from the project doc's **COPY DECK**, verbatim — never improvised in code
- No hardcoded numbers — live data, or a `pyadra_settings` row (editable in Supabase without deploys)
- No e-commerce language ("buy now", "add to cart", …)
- Visitor data is minimal: no IPs, no tracking cookies; any new data flow updates `/legal/privacy` in the same commit
- Black is not a Pyadra color — smoke gray `#EDEFED` is the surface; dark lives only inside project experiences

## 📄 License & Contact

Proprietary — All rights reserved. · [pyadra@pyadra.io](mailto:pyadra@pyadra.io) · [pyadra.io](https://pyadra.io)

---

***Lo que dejas importa.***
