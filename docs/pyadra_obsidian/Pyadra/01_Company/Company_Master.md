---
tags: [pyadra, master, company, core]
created: 2026-06-08
version: 4.1
status: active
updated: 2026-09-22
---

# PYADRA — Company Master Document

> [!important] Read this first
> This is the operational source of truth for Pyadra as a company: what it is, how it works, the rules, and its verified current state. Any person or AI working with Pyadra must read it before touching any UI, code, copy, or decision.
>
> **Where everything else lives (one place per topic):**
> - Philosophy, long-term direction and the history of the idea → `VISION.md` (repo root)
> - Technical map, routes, environments, known technical defects → `ARCHITECTURE.md` (repo root)
> - Database ownership and migrations → `supabase/README.md`
> - Each project's detail, deal terms and copy deck → its doc in `04_Projects/`
> - How to work on the codebase → `CONTRIBUTING.md` (repo root)

---

## 0. HOW TO READ STATUS IN THESE DOCS

_New in v4.0. Every status claim in Pyadra's docs should carry one of these labels, or make its evidence obvious. The same legend applies to every project doc._

|Label|Means|Typical evidence|
|---|---|---|
|**Implemented**|The code exists|File + commit in a repo|
|**Deployed**|It is live on the public site / API|A dated read-only check of the public URL|
|**Verified in real use**|Real people, money or operations used it|Public third-party profile, paid records, signed documents — cited|
|**Owner decision**|Eduardo decided it|Date + where it was stated|
|**Plan**|Intended, not done|Roadmap item|
|**Open proposal**|A draft or idea awaiting a decision|Marked "draft" / "proposal"|
|**Unverified**|Claimed, but not checkable from the repos or the public site|Marked ⚠|

**Evidence rules:**

- Code proves an implementation. It does **not** prove sales, ownership, commercial agreements, or what is deployed.
- A recent date, a commit message or a code comment does not prove a claim is correct.
- When something cannot be verified, it is marked — never deleted to hide a gap, and never "resolved" by inventing a figure, price, agreement, owner or date.
- A code defect is recorded as a defect to fix — never reinterpreted as a business decision.

---

## 1. WHAT IS PYADRA

**The business (confirmed by Eduardo, September 19, 2026):** Pyadra creates, develops and collaborates to turn ideas into real projects — and then looks for the people who want to **acquire** them, **operate** them, **support** them, **work on** them, or **carry them forward**.

Pyadra is a startup (owner, September 22, 2026) — it says so on `/exhibitions` and may say so anywhere.

The line the site uses for the same idea (site title and Manifesto): _Pyadra is where projects and ideas find the people who make them real._ Contribute with money, work, or skills. Own a part of something that matters. Grow together.

> [!important] The museum is the experience — not the business definition
> The idea of a museum inspired how pyadra.io looks and feels: exhibitions, rooms, a museum shop, an admission ticket, a founder's room. That language stays as the site's visual and experiential layer (§9, §12). It no longer defines, on its own, how Pyadra explains itself commercially. When describing the business to a buyer, operator, partner, supporter or collaborator, lead with the business definition above; the museum is how the projects are presented, not what Pyadra sells. How this evolved: `VISION.md` → "How the idea evolved".
>
> This clarification updates how the business is described. It does not, by itself, change the website's design or features.

**Tagline and motto (as live on September 19, 2026):**

- `Discover. Connect. Build. Buy.` — **the tagline** (owner decision, September 22, 2026). Live on the home, the home curtain and the site metadata since July 2, 2026 (commit `b7e7d46`). Use it for documents, printed material and new pages.
- `Lo que dejas importa.` _(What you leave behind matters.)_ — the founding motto, kept: the `/manifesto` plaque and the closing line of the root docs.

**Name origin:** Pyada (pawn in Hindi) + RA (path in Latin) = PYADRA. Born from a chess game and a moment of clarity. Every person is a pawn that can become a queen. The path is Pyadra.

**Legal entity:** Pyadra LLC — registered in Delaware, United States (owner statement, June 2026). The name "Pyadra LLC" appears publicly on `/eduardo` and in its vCard; `/legal/terms` names Delaware law but only "Pyadra". The registration itself was not checked in this audit.

---

## 2. WHY IT EXISTS

Most platforms only understand money. Pyadra understands that work, skills, and belief in a project are also capital.

That changes who can participate and how far a project can go.

Technology is advancing fast. Most people feel left out — they have ideas, skills, or drive but no clear way to participate in something real.

Pyadra exists to change that. You don't need to be a developer. You don't need to be an investor. You need belief and something to contribute.

---

## 3. WHO IT'S FOR

**The Founder** Has a real project or a bold idea. Needs the right people to make it grow — not just buyers, but believers. Wants partners, operators, builders, and investors who care about the project, not just the return.

**The Builder** Has skills, work capacity, or time. Wants a real project where their contribution has value and earns them real participation. Does not need capital to enter — their work is their capital.

**The Investor** Has capital and wants to put it into something real and validated. Not ideas. Not mockups. Projects with proof, with history, with a person behind them. Wants participation, not just a transaction.

**What people can do with a Pyadra project — and where that exists today:**

|They want to…|Mode (§5)|Live today (September 19, 2026)|
|---|---|---|
|Acquire it|Money|EterniCapsule and Figuitoon pages ("Open for acquisition" / "Available to acquire")|
|Operate it|Work (+ money)|Kangaroo Cleanup handover deals; EterniCapsule's "Operator" option|
|Support it|Money as a contribution — no ownership|Orbit 77 contribution layers|
|Work on it|Work / Skills|Only as a conversation: the `/eduardo` door "You are good at something" and the nav's "Bring your idea". No live project offers a published work-for-participation option yet.|
|Carry it forward|Any of the above, as a successor|Kangaroo Cleanup (relaunch by a new operator); Figuitoon's planned handover — see its doc|

