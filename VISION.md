# Pyadra: The Vision

> **Start here.** This document explains what Pyadra is, why it exists, how it wants to feel, and where it might go. Read it before touching any code.
>
> It is the *philosophy* document. The operational source of truth — rules, business model, verified current state — is [`docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md`](docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md). If the two ever disagree about a fact, Company_Master wins and this document gets fixed.

---

## What Pyadra Is

**Pyadra creates, develops and collaborates to turn ideas into real projects — and then looks for the people who want to acquire them, operate them, support them, work on them, or carry them forward.** *(Business definition confirmed by Eduardo, September 19, 2026.)*

Said the way the site says it: *Pyadra is where projects and ideas find the people who make them real.* You can enter with money, with work, or with skills.

### Where the museum fits

The idea of a museum inspired how Pyadra looks and feels: you walk through **exhibitions**, each project stands in its own room with its proof and its risks, there is a museum shop, every visitor gets an admission number, and the founder has a room of his own. That experience is deliberate and it stays.

But the museum is **how Pyadra presents projects, not what Pyadra is as a business**. When you explain Pyadra to someone who might buy, run, fund, join or continue a project, start from the business definition above — not from the metaphor. (How we got here is in [How the idea evolved](#how-the-idea-evolved) at the end.)

**Pyadra is a startup** (owner, September 22, 2026) — that is how it describes itself, on `/exhibitions` and anywhere else. Being a startup is not a licence to chase vanity metrics; the design principles below still hold.

### The core emotion

Pyadra exists to create **pertenencia** (belonging).

The people who arrive at Pyadra are not consumers. They are **builders** — people with an idea, a skill, some capital or simply the will to carry something forward, who want to be part of something real.

---

## Words Pyadra Uses About Itself

- **"Discover. Connect. Build. Buy."** — **the tagline** (owner decision, September 22, 2026). Live on the home page and in the site metadata since July 2, 2026; use it in new material.
- **"Lo que dejas importa."** *(What you leave behind matters.)* — the founding motto, kept. It closes the Manifesto and these docs. It is not marketing copy: it is the question behind every design decision — *does the person feel that what they left behind matters?*

---

## Why Pyadra Exists

Most platforms only understand money. Pyadra understands that work, skills, and belief in a project are also capital. That changes who can participate — and how far a project can go.

And most digital products are optimized for conversion rates, engagement metrics, retention loops and growth hacks. Pyadra rejects that way of building. It wants every project and every page to feel:

- **Permanent** — like stone inscriptions, not disposable tweets
- **Intentional** — actions with weight, not mindless scrolling
- **Mysterious** — discovery over explanation, invitation over instruction
- **Beautiful** — crafted interfaces that respect your attention

And, since July 2026, **honest** as a hard rule: proof, numbers and risks are shown, and a page never claims what the code doesn't do (Company_Master non-negotiables #10 and #13).

Think of it as the opposite of "move fast and break things." Pyadra moves deliberately and builds things that last.

---

## The Exhibition Structure (the experience layer)

Projects are presented inside **exhibitions** — themed rooms on pyadra.io:

```
┌─────────────────────────────────────────────────┐
│                    PYADRA                        │
├─────────────────────────────────────────────────┤
│  Home → the symbol, one door ("Join")           │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │  EXHIBITION 1: Galaxy — Open              │  │
│  │  "Built projects, ready for their next    │  │
│  │   chapter" · 4 projects                   │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  EXHIBITION 2: Jungle — Forming           │  │
│  │  "Organic growth" · no date committed     │  │
│  └───────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────┐  │
│  │  EXHIBITION 3: City — Forming             │  │
│  │  "Metropolitan scale" · no date committed │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  Also: the Store (museum shop) · the Manifesto · │
│  the founder's room (/eduardo)                   │
└─────────────────────────────────────────────────┘
```

**One site, several rooms — not separate apps.** (Some projects run their product elsewhere — EterniCapsule at eternicapsule.com, Figuitoon on its own Shopify — and Pyadra shows them in their room.)

---

## Design Philosophy

### 1. Every Action Is a Ritual

**Bad**: Click "Submit Form" → Generic success message
**Pyadra**: Complete the action → something is engraved → the archive remembers you

Every interaction should feel **intentional**. Buttons aren't just buttons — they're seals, transmissions, engravings. Copy reflects this: "Lock In Your Frequency" not "Donate", "Seal the capsule" not "Submit".

### 2. Mystery Over Explanation — on the threshold

Don't explain everything upfront at the entrance. No giant hero section saying "Pyadra is a platform that helps you..." The home is a symbol, a wordmark, one tagline, one door — and you walk in.

Inside a project room, plain words win: say what it is, what it has proved, what can go wrong, and how to enter. (Owner feedback in July 2026 drove "plain first" rewrites on every project page — see the copy-deck notes in each project doc.)

### 3. Beauty as Standard

If it's not beautiful, it doesn't ship. There are clear aesthetic rules (Design System v1, July 2026):
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

Pyadra doesn't care about going viral. It cares about **lasting**. A message sealed in EterniCapsule might not be opened for five years. That's the point.

---

## How Pyadra Works Today (September 19, 2026)

> A short tour. The verified detail — statuses, prices, evidence, known defects — lives in Company_Master §9 and §13, so it is kept in one place.

1. **Home (`/`)** — a 2-second dark curtain, then the symbol, the PYADRA wordmark, the tagline and one **Join** button. Quietly, the visitor becomes a numbered **Observer** (`Observer № #0042 · Admitted`), kept in their own browser. No IP stored, no tracking cookies.
2. **Exhibitions (`/exhibitions`)** — "Welcome to Pyadra." and the three rooms: Galaxy (open), Jungle and City (forming).
3. **Galaxy (`/exhibitions/galaxy`)** — four floating spheres around an emerald gem. One click goes straight into a project. The gem is the door to the museum shop.
   - **Orbit 77** — podcast · `Open for support` (contribution, not a sale)
   - **EterniCapsule** — time-locked messages · `Open for acquisition` (the product runs at eternicapsule.com)
   - **Figuitoon** — custom 3D figurines · `Available to acquire` (sells on its own Shopify)
   - **Kangaroo Cleanup** — Sydney cleanup business, paused · `Looking for a partner`
4. **Project rooms** — each is a dashboard with proof, honest risks, the ways in, and a founder with a face.
5. **The Store (`/store`)** — Pyadra's own books, reserve-by-email.
6. **The digital business cards (`/eduardo`)** — where the QR on Eduardo's printed card leads: who he is, what he makes, and how to reach him. Being extended into cards for the whole team (four people), where only the photo, a short description and the role change per person.

Outside the site, **Byndi** (a mobile app for couples) is a Pyadra project in testing; it is not exhibited yet.

**Technology in one line:** Next.js on Vercel, Supabase, Stripe, Resend, Framer Motion — see `ARCHITECTURE.md`.

---

## Technical Philosophy

### Stack Choices (Why These?)

**Next.js 16 + React 19**: SSR for SEO + client interactivity for rich experiences
**Supabase PostgreSQL**: Managed database with Row Level Security. Not trendy, but reliable.
**Framer Motion + CSS**: All the "3D" (the capsule, the spheres) is pure CSS/Motion — Three.js was removed in July 2026 as unused weight. Depth comes from craft, not from WebGL.
**Stripe**: Industry standard payments. No crypto.
**Vercel**: Serverless deployment, zero DevOps overhead

**Monolith first, split when a project earns it**: Pyadra's own pages and most project rooms share one codebase and one database — faster iteration, simpler architecture. A project moves to its own deployment when it needs its own release cycle (EterniCapsule did in August–September 2026). Every project must stay *able* to leave.

### Performance Requirements

- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Time to Interactive < 3s
- 60fps animations (no jank)
- Mobile-first (but desktop optimized)

### Code Standards

See `CONTRIBUTING.md` — TypeScript everywhere, server components by default, Tailwind utility-first, zero build warnings.

---

## What Pyadra Is NOT

❌ **A landing page builder** — no "Sign up" forms, no generic hero sections
❌ **A social network** — no feeds, likes, followers, viral loops
❌ **A no-code tool** — everything is custom-built, intentional
❌ **A SaaS product** — Pyadra builds projects and finds their people; it doesn't rent software
❌ **For everyone** — and that's okay. Pyadra is for people who want something different.

---

## Where We Might Go (long-term direction — proposals, not decisions)

> Everything in this section is **direction**, not a commitment. Only Phase 1 is active. Dates below are old targets from May 2026 and are not scheduled work. The business terms that actually apply today are in Company_Master §10.

### Phase 1: Experiencia (Experience) — 2026 [ACTIVE]

**Identity at the time it was defined (May 2026):** Digital Museum. **Today:** the business definition at the top of this document, with the museum as the experience layer.
**For whom:** Observers, and the people who might acquire, operate, support, work on or continue the projects.

**Status (September 19, 2026):**
- ✅ Live in production at pyadra.io — four project dashboards, the Store, the Manifesto, the founder's room
- ✅ Payment processing (Stripe) for Orbit 77 contributions; EterniCapsule takes payments on its own deployment
- ✅ Legal entity (Pyadra LLC, Delaware) + Privacy/Terms (with known gaps — Company_Master §9)
- ❌ First participation deal — not closed on record
- ❌ First EterniCapsule sale — not evidenced
- ❌ EterniCapsule client-side encryption — not built

**Business model:** participation deals — Pyadra keeps a small permanent stake (1–5%) and a transaction fee when a deal closes (working figures, Company_Master §10). No ads, ever.

**Goal:** Prove that Pyadra can build projects people value — and close the first deal.

---

### Phase 2: Ecosistema (Ecosystem) — plan

**Identity (as proposed in May 2026):** a marketplace where external creators bring projects and participants acquire all or part of them.
**For whom:** Creators (building projects) + Participants (acquiring, operating or supporting them)

**How acquisition could work (proposal):**
1. Creators bring projects to Pyadra (Jungle/City or other exhibitions)
2. Pyadra helps them meet the Project Standard
3. Participants acquire complete projects or stakes
4. The original creator keeps a minimum share and royalties
5. If the project is resold, the creator still receives royalties

**Example:** Creator A brings a project → Participant B acquires 90% → Creator A keeps 10% + royalties from B's revenue → B sells 90% to C → Creator A still receives royalties.

**Would require:** creator onboarding, an acquisition flow, royalty distribution, legal review.

**Goal:** Can external creators build within our standards? Can projects be valuable enough to acquire?

---

### Phase 3: Economía (Economy) — plan

**Identity (as proposed):** a creative economy with Pyadra as infrastructure — Pyadra Credits as an internal bridge, then possibly a token for ecosystem stakes and governance.

**Would require:** token economics, smart contracts, wallet integration, governance, and full legal review in every relevant jurisdiction. No token or equity-for-equity deal happens without it (Company_Master §10).

**Goal:** Can the ecosystem sustain itself without Pyadra as central authority?

---

### Targets recorded in May 2026 (not scheduled)

- **2026:** Polish Galaxy. Build an initial Observer community (50 → 500 observers).
- **2027:** Open to external creators. Launch Jungle.
- **2028+:** Tokenization.

### Open Strategic Questions

Phase 2/3 concepts are **experimental and subject to change**:
- Should ALL projects be acquirable, or only certain ones?
- Should Pyadra take ongoing fees (e.g. 5% of revenue) or only transaction fees?
- Should projects remain in the Pyadra ecosystem after acquisition, or be fully extractable? *(Company_Master already answers part of this: a project can always leave.)*
- Should ownership be fractional or complete transfer only?
- Should blockchain/tokens be core to Phase 3 or optional infrastructure?

The current priorities list lives in Company_Master §14.

---

## Success Metrics

Pyadra doesn't measure success in typical ways.

### Quantitative (but not primary)
- Deals closed (acquire / operate / support / continue)
- Observer retention (do they come back?)
- Revenue (can this sustain itself?)

### Qualitative (primary)
- Do people remember the experience?
- Do they tell others organically?
- Do they feel something (wonder, curiosity, permanence)?
- Would they engage with another project?

**If someone uses Pyadra and says "that was different" — we succeeded.**

---

## For Developers / AI Agents

### Before Writing Code

1. Read this document (the philosophy)
2. Read `docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md` — the operational source of truth (rules, model, the museum layer, current state)
3. Read the project's own doc in `docs/pyadra_obsidian/Pyadra/04_Projects/` — its COPY DECK is the verbatim source for every visible string
4. Check `ARCHITECTURE.md` for the technical map and `supabase/README.md` for the database

### When Building

**Ask yourself:**
- Does this feel intentional or generic?
- Does this say plainly what's real — and nothing that isn't?
- Is this beautiful enough to ship?
- Does it respect people's time and attention?
- Would someone remember this?

**If unsure:**
- Look at the Kangaroo Cleanup dashboard — the reference pattern for project rooms
- Check existing patterns before inventing new ones
- When in doubt, do less (remove, don't add)

### Common Pitfalls to Avoid

1. **Making it feel like a normal web app** — conventional UX patterns everywhere
2. **Over-explaining at the threshold** — long instructions on the home
3. **Generic copy** — "Sign up", "Get started", "Learn more"
4. **Performance sacrifices** — "we'll optimize later" (no, optimize now)
5. **Feature creep** — adding things not in the vision
6. **Trendy tech** — using new frameworks just because they're new
7. **Claims the code doesn't keep** — the page never promises what isn't built (Company_Master #13)

---

## Terminology & Glossary

### Core Terms

**Observer**
- Who: Anyone who visits the Pyadra home (or the founder's room) — every visitor receives a numbered admission ticket
- Identity: A unique number (№ 0001, № 0002, …) — Pyadra's quiet signature
- Technical: Row in `pyadra_observers` + kept in the visitor's localStorage. No IP stored.

**Participant**
- Who: Someone who enters a project — acquires it, operates it, supports it, works on it or carries it forward (Company_Master §3)
- Relationship: All Participants are Observers, not all Observers are Participants

**Creator / Founder**
- Who: The person behind a project. Today every exhibited project was built with Pyadra; external creators arrive in Phase 2.
- Rights (Phase 2 proposal): keep a share and royalties after acquisition

**Stakeholder** (Phase 2+)
- Who: Participants who own stakes in projects

**Builder**
- Philosophical term: anyone creating something that lasts — "for builders, not consumers"
- Not a technical role

### Discouraged Terms

**❌ User** — too transactional, implies passive consumption
**❌ Customer** — reduces the relationship to commerce
**❌ Member** — implies a gated community

### When to Use Which

- **UI Copy**: "Observer" for visitors (your Observer №)
- **Business conversations**: say what the person can do — acquire, operate, support, work on, carry forward
- **Code**: variable names use `observer` (observerId, observer_id, etc.)

---

## Frequently Asked Questions

**Q: What does Pyadra actually do?**
A: It turns ideas into real projects — building them itself or together with others — and then finds the people who will acquire, run, support, work on or continue them. The museum is how those projects are shown.

**Q: How does Pyadra make money?**
A: Through participation deals: when a deal closes, Pyadra keeps a small permanent stake and a transaction fee (working figures in Company_Master §10). No deal has closed on record yet. Each project also has its own product (capsules, figurines, podcast support, books); how that product money is attributed between Pyadra and each project is still an open question. No ads, ever.

**Q: Why "Observer" instead of "User"?**
A: Because you're not consuming a product. You arrived at a place that keeps your number. Language shapes experience.

**Q: Do I have to do anything to become an Observer?**
A: No. Walking in is the initiation — every visitor to the home receives a numbered ticket automatically.

**Q: Will there be a mobile app?**
A: Pyadra itself is web-first. Byndi, one of Pyadra's projects, is a mobile app (in testing).

**Q: Why no crypto/blockchain?**
A: Phase 1 doesn't need it. Phase 3 may introduce tokenization — only with full legal review.

**Q: Can other people bring their projects?**
A: Yes, as a conversation today — the "Bring your idea" button on every page. A formal process is Phase 2.

---

## How the idea evolved

*History, kept so nobody mistakes an old version for current instructions. Dates come from the git history of this repo and the owner's statements.*

| When | What Pyadra said it was |
|---|---|
| Up to early April 2026 | "Like a physical museum with themed exhibitions" — the museum as the organizing idea, with a ceremonial, archaeological aesthetic (dark backgrounds, gold accents). |
| April 12, 2026 | The museum metaphor was removed from the docs: Pyadra as "a ceremonial space for participation", centred on belonging (*pertenencia*). |
| May 7, 2026 | The museum returned as the **Phase 1 identity** ("Digital Museum"), with a planned path Museum → Marketplace → Economy. |
| June 2026 | Company_Master v2: Pyadra redefined as "where projects and ideas find the people who make them real" — money, work and skills as capital; project types; participation modes; the Store as the "museum gift shop". |
| July 2026 | Light museum design system; a radically minimal home; the tagline "Discover. Connect. Build. Buy." on the home; Company_Master v3 named the site's own pieces "the museum layer". The README described Pyadra as "a digital museum where real projects live". |
| September 19, 2026 | **Owner clarification:** Pyadra creates, develops and collaborates to turn ideas into real projects, and looks for people to acquire, operate, support, work on or continue them. The museum stays as the inspiration for the site's visual experience but no longer defines, on its own, the commercial explanation of the business. |

---

## Final Thoughts

Pyadra is an **experiment in building real projects — and presenting them honestly and beautifully**.

It rejects the idea that everything online must be viral, fast, and optimized for engagement. It embraces permanence, beauty, honesty and intention.

**If you're building on Pyadra:**
- Move deliberately
- Build projects, not features
- Respect attention
- Say only what's true
- Make it beautiful
- Make it last

**Welcome. What you leave here matters.**

---

Last updated: September 22, 2026 (business definition confirmed by the owner; museum re-scoped as the experience layer; history separated from current state; tagline and "startup" decided). Operational truth lives in `docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md`.
Next review: before Phase 2 planning.
