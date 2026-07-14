# Pyadra: The Vision

> **Start here.** This document explains what Pyadra is, why it exists, and where it's going. Read this before touching any code.

---

## Tagline

**"Lo que dejas importa."**  
*(What you leave behind matters.)*

This is not marketing copy. This is the foundational truth that guides every design decision, every line of code, every user interaction. If something doesn't honor this truth, it doesn't belong in Pyadra.

---

## What Pyadra Is

Pyadra is **not a web app**. It's not a SaaS platform. It's not a startup building "solutions."

**Pyadra is a home for what lasts.**

It's where you build projects that matter, support people who create, and leave work that endures. Pyadra is organized into **exhibitions** - spaces where you can create meaningful things, help others, and be part of something that doesn't disappear.

You don't "use" Pyadra and forget it. You **build in Pyadra**. What you create here stays.

### The Core Emotion

Pyadra exists to create **pertenencia** (belonging).

The people who arrive at Pyadra already believe that what they leave behind matters. Pyadra gives them the place to make it real. They are not consumers. They are **builders** - people who want to help people, support creators, and contribute to something that lasts.

---

## Why Pyadra Exists

Most digital products are optimized for:
- Conversion rates
- Engagement metrics  
- Retention loops
- Growth hacking

Pyadra rejects this entirely.

**Pyadra exists to create experiences that feel:**
- **Permanent** - Like stone inscriptions, not disposable tweets
- **Intentional** - Actions with weight, not mindless scrolling
- **Mysterious** - Discovery over explanation, invitation over instruction
- **Beautiful** - Crafted interfaces that respect your attention

Think of it as the opposite of "move fast and break things." Pyadra moves deliberately and builds things that last.

---

## The Exhibition Structure

Pyadra is organized into **three exhibitions** - thematic spaces where projects live:

```
┌─────────────────────────────────────────────────┐
│                    PYADRA                        │
├─────────────────────────────────────────────────┤
│  Home → Where you start (Become an Observer)    │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │  EXHIBITION 1: Galaxy (Active - 2026)     │  │
│  │  Theme: Cosmic void, orbital mechanics     │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │  EXHIBITION 2: Jungle (Q4 2026/Q1 2027)   │  │
│  │  Theme: Organic growth, wild emergence     │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │  EXHIBITION 3: City (2027+)               │  │
│  │  Theme: Urban systems, connections         │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

**You are NOT building 3 separate apps.** You're building one home with three exhibitions where people create things that last.

*For detailed project descriptions, see "How Pyadra Actually Works" section below.*

---

## Design Philosophy

### 1. Every Action Is a Ritual

**Bad**: Click "Submit Form" → Generic success message  
**Pyadra**: Complete signal detection → Signature engraved → Archive remembers you

Every interaction should feel **intentional**. Buttons aren't just buttons - they're seals, transmissions, engravings. Copy reflects this: "Seal the capsule" not "Submit", "Send pulse" not "Click here".

### 2. Mystery Over Explanation

Don't explain everything upfront. Let users discover. No giant hero section saying "Pyadra is a platform that helps you..."

Instead: a symbol, a wordmark, one tagline, one door — and let them walk in.

### 3. Beauty as Standard

If it's not beautiful, it doesn't ship. This isn't subjective - there are clear aesthetic rules (Design System v1, July 2026):
- Light museum surface (`#EDEFED` smoke gray) on every Pyadra page — dark backgrounds belong only *inside* project experiences that choose them
- Emerald accents (`#059669` — Colombian emerald)
- Serif for emotional weight (Fraunces)
- Sans for readability (DM Sans)
- Mono for system/data (IBM Plex Mono)
- Locked type scale `.t-d1`–`.t-d6` — six sizes, never a seventh
- Animations are **organic** (breathing, floating) not mechanical (linear slides)

### 4. Performance Is Part of Beauty

A laggy, janky experience breaks the spell. 60fps minimum. Fast load times. Smooth animations. If it feels cheap, it is cheap.

### 5. Permanence Over Virality

Pyadra doesn't care about going viral. It cares about **lasting**. A message sealed in EterniCapsule might not be opened for 5 years. That's the point.

---

## How Pyadra Actually Works (Today)

> This section describes the real user experience as of July 14, 2026. If you enter pyadra.io right now, this is what happens.

### The Journey: Visitor → Observer → Explorer

**1. Entrance: Home Page (`/`)**

Three seconds of black — the curtain rises. Then a radically minimal room: the symbol, the PYADRA wordmark, the tagline, one "Join" button. Nothing else.

Quietly, you become a numbered **Observer** — an admission ticket appears at the bottom-left (`Observer № #0042 · Admitted`). It isn't a username you chose; it's your permanent number in the archive, kept by your own browser. No IP stored, no tracking.

