# URELIT

_Project document · Pyadra · Last updated: October 23, 2026_

> [!important] The truth hierarchy (summary of [[Company_Master]] §6)
>
> 1. **Authoring:** new or changed copy is written in this document's COPY DECK first, then built — never improvised in code.
> 2. **Record:** the live page is the record of what visitors see. If deck and page disagree, the deck is updated to the live string the SAME DAY. If the live string is false, the deck records it, marks it ⚠, and the PAGE is corrected in code.
> 3. **This document** is the source for everything the page doesn't show — each claim labelled with its evidence.

> [!note] Sources (v1.1) Built on October 23, 2026 from the project's repository (`Documents\App Fitness`: `README.md`, `AGENTS.md`, `docs/producto.md`, `docs/hoja-de-ruta.md`, `docs/identidad-visual.md`) and the owner's answers of the same day. Where the repo and this doc disagree, the repo wins and this doc is corrected.

---

## IDENTITY

**Type (scope):** GLOBAL — online app, launch market United States **Pyadra relation:** Exhibited external — contributed to Pyadra by co-founder Christian Ruiz **Exhibition:** Jungle **Status:** Active · For sale **Founder / Creator:** Christian Ruiz (Pyadra co-founder) **Tagline (1 line):** PROVE IT. — the gym app that tells you what to lift next time.

---

## WHAT THE USER SEES BEFORE ENTERING

**What it is (2 lines):** A gym app that remembers every set you do and tells you the weight, reps and effort for your next session — in plain gym language, with safety limits built in.

**What they receive by participating:** The live app, its brand and its code — ready to open to the public and start charging.

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|URELIT (Free / Premium)|PWA at urelit.app — React + Vite front end, TypeScript progression engine|
|Price|Free · Premium $4.99/month or $29.99/year|Owner decision 21-10-2026; Stripe in **test mode** only — no live charges [Implemented, not live]|
|What's included|Log your sets, get your next weight, works offline. Premium: plans of several weeks, quick routine, supersets, full history. 14-day Premium trial.|`docs/premium.md`, `docs/pagos.md`|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|Active testers|`pyadra_settings` → `urelit.testers` (today: 5 — see METRICS)|
|Workouts logged|`pyadra_settings` → `urelit.workouts_logged`, filled from the Supabase sessions count (count only — no personal training data)|
|Reels published (@urelit.app)|Meta (Facebook Urelit + Instagram @urelit.app)|

**Access:**

- Exhibited external: `https://urelit.app`

---

## INTERNAL DESCRIPTION

**Problem it solves:** People who train in the gym (mostly on machines) want to progress but don't keep the numbers in their head, and they don't know when to add weight safely. URELIT does the counting and the decision.

**Why it exists on Pyadra:** To grow. Pyadra gives URELIT exposure to participants who can operate, fund or acquire it, so it reaches the public faster than with one founder alone.

**Who it speaks to:** Both — the accessible investor and the creator.

---

## EXPERIENCE & DESIGN

**The feeling in one sentence:** Calm, focus, discipline and real effort — strong, never aggressive.

**Atmosphere:** Cinematic dark gym photography, one solid red per screen, the number that matters big and everything else in the background.

**Color palette:**

|Token|Hex|Usage|
|---|---|---|
|Black|`#050505`|Main background — not bluish grey|
|URELIT red|`#D01508`|One solid accent per screen; closing word of headlines — never magenta or orange|
|White|`#F4F4F1`–`#FFFFFF`|Text, off-white|

**Typography:**

|Role|Font|Size|Weight|Usage|
|---|---|---|---|---|
|Headlines|Barlow Condensed|—|800–900, uppercase|Italic for speed, upright for authority|
|Body|Archivo|—|Regular|Normal text|
|Data & metrics|IBM Plex Mono|—|Regular|Numbers, metrics|

**Key interactions:** Log a set between sets with minimal taps; next-session card; check-in; rank reveal; counting numbers (animations B1–B10, deployed 22-10-2026, phone check pending).

**Animation principles:** Natural, minimal movement; nothing that distracts between sets.

**Copy voice:**

- ✅ Talk like in the gym: round kilos, "You're up in 5 of your 7 exercises", "Safety limits built in."
- ❌ Jargon without explanation (e1RM %, ACWR, RIR), rewarding kilos, guilt, humiliation, body promises.