The **collaboration** side of the business (other people's ideas) currently exists only as the "Bring your idea" dialog in the site nav (Implemented, Deployed). A formal onboarding for external founders is Phase 2 (§10) and is not built.

---

## 4. THE THREE TYPES OF PROJECTS

Every project on Pyadra has a type. The type describes how the project exists in the world — not its technology, not its stage, but its nature.

---

**LOCAL** The project is anchored to a specific place. Its core operation requires physical presence in a territory, city, or region. It may have digital channels, social media, or a website — but its value and operation are local. A new participant must be present in that place to make it work.

> [!example] Example: [[Kangaroo_Cleanup]] Operates in Sydney, Australia. Requires a vehicle and local presence. Has website and social media but the business is physical at its core.

---

**GLOBAL** The project lives and operates on the internet. No geographic limits. No physical presence required. Anyone from anywhere can participate, operate, or grow it.

> [!example] Example: [[EterniCapsule]] Digital product accessible worldwide. Built inside Pyadra; since August 26, 2026 it runs as its own deployment at eternicapsule.com, still on accounts Pyadra controls (same Vercel team, Supabase project, Stripe account and Resend account). No physical component.

---

**GLOCAL** The project has a global digital presence but also produces, delivers, or operates something physical in the real world. It combines both worlds — the reach of the internet and the reality of a physical product or service.

> [!example] Example: [[Figuitoon]] Global ecommerce store. Physical 3D printed product shipped to customers. Operates from anywhere but delivers everywhere.

> [!example] Example: [[Orbit77]] Global podcast on YouTube and Spotify. Physical merchandise and events possible. Content is digital, community can be physical.
> Orbit 77 is GLOCAL (owner decision, September 22, 2026). Orbit's own page said `Global · Podcast Archive`; it was corrected to `Glocal · Podcast Archive` in the same pass.

---

> [!important] Key principle Every project must be able to exist and operate independently of Pyadra. Pyadra is the space. The project is the protagonist. **The project can always leave and live elsewhere** — that possibility is never removed.
>
> However, a project may _choose_ to stay hosted on Pyadra's infrastructure when it is built on it. Staying hosted is an **option agreed between Pyadra and the project's owner**, never an imposition. The right to leave always remains; hosting is a convenience that can be negotiated, priced, and ended. In short: leaving is always possible; staying is a deal, not a lock-in.
>
> Worked case: [[EterniCapsule]] was built on Pyadra's infrastructure. It now deploys on its own but still uses accounts Pyadra controls — so what "hosted" means in its deal options is an open owner question (see its doc).

---

## 5. MODES OF PARTICIPATION

Every project on Pyadra defines which modes of participation are available. Not all modes apply to every project.

A mode of participation describes: → What the person contributes → What they receive in return → What role they take in the project

---

**MONEY** The participant contributes capital. They receive a percentage of the project proportional to the agreed valuation. They may or may not operate the project — that depends on the specific deal.

---

**WORK** The participant contributes their time, skills, or execution capacity. Their work is their capital. They receive a percentage of the project in exchange for what they build or operate.

Examples of work contributions: → Operating a local business day to day → Producing content for a podcast → Developing technology or features → Running marketing and growth → Managing operations or logistics

---

**SKILLS** The participant contributes a specific expertise that the project needs to grow. This can be combined with money or work.

Examples of skill contributions: → Design and brand → Legal and financial structuring → Sales and distribution networks → Technical development → Industry knowledge and connections

---

**How modes are defined per project:** Each project document specifies which modes are available and under what terms. The combination of mode + percentage + conditions is called a **Participation Option**. Every project has at least one Participation Option.

> [!note] A contribution is not a mode of ownership. Orbit 77's supporters give money and receive recognition only — no percentage, no return (see [[Orbit77]]). This "contribution" case is not yet covered by the business model in §10 — see the open proposal there.

---

## 6. THE PYADRA PROJECT STANDARD

Every project exhibited on Pyadra — whether from the founder or from an external creator — must meet the Pyadra Project Standard.

This is Pyadra's quality filter. It is what separates Pyadra from every other platform.

> [!warning] Non-negotiable A project that does not meet the standard is not exhibited. No exceptions.

---

**What the standard requires:**

```
1. IDENTITY
    Name, type, exhibition, status,
    founder, tagline, what it is in 2 lines,
    who it speaks to, why it exists on Pyadra

2. CONTEXT AND HISTORY
    Origin, why it exists, current status,
    preferred language, participant profiles

3. DESIGN AND EXPERIENCE
    How it looks in its own world
    How Pyadra's design system applies to it

4. ARCHITECTURE
    Independence from Pyadra
    Relationship with Pyadra infrastructure

5. METRICS AND NUMBERS
    Real, verifiable, with honest disclaimers
    No hardcoded or inflated figures

6. ASSETS
    What is included · What is not included
    What needs to be confirmed

7. PROOF OF WORK
    Real evidence — public vs private
    Verifiable today, not just claimed

8. OPERATION
    How it works · What a new participant needs
    Expansion opportunities

9. RISKS
    Operational · Legal · Transfer · Financial
    Full transparency — no hidden risks

10. PARTICIPATION OPTIONS
    Each option with mode, percentage,
    price or equivalent, and conditions

11. DUE DILIGENCE
    Private checklist for serious participants
    Not shown publicly

12. CURRENT STATE AND ROADMAP
    What works · What's missing · Next steps
    Each claim labelled per §0

13. SALE — COPY AND CONVERSION
    Hook · Buyer journey · CTAs by stage · Urgency

14. COPY DECK — LOCKED STRINGS
    Every visible string on the page, verbatim.
    Numbers have ONE canonical source (the metrics
    section); all other mentions point to it.
```

> [!important] The Copy Deck method and the truth hierarchy (learned June–July 2026; unified in v4.0)
> Each project document includes a COPY DECK — every visible string on its page, verbatim, covering every surface (nav badge, dialogs, drawers, micro-strings, post-flow pages). Every NUMBER lives in ONE canonical place (the metrics section); the deck and prose point to it.
>
> Two roles, one rule — this replaces the older wording "if code and deck disagree, the deck wins":
> 1. **Authoring.** New or changed copy is written in the deck first, then built. Builders (human or AI) copy strings verbatim and never improvise copy in code.
> 2. **Record.** The live page is the record of what visitors actually see. When the deck and the live page disagree, reconcile the same day: the deck is updated to record the live string. If the live string is false or outdated, the deck records it, marks it ⚠, and the page is corrected in code — never the other way round (non-negotiable #13).
> 3. The project doc remains the source for everything the page doesn't show (deal terms, due diligence, private valuations, history) — with its evidence labelled per §0.
>
> See [[Kangaroo_Cleanup]] for the most complete worked example.

---

> [!note] The Project Standard as a service When a founder comes to Pyadra with their project, Pyadra helps them complete this document. That is a service Pyadra offers. That is part of how Pyadra creates value.

See template: [[Project_Standard_Template]]

---

## 7. THE EXHIBITION SYSTEM

**Navigation structure:**

```
HOME
  ↓
EXHIBITIONS PAGE
  → Shows all active exhibitions
  → Does not show individual projects
  → Each exhibition: name, theme, one button
  ↓
EXHIBITION PAGE (e.g. Galaxy)
  → Shows project cards of that exhibition
  → Each card: minimum information + one button
  ↓
PROJECT DASHBOARD
  → Full detail · Participation options
  → Proof · Risks · Where decisions are made
```

> [!important] Key rule The Exhibitions page shows exhibitions — not projects. Projects only appear inside their exhibition. A visitor never sees a project without first entering its exhibition.
>
> **Accepted exception (owner, September 22, 2026):** the team's digital business cards (`/eduardo`, §9) list the projects directly. They are personal cards handed over in person, not an entrance to the museum.

---

**Current exhibitions (live strings on `/exhibitions`, September 19, 2026):**

- **[[Galaxy]]** — Open · `Built projects, ready for their next chapter` · `4 active projects`
- **Jungle** — Forming · `Organic growth` · shown as `Sealed`
- **City** — Forming · `Metropolitan scale` · shown as `Sealed`

_History: until v3.1 this doc described Galaxy's theme as "memory, time, permanence"; the page has used the line above since at least July 2026._

---

**What each level shows:**

EXHIBITIONS PAGE → Exhibition name → Exhibition theme in one line → Number of active projects → One button → Enter exhibition

EXHIBITION PAGE (e.g. [[Galaxy]], v4 July 2026) → Project spheres with exactly 5 elements each:

- Type chip: `{Scope} · {Kind}` (e.g. `Glocal · Podcast`)
- The sphere itself (the whole sphere is the link — no separate button)
- Project name
- Subtitle + proof line (numbers must match the project doc's canonical metrics)
- Opportunity line (e.g. `Open for support` / `Looking for a partner`)

PROJECT DASHBOARD → Everything — full detail, proof, risks, participation options, due diligence process

**What a project sphere never shows (decided with Galaxy v4):**

- Valuation figures — value narratives live on the project page only
- Full asset list
- Risks
- Deal details
- Private information

---

## 8. THE PYADRA STORE

The Pyadra Store is not a project. It is Pyadra's own native space for products created under the Pyadra brand.

Think of it as the museum gift shop — the visitor experiences the exhibition and can take something home.

**What lives in the Pyadra Store:**

- Books written or curated by Pyadra
- Digital editions and collectibles
- Exclusive Pyadra-branded content
- Any product that belongs to Pyadra as a brand, not to an individual project

**What does not live in the Pyadra Store:**

- Products from individual projects (those live in each project's own world)
- Third-party products not created by Pyadra

> [!important] The Pyadra Store is not part of Galaxy or any Exhibition. It does not have a project dashboard. It is a direct store — browse, take something home, done. Its _entrance_, however, lives at the center of Galaxy: the emerald gem (hover: "The museum shop →") plus the nav link `Store` and the direct URL `/store`.

**Current state (Deployed — checked September 19, 2026):** live at pyadra.io/store since June 13, 2026. Two digital books, both marked `In the making` with `Price on release`: "The Path of the Pawn" (Eduardo's life as a fable) and "Tales from the Back Seat" (mystery tales from the Uber night shift). The only action is `Reserve your copy →`, a mailto to pyadra@pyadra.io — no payment is wired. The chips under `The shelf grows with the museum` (T-shirts, Prints, Pens, Collector editions, Audio tales) are ideas shown on the page, not products. Products are an editable array in `src/app/store/page.tsx`.

---

## 9. THE MUSEUM LAYER — PYADRA'S OWN SURFACES

_Everything Pyadra runs for itself, alongside the projects — the experience layer inspired by the museum idea (see §1). This is the layer a new AI or collaborator most often doesn't know exists. All items below are Implemented and Deployed unless marked; public strings were checked on September 19, 2026._

**The Home (radically minimal — owner decision, July 2026):** symbol + PYADRA wordmark + tagline `DISCOVER. CONNECT. BUILD. BUY.` + one `Join` button (→ `/exhibitions`). Nothing else. Do not re-add copy without asking the owner. A dark curtain (`Pyadra` · `Discover. Connect. Build. Buy.`) rises on every visit after **2 seconds** (trimmed from 3 s on July 2, 2026, commit `b7e7d46`; some code comments still say "three seconds"). Clicking the symbol plays the "meet" animation, then opens `/exhibitions`.

**The Exhibitions hall (`/exhibitions`):** headline `Welcome to Pyadra.` and the paragraph `Pyadra is a startup where you can discover, meet, build, buy, and support new projects through exhibitions — like walking through a museum of ideas, businesses, and opportunities.` followed by `Explore the exhibitions currently open:` and the three rooms (§7). ⚠ `VISION.md` says Pyadra is "not a startup"; the live page says it is. **Open (owner):** which self-description to keep.

**The digital business cards (`/eduardo`, since September 16, 2026 — becoming a team deck):** the destination of the QR on Eduardo's printed card (QR files in `brand/card/`).

> [!important] What this page is becoming (owner, September 22, 2026 — IN DEVELOPMENT) `/eduardo` is Eduardo's digital business card, and it is being extended into cards for the whole Pyadra team (four people). **Only three things change per person: the photo, a short description of them, and their role.** Everything else — the project list and the rest of the page — is shared, and every card shows it to whoever scans. Eduardo's URL stays `/eduardo` because it is already printed. The work is in progress in the repo (a roster file plus a team deck component); do not document its internals until it ships. Portrait, `Founder · Pyadra LLC · Perth, Australia`, the statement `I build projects that can live without me, and then look for the people who carry them further.`, and `Save my contact` (a vCard from `/api/vcard`). Below: `What I make` — seven rows: the four Galaxy projects (Orbit 77 `Live`, EterniCapsule `For sale`, Figuitoon `For sale`, Kangaroo Cleanup `Paused`) and three `Coming soon · In documentation` rows (`Mobile app`, `Songs for unforgettable moments`, `Gym routines`). Then four contact doors (building something / a project of your own / good at something / write to me) that open the shared contact dialog → `/api/contact` → pyadra@pyadra.io. It also registers an Observer number. Local, uncommitted edits to this page (a rewritten bio headed "The short version" and a portrait crop) exist in the working copy and are **not deployed**; the live page still shows "How I got here".

**"Bring your idea" (nav, every page):** a dialog (`Show us what you're building.`) that sends to `/api/contact` → pyadra@pyadra.io. This is Pyadra's live door for other people's ideas.

**The Observer ticket:** every visitor to the home (and, since September 16, to `/eduardo`) becomes a numbered Observer — Pyadra's quiet signature. First visit calls `/api/observer`, a row is created in `pyadra_observers`, and the visitor keeps the number in their browser (localStorage). Privacy by design: no IP addresses stored (removed July 14, 2026), only the browser type. The home shows the admission stub at bottom-left; other pages show `Observer №` in the footer. Known limitation: if the database is unreachable, the API answers with a random number from 1–100 and the browser keeps it as if it were permanent.

**The Manifesto** (`/manifesto`) and the **legal pages** (`/legal/privacy`, `/legal/terms`) — light museum pages. Terms carry the protections of a Delaware LLC (as-is, liability cap, Delaware law, EterniCapsule best-effort clause). Rewritten July 14, 2026 ("Effective July 2026"). Rule: any new data-collecting feature updates Privacy in the same commit (#14).

> [!warning] Privacy page gaps found September 19, 2026 (not fixed — needs a code/legal change)
> - The contact dialogs (nav "Bring your idea", project enquiry forms, `/eduardo` doors) collect name, email, message — and on Kangaroo an optional phone — and send them by email via Resend. `/legal/privacy` does not mention contact forms.
> - Privacy §3 still describes EterniCapsule capsule data as collected by pyadra.io; since the split, capsules are collected on eternicapsule.com.
> - Privacy §4 says the Observer number is counted on "the home page"; `/eduardo` now counts too.

**The single inbox:** `pyadra@pyadra.io` is the main mailbox for receiving. **Exception (owner, September 22, 2026):** Byndi uses its own address, `byndy@pyadra.io` — note the spelling the owner gave (`byndy`) differs from the product name (Byndi); confirm before printing it anywhere. Everything else keeps the single inbox. Every mailto on pyadra.io, every contact API recipient, every reply-to. Never gmail, never eduardo@/orbit@. The code also uses send-only sender identities — `contact@pyadra.io` (contact API), `orbit77@pyadra.io` (Orbit credential email) and, in the eternicapsule repo, `ethernicapsule@pyadra.io` as the default `EMAIL_FROM`; whether those addresses receive mail is unverified. ⚠ Byndi's draft legal pages still list a personal Gmail address; they need updating to `byndy@pyadra.io` — see [[Byndi]].

**Editable site parameters (`pyadra_settings`):** a key/JSONB table in Supabase read via `getSetting(key, fallback)`. Change a value in the Table Editor and the site follows within a minute — no deploy. Live keys: `orbit.funding_goal_aud`, `orbit.episodes_live`. New parameters = new rows, never new hardcodes.

**Shared infrastructure (one of each, separated by discipline):**

- **Supabase** — one project, 4 tables, one per concern: `pyadra_observers`, `pyadra_settings`, `orbit_support_credentials`, `ethernicapsule_capsules`. Ownership map in `supabase/README.md`; migration `0008_full_reset_baseline.sql` is the single schema source of truth. Orbit accesses its table ONLY through `orbit-db.ts` (env-var switch → its own DB someday with zero code changes). `ethernicapsule_capsules` stays in this project but is read/written only by the standalone eternicapsule.com app.
- **Stripe** — one account. Pyadra's webhook handles only `orbit-77` (known blocker for Orbit's independence). EterniCapsule has its own webhook endpoint on eternicapsule.com.
- **Resend** — transactional email only; the eternicapsule app reuses the same account.
- **Vercel** — one team with two projects: `pyadra` (pyadra.io → www.pyadra.io) and `eternicapsule` (eternicapsule.com). `main` auto-deploys each. Anonymous, cookie-free analytics on pyadra.io.

**Quality gates:** `npm run smoke` boots the production build and checks every route/API listed in `scripts/smoke.mjs` — run it before every push to main. `npm run verify` = typecheck + unit tests + build + smoke (it does **not** run lint). GitHub Actions CI runs typecheck, lint (non-blocking), tests and build on every push/PR to main, plus a weekly npm audit and CodeQL; runs through September 16, 2026 were green. Security posture (July 14, 2026): RLS on with zero public policies, rate limiting 30 req/min/IP on Pyadra's APIs, strict CSP, 128-bit capsule keys. Details and counts: `ARCHITECTURE.md`.

---

## 10. BUSINESS MODEL

> [!note] Status of this section (September 19, 2026)
> Phase 1 terms are **owner-defined working figures** (June 2026). No closed participation deal is recorded in the docs or code, so none of these terms has been applied to a real deal yet (owner to confirm). Phase 2 and Phase 3 are **plans**, not active.

### Phase 1 — TODAY

Pyadra validates the model with its own projects.

→ Founder builds and documents real projects → Projects are exhibited following the [[Project_Standard_Template]] → Projects are made available for participation → When a participation deal closes, Pyadra retains between **1% and 5% permanent stake** in the project — forever, regardless of who owns it → The exact % is defined per project based on maturity, value, and deal type → Goal: close first transaction and prove the model works

> [!warning] Legal note Any deal involving project participation must be reviewed by legal counsel before closing. Pyadra is registered in Delaware, United States. Regulatory requirements vary by deal type and jurisdiction.

> [!important] Operating principles (defined June 2026) These clarify how Phase 1 deals are structured in practice:
>
> - **Transaction fee:** at closing, Pyadra charges a fee to BOTH sides of the deal (buyer and seller). Working figure: **5% each**. This is separate from the permanent stake.
> - **Lower upfront ↔ higher permanent share.** A project can be entered cheaply (low upfront, higher per-sale share to Pyadra) or expensively (high upfront, lower share). The two perks trade off so the cheap entry is paid back over time through the larger ongoing cut.
> - **Hosting is an option, not a lock-in.** A project can always leave Pyadra (see Key Principle, section 4). When a project is built on Pyadra infrastructure, it _may_ stay hosted by agreement between Pyadra and the owner. Staying hosted is negotiated and priced; it never removes the project's right to leave. For external/Phase 2 projects, the operator normally provides their own hosting.
> - **Infrastructure costs are always the operator's.** Hosting, email, database, and payment-processor fees (Stripe etc.) are paid by whoever operates the project, never absorbed by Pyadra.
> - **Pyadra is not a trap.** It creates, documents and exhibits projects and earns on the deals it facilitates (the museum is how it presents them). A project leaving is normal and allowed — Pyadra's value is in being the best space to be, not in trapping projects. _(Wording updated September 19, 2026 to match §1; the June version read "Pyadra is a museum/platform. It exhibits and earns.")_
> - **Pyadra-share vs creator-share is NOT split yet.** Today the founder is both Pyadra and the creator, so the whole cut is theirs. Splitting the structural platform fee from the creator's build royalty is deferred to Phase 2, with legal review, when a real external case exists. Do not design the split speculatively.

> [!important] How to value a project (learned from real projects, June 2026) Not every project is valued the same way. Match the method to the project's nature:
>
> - **Business with real history** (e.g. [[Kangaroo_Cleanup]]): value by its earnings — roughly seller's discretionary earnings × a market multiple. It has past sales that prove worth. Owner-operated, no-contract, inactive businesses sit at the low end (~1× SDE).
> - **Built product, pre-revenue** (e.g. [[EterniCapsule]]): value by _reconstruction cost_ — what it would cost to build from zero. No sales yet, but a real built asset. This is the defensible floor.
> - **Idea / early stage**: value by potential only — the lowest and most fragile. A buyer discounts unproven potential heavily.
>
> **How to present value on the page:** Do NOT show a hard valuation figure as a headline — it invites the buyer to argue it down. Use a narrative of worth instead (Kangaroo: "what it took to build this"; EterniCapsule: "$12k reconstruction value" as an anchor, with entry prices below). The exact number is shared privately with serious buyers, in due diligence.

> [!important] Protecting revenue-share deals (learned from Kangaroo, June 2026) When a deal includes a revenue share the buyer pays over time, that income depends on the buyer self-reporting and paying voluntarily once the founder is no longer operating. This is fragile. Every such agreement MUST include: a reporting clause, a right to verify, and clear terms for non-payment. Never close a revenue-share deal on a handshake. This is mandatory and pairs with the legal-review rule above.

> [!note] Jurisdiction flag — needs resolution Company Master says Pyadra LLC is registered in Delaware, USA. EterniCapsule's doc references ASIC (Australia) for securities review. These must be reconciled with legal counsel — the correct regulator depends on where Pyadra operates and where deals close. Flagged, not resolved.

**Open questions on the model (not decided — do not treat as terms):**

- **Contribution model (open proposal).** Orbit 77 raises contributions instead of selling. Its doc drafts a Pyadra platform fee of ~5% of funds raised; this is not an approved term. See [[Orbit77]].
- **Where product and contribution money goes.** Orbit contributions are collected through Pyadra's Stripe account, and EterniCapsule's capsule payments go through the same account from its own app. How that revenue is attributed between Pyadra and each project (and, for Orbit, to Pablo) is not documented.

---

### Phase 2 — NEXT (plan — not active)

Pyadra opens to external founders.

→ Any founder can bring a real project to Pyadra → The project must meet the [[Project_Standard_Template]] → Pyadra helps the founder document the project (paid service or equity exchange) → The project is exhibited in the appropriate Exhibition → Pyadra receives between 1% and 5% permanent stake in exchange for exhibition and facilitation → When a participation deal closes, Pyadra receives a transaction fee → Pyadra always retains its permanent stake even after the project is sold or transferred

---

### Phase 3 — FUTURE (plan — not active)

Tokens and equity for equity.

→ Pyadra introduces its own native token system as a way to participate in projects → Tokens reduce the psychological friction of participating with real money → Exceptional projects that generate significant value may receive a small percentage of Pyadra itself → Full alignment of interests: the founder wants Pyadra to grow — Pyadra wants the project to grow → Requires: legal structure, cap table, token regulatory review, formal agreements, and legal counsel in each relevant jurisdiction

> [!warning] Phase 3 is future only. Not active today. No token or equity-for-equity deal without full legal review.

---

## 11. BRAND IDENTITY

**Logo:** Geometric emerald gem with internal path suggesting pawn transforming into queen. Outline only — no fills. Clean geometric strokes. In use on the site (nav, home symbol) and on the printed founder card (September 2026). Status in July 2026 was "in finalization"; whether the current design is final is an owner call.

---

**Color palette:**

|Token|Hex|Usage|
|---|---|---|
|Background main|#EDEFED|Main pages, exhibitions, trust context|
|Background secondary|#D9DBD9|Subtle sections, cards on light bg|
|Background ceremonial|#0A120E|Dark, immersive, inside project experiences|
|Emerald primary|#059669|Main accent, CTAs, active elements|
|Emerald light|#10B981|Hover states, highlights|
|Emerald deep|#047857|Active states, depth|
|Text primary|#1A1C1A|Main body text|
|Text secondary|#3A4A3E|Supporting text|
|Text tertiary|#6B8070|Labels, metadata, captions|

> [!warning] Background rule The dark ceremonial background (#0A120E) belongs only inside individual project experiences — never in Galaxy, Exhibitions, or any Pyadra navigation page. Black is not a Pyadra color. Main Pyadra pages always use smoke gray (#EDEFED). (Fact, September 19, 2026: the home's 2-second opening curtain is #0A120E before the smoke-gray page appears.)

---

**Typography — Design System v1 (July 2026, via next/font):**

- **Fraunces** — serif display, titles, project names, emotional moments
- **DM Sans** — body text
- **IBM Plex Mono** — data, labels, metrics, technical

Locked type scale `.t-d1`–`.t-d6` in `globals.css` — six sizes, never a seventh. (Cormorant Garamond / EB Garamond / JetBrains Mono survive only INSIDE project experiences that chose them, e.g. EterniCapsule's ceremonial world — never on Pyadra's own pages.)

---

**Copy voice — how Pyadra speaks:**

Pyadra speaks like a person who believes in what they built and in the people they are inviting to be part of it. Honest. Direct. Warm. Never salesy.

✅ Words Pyadra uses:

```
real · contribute · grow · believe · together
people · skills · work · part of · participate
project · idea · build · own · matter · lasting
opportunity · honest · validated · documented
```

⚠️ Words Pyadra uses only in the right context:

```
token      → only in Phase 3 communications
equity     → only in legal and formal documents
investment → only when describing participation options
```

❌ Words Pyadra never uses:

```
buy now · add to cart · shop · checkout
disrupting · revolutionary · game-changing
passive income · guaranteed returns
NFT · blockchain (unless legally required)
```

> [!warning] Live copy that sits against this list (checked September 19, 2026)
> `The museum shop` (Galaxy gem, Store badge), `Store` (nav), the tagline `Discover. Connect. Build. Buy.`, and Orbit's `Opening checkout…` / `the exact final amount is set at checkout` all use words from the lists above. **Open (owner):** is the ban aimed at e-commerce calls to action (`Buy now`, `Add to cart`, `Checkout →`) rather than every use of the words? Until answered, do not add new uses.

---

**Design rules:**

> [!important] Strong preference — no scroll Ideal: everything fits in one screen without scrolling. Acceptable: vertical scroll when content genuinely requires it, but always with intentional design — never by default.

- No generic e-commerce language anywhere
- Experience first — technology is invisible
- The user is a participant, not a visitor or customer
- No hardcoded data — everything pulls live
- Dark background belongs inside project experiences only
- Black is not a Pyadra color — use smoke gray

---

## 12. EXPERIENCE PHILOSOPHY

_This is the experience layer. The business definition is in §1._

Pyadra sells experience first. Technology is invisible.

The way someone feels when they use Pyadra is more important than what technology powers it.

Every interaction should feel like a ceremony — intentional, meaningful, permanent.

Design and experience are the product. Technology is just the infrastructure.

People don't come to Pyadra to use software. They come to be part of something.

This is what differentiates Pyadra from every other platform that tries to connect projects with people.

---

## 13. CURRENT STATE (verified September 19, 2026)

**Scope of this verification:** code at commit `1d00242` on `main` (plus the uncommitted working copy); the public site and public APIs, read-only, on September 19, 2026; the `eternicapsule` repo (commit `fe82655`, August 26, 2026); the Byndi repo on the owner's machine (commit `260f785`, July 29, 2026). **Not verified:** Stripe, Supabase, Vercel or Shopify dashboards; bank records; app-store consoles; any signed agreement.

**Legal:** Pyadra LLC — registered in Delaware, United States (owner statement). Privacy + Terms live (Delaware governing law, liability cap) — with the Privacy gaps listed in §9.

**Projects:**

|Project|Where it runs|Public status on Pyadra (live strings)|Opportunity / terms|Evidence and caveats|
|---|---|---|---|---|
|[[Orbit77]]|pyadra.io (inside this repo)|Nav `For support` · Galaxy `Open for support`|Contribution layers $10–$1,000+ — not for sale. Pablo keeps the project (owner, September 22, 2026)|Deployed. `/api/stats/orbit-fund` reported `total 10` AUD raised, goal 10,000, 10 episodes (September 19). The owner believes that $10 was his own test payment (September 22, not certain) — so treat the real raised total as $0 until confirmed.|
|[[EterniCapsule]]|Product: eternicapsule.com (own repo and Vercel project since August 26, 2026). Showcase: pyadra.io|Nav `For sale` · Galaxy `Open for acquisition`|Operator $4k / Owner $8k / Make an offer — "hosted" framing under owner review|Product deployed (eternicapsule.com answers 200). Its stats API returned all zeros, but that API has a query defect (see known defects), so the zero is not proof of no sales.|
|[[Figuitoon]]|Sells on its own Shopify (figuitoon.com); showcase on pyadra.io|Nav `For sale` · Galaxy `Available to acquire`|$11,500 launch price, value $15,000 (owner decision, July 2026)|Showcase deployed. Shopify store and sales were not checked in this audit; the doc's last statement (July 2026) is zero sales.|
|[[Kangaroo_Cleanup]]|Physical business, paused; showcase on pyadra.io|Nav `For sale` · Galaxy `Looking for a partner` · `/eduardo` `Paused`|$5k / $8k / $12k upfront + revenue share|Real history per founder records + public Airtasker profile. On September 19 Pyadra's Airtasker API returned `partial`, so at least one of 248 tasks / 213 reviews came from the stored fallback — check the profile by hand before quoting it as "verified today".|
|[[Byndi]]|Mobile app (Expo), separate repo on the owner's machine|Not exhibited on pyadra.io|None defined|Implemented (development closed July 29, 2026 per its launch plan). In testing (owner, September 19, 2026). Store publication not verified.|

Also listed publicly on `/eduardo` as `Coming soon · In documentation`: `Mobile app`, `Songs for unforgettable moments`, `Gym routines`. No Pyadra doc exists for any of them. ⚠ **Open (owner):** is `Mobile app` Byndi? If so, that public row understates its stage.

**What exists and works (Implemented + Deployed, checked September 19, 2026):**

- Home with Observer ticket · Exhibitions hall · [[Galaxy]] v4 orbital field · all 4 project dashboards · the founder's room `/eduardo` with vCard download
- Pyadra Store live (2 books, reserve-by-email)
- Orbit contribution flow incl. $1,000 tier, credential emails, supporter archive (Implemented; last verified end-to-end July 14, 2026)
- EterniCapsule product running on its own deployment at eternicapsule.com; the Pyadra showcase links out to it
- Clean database (reset 0008): 4 tables, per-project separation, RLS closed, editable `pyadra_settings`
- Security hardening on pyadra.io: rate limiting, strict CSP, 128-bit keys
- Deploy gate `npm run smoke` + GitHub Actions CI (green through September 16, 2026)

**Defects found on September 19, 2026 — fixed in code on September 22, none deployed yet** _(details in `ARCHITECTURE.md` → Known issues)_:

- **Live claims that were inaccurate:** the Galaxy sphere said `Hosted on Pyadra` (now `Independently deployed (eternicapsule.com)`), and the EterniCapsule caption said `client-side sealed` (now `key-locked`).
- **EterniCapsule showcase metrics:** all three causes fixed — Pyadra's CSP now allows eternicapsule.com; the stats API accepts both the apex and `www` origins; the query uses `deliver_at` instead of the non-existent `unlock_date`. **The two eternicapsule fixes only take effect when that repo is deployed.**
- **Rate limiting** added to eternicapsule.com's API (same 30 req/min/IP as Pyadra, Stripe webhook exempt) — also pending that deploy.
- **Privacy page** now discloses the contact forms, EterniCapsule's own site and the founder's-page Observer.
- **Invented Observer numbers:** `/api/observer` no longer answers with a random 1–100 when the database is unreachable; it returns no number and the page simply shows no ticket.
- **Setup gap:** `.env.example` is now tracked (the `.gitignore` keeps ignoring every other `.env*`).
- **PR labels:** `.github/labeler.yml` repaired (it still pointed at pre-April paths).

**Still open:**

- **Byndi code has no git remote** configured on the owner's machine — the repo may exist only there.
- **The $10 in Orbit's fund** is probably the owner's own test payment. If so, that row should be removed from the database so the public progress bar only shows real support — a data change, not done here.

**What's missing:**

- First closed participation deal (still the #1 goal)
- First EterniCapsule sale (unverifiable today, see above) · client-side encryption (so the zero-knowledge promise becomes true)
- Store payments (currently reserve-by-email)
- External founder onboarding process (Phase 2)

> [!note] Current constraint Solo founder. Limited weekly hours. Focus on one thing at a time. Priority set in July 2026: close first deal with [[Kangaroo_Cleanup]].

---

## 14. PRIORITIES

_Owner priorities as set in July 2026. Not re-confirmed on September 19, 2026 — the audit's findings are listed in §13 for the owner to triage, not added here._

### Immediate

- [ ] Find the right buyer or operator for [[Kangaroo_Cleanup]] — close the FIRST participation deal
- [ ] Get [[EterniCapsule]]'s first real sale
- [ ] Reach [[Orbit77]] Season 2 funding milestones ($10k goal)
- [ ] Finalize logo

### Next

- [ ] EterniCapsule client-side encryption (AES-GCM) — make the zero-knowledge promise true, restore the stronger copy
- [ ] Store payments (replace reserve-by-email when the books are ready)
- [ ] Legal review for participation deal structure (incl. the Delaware-vs-ASIC jurisdiction flag)
- [ ] Supabase backup plan before real capsules exist (free tier ≠ years-long promises)

### Future

- [ ] Open Pyadra to external founders (Phase 2)
- [ ] Token system and equity for equity model (Phase 3)
- [ ] Legal structure for Pyadra cap table
- [ ] Jungle and City exhibitions

---

## 15. NON-NEGOTIABLE RULES

> [!important] These rules apply to every decision, every build, every conversation. No exceptions. No workarounds.

1. **Build and sell at the same time** (changed by the owner, September 22, 2026 — the rule used to read "Do not build more until there is a first closed deal"). Building does not stop while waiting for the first deal; selling does not stop while building.
2. Every project must meet the [[Project_Standard_Template]] before being exhibited
3. Every project must be able to deploy independently from Pyadra at any time
4. No generic e-commerce language anywhere in Pyadra
5. Technology serves experience — never the opposite
6. The user is a participant, not a visitor or customer
7. No hardcoded data — everything pulls live
8. Pyadra always retains 1–5% permanent stake in every project it facilitates
9. No participation deal closes without legal review
10. Risks are always shown — full transparency, always
11. The Pyadra Store is not a project — it never appears in an Exhibition
12. Black is not a Pyadra color — smoke gray (#EDEFED) is the main background
13. **The page never claims what the code doesn't do.** The day a gap between a claim and reality is found, the copy is corrected that same day (learned July 14, 2026, from EterniCapsule's zero-knowledge claim). Honest copy is corrected UP when the feature ships — never the other way.
14. **Visitor data is minimal by default.** No IP addresses, no tracking cookies, nothing collected without a purpose the Privacy page discloses. Any new data-collecting feature updates Privacy in the same commit.

> [!warning] Where practice and the rules diverge (updated September 22, 2026)
> - **#1** — resolved: the rule itself changed, building and selling now run in parallel.
> - **#3** — Orbit 77 cannot yet deploy independently (monolithic Stripe webhook; documented in its doc).
> - **#4** — see the copy-voice warning in §11. Still open.
> - **#13** — fixed in code on September 22 (Galaxy's `Hosted on Pyadra` line and EterniCapsule's `client-side sealed` caption); pending a deploy.
> - **#14** — fixed in code on September 22 (`/legal/privacy` now covers the contact forms, EterniCapsule's own site and the founder's-page Observer); pending a deploy.

---

## 16. THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

If yes — we are on the right path.

---

## 17. KEY DECISIONS LOG

### March 2026

- [[EterniCapsule]]: 3 roles, 2 keys, human guardian
- Forging as core metaphor for [[EterniCapsule]]

### April 2026

- Museum metaphor removed from the docs (April 12) in favour of "a ceremonial space for participation"; restored as the Phase 1 identity in May — see `VISION.md` → "How the idea evolved"

### May 2026

- Tagline: "Lo que dejas importa"
- [[Galaxy]] uses pure CSS — Three.js only if there is a clear UX benefit
- Emerald green as brand color (Colombian emerald)
- Logo: geometric gem, outline only, no fills
- Project dashboard concept defined for [[Galaxy]]
- Figurines → external store (Shopify)
- Token model is Phase 3 — legal review required
- Each project must be independently deployable

### June 2026

- Pyadra redefined: the space where projects and ideas find the people who make them real
- Three project types defined: Local · Global · Glocal
- Three participation modes: Money · Work · Skills
- [[Project_Standard_Template]] defined as quality filter and service
- Pyadra Store defined as separate from Exhibition projects
- Ebooks removed as project → becomes Pyadra Store
- [[Kangaroo_Cleanup]] added to [[Galaxy]] (replaces Ebooks)
- Figurines renamed to [[Figuitoon]] (official brand name)
- Business model: Pyadra retains 1–5% permanent stake per project
- Phase 3 defined: token system + equity for equity
- [[Galaxy]] redefined: cards show minimum info, one button → full dashboard
- Navigation clarified: Home → Exhibitions → [[Galaxy]] → Projects
- Exhibitions page shows exhibitions only — never individual projects
- No vertical scroll changed from absolute rule to strong preference
- Black removed from palette — smoke gray (#EDEFED) is main background
- Token and equity reserved for Phase 3 context — not banned entirely
- Pyadra LLC confirmed registered in Delaware, United States
- Operating principles added: 5% transaction fee both sides · lower upfront ↔ higher permanent share · infrastructure costs are the operator's
- Contradiction resolved: projects can ALWAYS leave; staying hosted is a negotiated option (not a lock-in), available when a project is built on Pyadra infra
- Valuation methods defined by project type: business-with-history (earnings × multiple) · built pre-revenue (reconstruction cost) · idea (potential)
- Value presentation rule: no hard valuation headline — use a worth narrative, exact figure in private due diligence
- Revenue-share protection made mandatory: reporting clause + verification right + non-payment terms · never close on a handshake
- COPY DECK method added to Project Standard (point 14): verbatim locked strings + single canonical source for numbers
- Pyadra-vs-creator share split deferred to Phase 2 with legal review

### July 2026

- Home tagline changed to `Discover. Connect. Build. Buy.` on the home, curtain and site metadata (July 2, commit `b7e7d46`); "Lo que dejas importa" kept on the Manifesto. Curtain trimmed to 2 s on every visit.
- Home made radically minimal by owner decision: symbol + wordmark + tagline + Join — nothing else
- Pyadra Store went LIVE June 13 (2 digital books, reserve-by-email); entrance = the central gem in Galaxy
- Galaxy v4: thin orbital field — no panels/tabs/forms/valuations; one click into the project page; Galaxy is the hook, the project page is the story
- Database full reset (migration 0008): one table per concern — pyadra_observers, pyadra_settings, orbit_support_credentials, ethernicapsule_capsules; per-project code separation (orbit-db.ts) so any project migrates with 2 env vars
- `pyadra_settings` created: site parameters editable in Supabase without deploys (first keys: Orbit goal + episodes)
- Observer privacy: IP storage removed; RLS closed on all tables, zero public policies
- Orbit crew form retired (page + API + table); Figuitoon internal checkout removed — it sells via its own Shopify; its museum page is a showcase
- Orbit is CONTRIBUTION (never "49% available") — goal $10,000 AUD, six layers $10→$1,000+, Pablo keeps the project; founders shown per page: Pablo (Orbit), Cristian (EterniCapsule), Eduardo (Kangaroo)
- Security hardening: 128-bit capsule keys, rate limiting 30/min/IP, strict CSP
- HONEST COPY RULE born (non-negotiable #13): EterniCapsule claimed in-browser encryption that didn't exist — copy corrected same day; client-side AES-GCM is now the top product roadmap item
- Privacy + Terms rewritten complete and accurate (Delaware law, liability cap, best-effort capsule clause, minimal-data rule #14)
- Deploy gate established: `npm run smoke` before every push to main
- Documentation reconciled with production and versioned: Kangaroo v1.6 · Orbit v1.4 · EterniCapsule v2.0 · Galaxy v4.0 · Company Master v3.0
- Design System v1 confirmed as brand typography: Fraunces + DM Sans + IBM Plex Mono, locked scale .t-d1–.t-d6

### August 2026

- EterniCapsule's standalone repo (`pyadra/eternicapsule`) created and deployed on its own Vercel project at eternicapsule.com (August 26, per that repo's history)

### September 2026

- September 15: Pyadra retired EterniCapsule's in-monolith app routes and pages, keeping only the sale/showcase dashboard, which links out to eternicapsule.com. EterniCapsule became the first project to clear the "monolithic Stripe webhook" independence blocker (own endpoint, own `project_id`).
- Supabase and Resend stayed deliberately shared for EterniCapsule (one table, one working email account — not worth splitting yet); both reachable via the new repo's own env vars for a no-code-change move later, same pattern Orbit's `orbit-db.ts` already uses
- September 16: the founder's room `/eduardo` shipped as the destination of the QR on Eduardo's printed card; `/api/vcard` added
- September 22: owner decisions closing the audit's questions — the tagline is `Discover. Connect. Build. Buy.`; Pyadra calls itself a startup; Orbit 77 is GLOCAL and stays with Pablo; the $10 in Orbit's fund was most likely the owner's own test; **non-negotiable #1 changed** to "build and sell at the same time"; `/eduardo` becomes the team's digital business cards (four people; only photo, short description and role change per person) and is an accepted exception to the "projects only inside their exhibition" rule; Byndi gets its own contact address `byndy@pyadra.io` and its documentation stays light for now
- September 22: the audit's code defects fixed in this repo (honest live strings, CSP, privacy disclosures, Observer fallback, env template, PR labels) and in the eternicapsule repo (stats column, CORS origins, rate limiting) — not deployed
- September 19: **business definition clarified by the owner** — Pyadra creates, develops and collaborates to turn ideas into real projects and looks for people to acquire, operate, support, work on or carry them forward. The museum remains the inspiration for the site's visual experience, not the sole commercial definition (§1). Byndi recorded as a Pyadra project in testing.

---

> [!note] Changelog v4.1 (September 22, 2026) — The owner answered the audit's open questions, and the defects it found were fixed in code (see §13; nothing deployed). Recorded: the tagline decision, "Pyadra is a startup", Orbit GLOCAL + Pablo + the probable test payment, the new non-negotiable #1, the team business cards on `/eduardo` (photo, short description and role are the only per-person parts) as an accepted exception in §7, and Byndi's own contact address as the one exception to the single inbox. Still open: the scope of the banned-word list (§11), how product and contribution revenue is attributed (§10), and Byndi's remaining questions.

> [!note] Changelog v4.0 (September 19, 2026) — Documentation audit against code, git history, the related repos and a read-only check of the public site. Added §0 (evidence labels) and the owner's business definition in §1, with the museum re-scoped as the experience layer. Recorded the live tagline (`Discover. Connect. Build. Buy.`, since July 2) next to the founding motto. Unified the truth hierarchy in §6 (deck = authoring source, live page = record, false live strings get fixed in code). Updated §7 (Galaxy's live theme; the founder's-room exception flagged), §8 (store state), §9 (2-second curtain, Exhibitions hall copy, `/eduardo`, "Bring your idea", Privacy gaps, sender addresses, Vercel team), §10 (status note, open questions on the contribution model and revenue attribution), §11 (logo in use; live copy that sits against the banned-word list), §13 (rewritten with evidence and scope, Byndi added, known defects), §15 (practice vs rules, flagged for the owner, rules unchanged), §17 (July tagline, August/September entries). Fixed broken wiki-links (`[[Orbit_77]]` → [[Orbit77]]) and the broken frontmatter. No prices, terms or rules were changed.

> [!note] Changelog v3.1 (September 15, 2026) EterniCapsule split into its own repo/deploy at eternicapsule.com — the first project to clear the "monolithic Stripe webhook" independence blocker described in §9. Updated the shared-infrastructure map (Supabase/Stripe/Resend rows), the CURRENT STATE snapshot, and logged the September decisions. Business terms (the "hosted" participation pricing for EterniCapsule) were flagged for an owner decision in the project doc, not changed here.

> [!note] Changelog v3.0 (July 14, 2026) Major state update after the production-wide cleanup: added §9 THE MUSEUM LAYER (Observer ticket, minimal home, legal pages, single inbox, pyadra_settings, shared infrastructure map, quality gates) — the parallel pieces Pyadra runs for itself. Store section updated to LIVE. Exhibition card spec aligned to Galaxy v4 (spheres, no valuations). Typography corrected to Design System v1. Current State and Priorities rewritten against verified production. Two new non-negotiables: #13 the page never claims what the code doesn't do; #14 visitor data minimal by default. July decisions logged.

> [!note] Changelog v2.2 (June 2026) Captured the operating learnings from building Kangaroo Cleanup and EterniCapsule: resolved the leave-vs-stay contradiction, added valuation methods by project type, value-presentation rule, mandatory revenue-share protection, the operating principles (transaction fee, hosting, infrastructure costs), and the Copy Deck method in the Project Standard.

---

## 18. RELATED DOCUMENTS

- [[Project_Standard_Template]] — the document every project must complete
- [[Galaxy]] — first active exhibition
- [[EterniCapsule]] — Global project · runs at eternicapsule.com
- [[Orbit77]] — Glocal project · podcast
- [[Figuitoon]] — Glocal project · physical + digital product
- [[Kangaroo_Cleanup]] — Local project · service business · available now
- [[Byndi]] — mobile app · in testing · not exhibited
- Outside this vault (repo root): `VISION.md` · `ARCHITECTURE.md` · `CONTRIBUTING.md` · `supabase/README.md`

---

_END OF COMPANY MASTER DOCUMENT v4.1 · September 22, 2026_ _Next update: when the first participation deal closes, or when the owner answers the open questions above_