**2. Exhibitions Hall (`/exhibitions`)**

Three exhibitions: **Galaxy** (active — 4 live projects), **Jungle** and **City** (forming).

**3. Inside Galaxy (`/exhibitions/galaxy`)**

An orbital field: four floating, magnetic spheres around a central emerald gem. Each sphere carries five lines — type, name, subtitle, proof, opportunity. One click goes straight into the project. The gem is the door to the museum shop (`/store`).

- **Orbit 77** — podcast, `Open for support`
- **EterniCapsule** — digital vault, `Open for acquisition`
- **Figuitoon** — custom 3D figurines, `Available to acquire`
- **Kangaroo Cleanup** — Sydney cleanup business, `Looking for a partner`

**4. Individual Projects**

Each is a full dashboard (light museum style) with proof, honest risks, deal options and a founder with a face:

- **EterniCapsule** (`…/ethernicapsule`) — write a message, pick its opening date, pay $9 AUD, receive 128-bit keys by email. Time-vault capsules unlock for a guardian on the chosen day. Sale: Operator $4k / Owner $8k / offer.
- **Orbit 77** (`…/orbit`) — 10 episodes live; Season 2 funding ($10,000 AUD goal, live progress). Six contribution layers $10–$1,000+; supporters get a permanent credential (O77-S1-XXXXXX) and an archive page.
- **Figuitoon** (`…/figurines`) — showcase + project sale ($11,500 launch price); figurines sell on its own Shopify.
- **Kangaroo Cleanup** (`…/kangaroo-cleanup`) — real business handover, $5k–$12k + revenue share, verifiable 5.0 reputation.

**5. The Museum Shop (`/store`)** — Pyadra's own books and editions, reserve-by-email today.

### Technical Reality Check

**Live**: pyadra.io (production on Vercel, `main` auto-deploys behind a 22-check smoke gate)
**Database**: Supabase PostgreSQL — 4 tables, one per concern, RLS closed (see `supabase/README.md`)
**Payments**: Stripe (live mode, signature-verified webhook) · **Email**: Resend · **Animations**: Framer Motion (no Three.js — the capsule and spheres are CSS/Motion)
**Editable without deploys**: `pyadra_settings` (goals, counts)

---

## Technical Philosophy

### Stack Choices (Why These?)

**Next.js 16 + React 19**: Because we need SSR for SEO + client interactivity for rich experiences  
**Supabase PostgreSQL**: Managed database with Row Level Security. Not trendy, but reliable.  
**Framer Motion + CSS**: All the "3D" (the capsule, the spheres) is pure CSS/Motion — Three.js was removed in July 2026 as unused weight. Depth comes from craft, not from WebGL.  
**Stripe**: Industry standard payments. No crypto (yet).  
**Vercel**: Serverless deployment, edge functions, zero DevOps overhead  

**Monolith over microservices**: One codebase, shared database. Faster iteration, simpler architecture. You're not Netflix - you don't need microservices.

### Performance Requirements

- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s  
- Time to Interactive < 3s
- 60fps animations (no jank)
- Mobile-first (but desktop optimized)

### Code Standards

- TypeScript everywhere (no `any` types)
- Server components by default, client only when needed
- Tailwind for styling (utility-first, fast iteration)
- Zero build warnings (treat warnings as errors)

---

## What Pyadra Is NOT

❌ **A landing page builder** - We don't have "Sign up" forms or hero sections  
❌ **A social network** - No feeds, likes, followers, viral loops  
❌ **A no-code tool** - Everything is custom-built, intentional  
❌ **A startup seeking PMF** - We're not pivoting based on metrics  
❌ **A SaaS product** - We're experiments, experiences, projects  
❌ **For everyone** - And that's okay. Pyadra is for people who want something different.

---

## Where We're Going

Pyadra evolves through **three distinct phases**:

### Phase 1: Experiencia (Experience) — 2026 [IN PROGRESS]

**Identity:** Digital Museum  
**For whom:** Observers (individuals experiencing Pyadra)  
**Philosophy:** "What you leave here matters" - permanence, intention, beauty

**What it is:** Pyadra operates as a **digital museum** where projects are permanent, ritualistic, and built to last. Observers participate in experiences and purchase products within Galaxy exhibition.

**Current status (July 14, 2026):**
- ✅ Live in production at pyadra.io — all four project dashboards, the store, and the museum layer
- ✅ Payment processing active (Stripe live mode)
- ✅ Legal entity established (Pyadra LLC, Delaware) + accurate Privacy/Terms
- ✅ Documentation fully reconciled with production (see `docs/pyadra_obsidian/` — Company_Master v3.0 is the operational source of truth)