**Design rules (project-specific):** Everything the user sees is in **English**; code and docs in Spanish. Logo and final typography are composed with the real assets, never redrawn by AI (`docs/identidad-visual.md`). Reward consistency, never weight.

**What it must never feel like:** Theatrical rage, a caricature, blue holograms, surveillance ("the app comments on everything you do").

---

## ARCHITECTURE

**Can it operate independently from Pyadra?** Yes — it already runs on its own infrastructure.

**Stack:** Progression engine in pure TypeScript (`src/`), app in React + Vite (`web/`), data on the phone (IndexedDB/Dexie) with a cloud copy in Supabase, served as an installable PWA. [Implemented]

**Repository:** Local folder `Documents\App Fitness` — no Git; `CHANGELOG.md` is the project history.

**Deploy:** `node scripts/desplegar.mjs` → Hostinger VPS (Docker behind Traefik) at urelit.app since 22-10-2026. [Deployed]

**Pyadra dependencies:** None.

**What independence requires:** 1. Already independent. 2. — 3. —

**Estimated effort for independence:** N/A.

---

## FLOWS

**Log and progress:**

```
Open today's workout (works offline)
  ↓
Log each set (weight, reps, effort)
  ↓
Engine computes next session within safety caps (src/safety/politica.ts)
  ↓
Data saved on the phone first, then synced to Supabase
```

**Upgrade to Premium (test mode):**

```
Premium offer (benefits · price · one action)
  ↓
Stripe Checkout in test mode
  ↓
Subscription verified → Premium unlocked
  ↓
After the 14-day trial without payment, Premium features show a lock
```

---

## PRODUCTS AND PRICING

|Product|Price|Status|Notes|
|---|---|---|---|
|URELIT Free|$0|Deployed|Weight suggestion and safety are always free|
|URELIT Premium (monthly)|$4.99/month|Implemented — Stripe test mode|Not charging real money yet|
|URELIT Premium (yearly)|$29.99/year|Implemented — Stripe test mode|Replaces the $9.99 price of 19-10-2026|

---

## CURRENT STATE

_Checked October 23, 2026 against the repo and the owner's answers._

**What works:**

- Live PWA at urelit.app, installable, works offline. [Deployed]
- Progression engine with safety caps and regression tests. [Implemented]
- Free/Premium split with 14-day trial and blocks. [Deployed 22-10-2026]
- 5 friends testing since September 4, 2026. [Verified in real use — owner report, 23-10-2026]
- Daily reels on Instagram @urelit.app and Facebook Urelit. [Owner decision; publication verified per reel in Meta]

**What's missing:**

- Live payments (Stripe still in test mode).
- Professional review of legal texts and operations before charging.
- Phone checks: urelit.app install + offline + notifications; animations B2/B3/B5–B7.

**Active blockers:**

- Legal/professional review is the gate before charging or opening to the public. Target: public opening by **November 23, 2026** at the latest. [Owner decision]

---

## OPEN QUESTIONS

**Technical:** When should `urelit.vercel.app` redirect automatically to urelit.app (approved, waiting until testers have synced)?

**Business:** Which launch channel for the public opening (reels, ads, gyms)?

**Product:** Which features finally move from free to paid (proposal P01–P09, not approved)?

---

## DECISIONS LOG

|Date|Decision|Reason|
|---|---|---|
|2026-10-23|Listed on Pyadra (Jungle) as For sale; all participation models active; creator keeps a perpetual royalty through Pyadra|Owner: growth of the projects|
|2026-10-23|Public opening as soon as possible, one month at most|Owner decision|
|2026-10-23|Product videos: only the 20 s version; produce G1–G7 and V02–V08|Owner: "solo la versión larga"|
|2026-10-23|Price video shows the final price (Free · Premium $4.99/mo or $29.99/yr)|Avoid deleting videos later|
|2026-10-22|Move from Vercel to Hostinger VPS at urelit.app|Own infrastructure (`docs/vps.md`)|
|2026-10-21|Basic features free, everything else paid with Premium samples; $4.99/$29.99|"La propuesta de valor de premium es muy pobre"|
|2026-09-09|User-facing text in English; code and comments in Spanish|US market|