**Active projects (Galaxy):**
- Orbit 77 (podcast + supporter funding — contribution, not for sale)
- EterniCapsule (time-locked messages — for acquisition)
- Figuitoon (custom 3D figurines — sells on its own Shopify; project for sale)
- Kangaroo Cleanup (Sydney cleanup business — handover deal)

**Business model:** product sales + participation deals (see [[Company_Master]] §10 for the full model: 1–5% permanent stake, transaction fee, valuation methods)

**Q3 2026 priorities:**
- Close the FIRST participation deal (Kangaroo Cleanup)
- First EterniCapsule sale · Orbit Season 2 funding milestones
- EterniCapsule client-side encryption (make the zero-knowledge promise true)

**Goal:** Prove we can build beautiful, permanent digital experiences people pay for — and close the first deal.

---

### Phase 2: Ecosistema (Ecosystem) — 2027

**Identity:** Emotional Marketplace  
**For whom:** Creators (building projects) + Participants (acquiring projects)  
**Philosophy:** "Projects as acquirable digital assets" - ownership, investment, stakes

**What it is:** Pyadra shifts from **museum** to **marketplace**. External creators submit projects. Participants can acquire complete projects (100%) or percentage stakes (90%, 70%, 40%). Original creators retain perpetual royalties regardless of ownership changes.

**How acquisition works:**
1. Creators submit projects to Jungle/City exhibitions
2. Pyadra curates for ceremonial quality
3. Participants acquire ownership stakes
4. Original creator retains minimum % + perpetual royalties
5. Project can be resold, creator still receives royalties

**Example:** Creator A submits project → Participant B acquires 90% → Creator A keeps 10% + gets royalties from B's revenue → B sells 90% to C → Creator A still receives royalties.

**New exhibitions:**
- **Jungle** (organic growth, collaborative chaos) - Target: Q4 2026 or Q1 2027
- **City** (urban experiences, synchronized experiences) - Target: 2027-2028

**Business model:** Acquisition fees + transaction royalties + potential ecosystem retention fee (TBD)

**Technical requirements:**
- Creator onboarding system
- Project acquisition marketplace
- Royalty distribution infrastructure
- Multi-creator governance tools

**Goal:** Can external creators build within our standards? Can projects be valuable enough to acquire?

---

### Phase 3: Economía (Economy) — 2028+

**Identity:** Creative Economy  
**For whom:** Token holders (governance participants)  
**Philosophy:** Decentralized creative economy with Pyadra as infrastructure

**What it is:** Pyadra launches blockchain tokenization. Participants acquire ecosystem stakes via tokens. Pyadra Credits serve as internal bridge currency before full tokenization.

**How it works:**
- **Pyadra Credits** (internal) — Earned through participation, spent on projects
- **Pyadra Token** (blockchain) — Tradeable stake in entire ecosystem
- Token holders vote on exhibition curation
- Staking rewards for long-term participants
- Creators launch projects with token-based funding

**Business model:** Token appreciation + transaction fees + creator launchpad fees

**Technical requirements:**
- Smart contract infrastructure
- Token economics design
- Wallet integration
- Governance voting system
- Credits → Token bridge

**Goal:** Can the ecosystem sustain itself without Pyadra as central authority?

---

### Timeline Summary

**2026:** Polish Galaxy. Optimize design + UX. Build initial Observer community (50 → 500 observers).  
**2027:** Open to external creators. Launch Jungle exhibition. Begin City planning.  
**2028+:** Full tokenization. Pyadra becomes a self-sustaining creative economy.

### Open Strategic Questions (As of May 2026)

**Important:** Pyadra's identity evolves across phases - this is intentional, not a pivot. The three models (Museum → Marketplace → Economy) coexist and complement each other.

Phase 2/3 concepts are **experimental and subject to change**:
- Should ALL projects be acquirable, or only certain ones?
- Should Pyadra take ongoing fees (e.g., 5% of revenue) or only acquisition transaction fees?
- Should projects remain in Pyadra ecosystem after acquisition, or be fully extractable?
- Should ownership be fractional (70%, 40%, etc.) or complete transfer only?
- Should blockchain/tokens be core to Phase 3 or optional infrastructure?

**Current thinking:** Still exploring. See ROADMAP.md and changelog for evolving answers.

---

## Success Metrics

Pyadra doesn't measure success in typical ways. Here's what matters:

### Quantitative (but not primary)
- Observer retention (do they come back?)
- Completion rates (do they finish experiences?)
- Revenue (can this sustain itself?)

### Qualitative (primary)
- Do people remember the experience?
- Do they tell others organically?
- Do they feel something (wonder, curiosity, permanence)?
- Would they engage with another project?

**If someone uses Pyadra and says "that was different" - we succeeded.**

---

## For Developers / AI Agents

### Before Writing Code