Full log: `docs/producto.md` (owner decisions table).

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:** Partly. Every set logged becomes tomorrow's plan, so the history is visibly useful; losing a workout is treated as the one unforgivable failure. It is only proven with 5 friends — not yet with strangers.

---

## ASSET VALUE

**Maturity level:** MVP — first users (5 friends testing).

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical|TypeScript progression engine with safety policy and tests; React PWA; Supabase sync; deploy script; Stripe integration (test mode)|
|Brand|URELIT name, PROVE IT. slogan, visual identity guide, Instagram @urelit.app, Facebook Urelit, reels and product videos|
|Product|Free + Premium app, 14-day trial, exercise catalog (`URELIT-exercise-list.csv`)|
|Operational|AGENTS.md, CHANGELOG, roadmap, product decisions log, legal drafts|

**Participation models:**

|Model|Description|Investment range|Status|
|---|---|---|---|
|Supporter / contribution|Contributes, receives a product or credential. No ownership, no revenue share.|Low (product price)|Active|
|Operator / lower upfront|Lower upfront + higher permanent share to Pyadra. Operator runs it, pays infrastructure.|Medium|Active|
|Owner / higher upfront|Higher upfront + lower permanent share. Operator keeps more per sale.|High|Active|
|Make an offer|Different structure (incl. taking it independent). Private conversation, never a fixed page button.|Negotiable|Active|

> [!note] Valuation method: built pre-revenue product → reconstruction cost. No valuation headline on the page; the figure is shared privately in due diligence.

**How a participant or buyer makes money:**

|Revenue stream|Current state|Potential|
|---|---|---|
|Premium subscriptions|Not live (test mode)|$4.99/month or $29.99/year per user|

**Post-participation structure:**

- Participant / buyer receives: the app, code, brand, social accounts and documentation, according to the chosen model.
- Original creator retains: a **perpetual royalty percentage, paid through Pyadra** (% set per deal).
- Pyadra receives: the permanent share defined by the participation model, and administers the creator's royalty.

> [!warning] Revenue-share protection The royalty agreement must include a reporting clause, a verification right and non-payment terms. Legal review required before signing.

**What must happen before this project can be sold or partially acquired:**

- [ ] Live payments with real subscribers
- [ ] Professional legal review of terms and privacy
- [ ] Usage numbers recorded from Supabase (testers, retention)
- [ ] Code under version control (today: local folder only)

---

## OPTIONAL — SALE-STAGE SECTIONS

_Active since October 23, 2026 (status: For sale)._

### METRICS AND NUMBERS (canonical)

|Metric|Value|Source|Verifiable|
|---|---|---|---|
|Active testers|5|Owner report, 23-10-2026|Yes — Supabase accounts|
|Testing since|September 4, 2026|`docs/producto.md`|Yes|
|Premium price|$4.99/month · $29.99/year|`docs/producto.md` (21-10-2026)|Yes — app|
|Paying subscribers|0|Stripe in test mode|Yes — Stripe|
|Revenue to date|$0|Stripe in test mode|Yes — Stripe|

### PROOF OF WORK

|Evidence|Status|Availability|Link|
|---|---|---|---|
|Live app|Live|Public|`https://urelit.app`|
|Instagram|Active, daily reels|Public|`https://www.instagram.com/urelit.app/`|
|Facebook page "Urelit"|Active|Public|`https://www.facebook.com/profile.php?id=61594226321282`|
|Change history|Kept since 2026|Due diligence|`CHANGELOG.md`|

### RISKS (The Honest Risks)

|Title|Description|
|---|---|
|No revenue yet|Payments run in test mode; nobody has paid yet.|
|Small test group|Only 5 friends have used it; retention with strangers is unknown.|
|Legal review pending|Terms and privacy were not reviewed by a lawyer; that must happen before charging.|
|Single folder, no Git|The code lives in one local folder with a written changelog; a buyer should move it to version control.|
|Crowded market|Competes with Hevy, Strong, Fitbod and Boostcamp.|

### DUE DILIGENCE

> [!note] Does NOT appear on the public page. Shared only when there is confirmed serious interest from a potential buyer.