1. Read this document (the philosophy)
2. Read `docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md` — the operational source of truth (rules, model, museum layer)
3. Read the project's own doc in `docs/pyadra_obsidian/Pyadra/04_Projects/` — its COPY DECK is the verbatim source for every visible string
4. Check `/ARCHITECTURE.md` for the technical map and `supabase/README.md` for the database

### When Building

**Ask yourself:**
- Does this feel intentional or generic?
- Does this invite creation or passive consumption?
- Is this beautiful enough to ship?
- Does it respect people's time and attention?
- Would someone remember this?

**If unsure:**
- Look at EterniCapsule (it's the gold standard)
- Check existing patterns before inventing new ones
- When in doubt, do less (remove, don't add)

### Common Pitfalls to Avoid

1. **Making it feel like a normal web app** - Add conventional UX patterns
2. **Over-explaining** - Writing long instructions/descriptions
3. **Generic copy** - Using "Sign up", "Get started", "Learn more"
4. **Performance sacrifices** - "We'll optimize later" (no, optimize now)
5. **Feature creep** - Adding things not in the vision
6. **Trendy tech** - Using new frameworks just because they're new

---

## Terminology & Glossary

Pyadra uses specific terminology intentionally. Here's what each term means:

### Core Terms

**Observer** (PRIMARY)
- Who: Anyone who visits the Pyadra home — every visitor receives a numbered admission ticket
- Identity: Assigned unique number (#0001, #0002, etc.) — Pyadra's quiet signature
- Context: Phase 1 identity - experiencing the museum
- Technical: Row in `pyadra_observers` + kept in the visitor's localStorage. No IP stored.

**Participant** (PHASE 2+)
- Who: Observers who engage deeper - acquire projects, support creators, become stakeholders
- Context: Phase 2+ identity - active in marketplace/ecosystem
- Relationship: All Participants are Observers, not all Observers are Participants

**Creator** (PHASE 2+)
- Who: External builders who submit projects to Pyadra
- Role: Originators of acquirable projects in Jungle/City exhibitions
- Rights: Retain perpetual royalties even after project acquisition

**Stakeholder** (PHASE 2+)
- Who: Participants who own stakes in ecosystem projects
- Ownership: Can hold fractional (40%, 70%, etc.) or complete (100%) ownership
- Context: Phase 2 acquisition model

**Builder**
- Philosophical term: Anyone creating something that lasts in Pyadra
- Used in copy: "For builders, not consumers"
- Not a technical role

### Discouraged Terms

**❌ User** - Too transactional, implies passive consumption  
**❌ Customer** - Reduces to commerce, misses ceremonial nature  
**❌ Member** - Implies gated community, wrong vibe  

### When to Use Which

- **Documentation**: Use "Observer" for Phase 1, "Participant" for Phase 2+
- **UI Copy**: Use "Observer" consistently (your Observer ID, Observer #0001)
- **Strategic docs**: Use "Participant" when discussing acquisition/ecosystem
- **Code**: Variable names use `observer` (observerId, observer_id, etc.)

---

## Frequently Asked Questions

**Q: Who is Pyadra for?**  
A: People who want digital experiences that feel permanent, intentional, beautiful. People tired of infinite scroll and engagement bait.

**Q: How do you make money?**  
A: Product sales (EterniCapsule $9 AUD per capsule, Figuitoon $49 AUD per figurine on Shopify, Orbit 77 supporter contributions) plus participation deals — when a project deal closes, Pyadra keeps a small permanent stake and a transaction fee (see Company_Master). No ads, ever.

**Q: Why "Observer" instead of "User"?**  
A: Because you're not consuming a product. You're a builder - someone who creates, contributes, and helps others. What you build here becomes part of something that lasts. Language shapes experience.

**Q: Do I have to do anything to become an Observer?**  
A: No. Walking in is the initiation — every visitor to the home receives their numbered ticket automatically, and keeps that number forever.

**Q: Will there be a mobile app?**  
A: Maybe, but the web experience is the primary platform. PWA might make sense.

**Q: Why no crypto/blockchain?**  
A: Phase 1 doesn't need it. Phase 3 (2028+) may introduce tokenization for ecosystem governance and project stakes. See "Where We're Going" section.

**Q: Can other people build on Pyadra?**  
A: Eventually. Once the vision is proven, an API for creators makes sense.

---

## Final Thoughts

Pyadra is an **experiment in intentional digital experience design**.

It rejects the idea that everything online must be viral, fast, and optimized for engagement. It embraces mystery, permanence, beauty, and intention.

**If you're building on Pyadra:**
- Move deliberately
- Build projects, not features
- Respect attention
- Make it beautiful
- Make it last

**Welcome. What you leave here matters.**

---

Last updated: July 14, 2026 (reconciled with production; operational truth lives in `docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md`)  
Next review: Before Phase 2 planning (Q4 2026)