- [ ] Ownership of domain urelit.app, Supabase project, Hostinger VPS, Stripe account, Meta accounts
- [ ] Rights to images, music and videos used in the brand and reels
- [ ] Legal texts (terms, privacy) reviewed by a professional
- [ ] Usage data export (testers, workouts) without personal training data
- [ ] Royalty agreement with reporting, verification and non-payment terms

### SALE — COPY AND CONVERSION

**Main hook (hero):** A finished gym app, live and tested, one step from charging.

**Buyer journey:** Arrival (the app and its brand) → Interest (live PWA, engine with safety limits) → Conviction (5 real testers, clear pricing ready) → Decision (participation model) → Action (talk to Pyadra)

---

## COPY DECK — LOCKED STRINGS

_Open proposal — no Pyadra page exists for this project yet (checked October 23, 2026). Lock these strings when the page is built and stamp: "last reconciled against `page.tsx`, {{date}}"._

### Identity block

- **Type badge:** `Global`
- **Status badge:** `For sale`
- **H1 (project name):** `URELIT`
- **Tagline:** `PROVE IT.`
- **Intro paragraph:** `A gym app that remembers every set and tells you what to lift next time — in plain gym language, with safety limits built in. Live at urelit.app, tested by real users, with Free and Premium plans ready to charge.`

### What you get

|Field|String|
|---|---|
|Heading|`What you get`|
|Item 1|`The live app and its code`|
|Item 2|`The URELIT brand and its social accounts`|
|Item 3|`Free and Premium plans, ready to charge`|

### Primary CTA

- **Button:** `Talk to us about URELIT`
- **Sub-line:** `Acquire it, operate it or support it through Pyadra.`

### Founder block (drawer) — required

- **Founder:** `Christian Ruiz`
- **Photo:** `public/images/urelit/christian_founder.jpg` (same photo on all four of Christian's projects) · chip `Christian · California`
- **Quote (serif italic):** `An hour in the gym should never be wasted. I built URELIT so nobody has to guess what to lift next.`
- **Signature:** `Christian Ruiz` · `Founder of URELIT · Co-founder of Pyadra, 2026`

### Strings that must never appear

```
e1RM, ACWR, unexplained RIR, "without injury", kilo-based rewards,
guilt or humiliation lines, body promises, any valuation figure
```

---

## ROADMAP

**Now (current quarter):**

- [ ] Professional review of legal texts
- [ ] Phone checks of urelit.app and animations
- [ ] Public opening — by November 23, 2026 at the latest
- [ ] "Conoce URELIT" video series (Q1–Q5, G1–G7, V02–V08)

**Next (following quarter):**

- [ ] Live Stripe payments and first paying subscribers

**Future (no fixed date):**

- [ ] Transfer to a participant or operator through Pyadra

---

## RELATED LINKS

**Documentation:**

- [[Company_Master]]
- `AGENTS.md`, `README.md`, `docs/producto.md`, `docs/hoja-de-ruta.md` (repo root — outside this vault)

**Code:** `Documents\App Fitness` (local, no Git)

**Sibling projects:** [[Pyadra — WEMAIT]] (same fitness domain), [[Pyadra — Momentos Eternos]], [[Pyadra — Mentalidad Millonaria Inquebrantable (MMI)]]

---

## RECONCILIATION RITUAL (required)

1. Whenever the page changes meaningfully, this doc is reconciled in the same session.
2. On reconciliation: bump the version at the END line, add a dated `Changelog vX.Y` note, and update the copy-deck stamp.
3. Numbers in Galaxy's sphere copy must be updated when this doc's canonical metrics change — same commit.
4. Never let a claim survive that the code doesn't keep ([[Company_Master]] non-negotiable #13).
5. A changelog records what was actually done. If a change was made only in the doc and not in code, say so.

**Changelog v1.3 (October 23, 2026):** last open field closed (workouts metric source). Doc only.
**Changelog v1.2 (October 23, 2026):** Facebook page link added. Doc only.
**Changelog v1.1 (October 23, 2026):** owner answers added — Jungle, For sale, all participation models active, perpetual royalty through Pyadra, 5 testers, opening within one month; sale-stage sections activated; copy deck and founder block proposed. Doc only — no code changed.
**Changelog v1.0 (October 23, 2026):** first version, built from the repo docs. Doc only.

---

_END · URELIT · v1.3_ · _Template v4 · September 19, 2026_
