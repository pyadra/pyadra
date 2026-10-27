# WEMAIT

_Project document · Pyadra · Last updated: October 23, 2026_

> [!important] The truth hierarchy (summary of [[Company_Master]] §6)
>
> 1. **Authoring:** new or changed copy is written in this document's COPY DECK first, then built — never improvised in code.
> 2. **Record:** the live page is the record of what visitors see. If deck and page disagree, the deck is updated to the live string the SAME DAY. If the live string is false, the deck records it, marks it ⚠, and the PAGE is corrected in code.
> 3. **This document** is the source for everything the page doesn't show — each claim labelled with its evidence.

> [!note] Sources (v1.1) Built on October 23, 2026 from the project's repository (`Documents\wemait`: `README.md`, `CLAUDE.md`, `docs/ESTADO.md` of 19-10-2026, `docs/ESPEC-RESUMEN.md`, `docs/DECISIONES.md`, `docs/MARCA-WEMAIT.md`, `docs/CONTINUAR.md`, `apps/mobile/src/theme.ts`) and the owner's answers of the same day. The repo wins over this doc.

---

## IDENTITY

**Type (scope):** GLOBAL — app for the US market, English and Spanish, USD **Pyadra relation:** Exhibited external — contributed to Pyadra by co-founder Christian Ruiz **Exhibition:** Jungle **Status:** Active · For sale **Founder / Creator:** Christian Ruiz (Pyadra co-founder) **Tagline (1 line):** progress we build together

---

## WHAT THE USER SEES BEFORE ENTERING

**What it is (2 lines):** An app for certified coaches and their clients: training, nutrition, habits and check-ins in one place. It shows with data whether a coach's system actually works.

**What they receive by participating:** A complete coaching platform — app, brand and code — with coaches already in conversation, ready for its first real users.

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|WEMAIT for coaches|Expo (iOS/Android/web) + Fastify API + Prisma|
|Price|Free up to 2 clients · paid plans from $25/month|Plan table below; subscriptions **not active** yet [Owner decision · Implemented as info screen]|
|What's included|Programs, nutrition, habits, check-ins, schedule, chat and results per system — all included, priced by number of active clients|`docs/ESPEC-RESUMEN.md`|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|Approved coaches|API database — `pyadra_settings` → `wemait.coaches` until wired (today: 0)|
|Coaches in conversation|`pyadra_settings` → `wemait.coach_conversations` (today: 5)|
|Systems with verified results|Systems analytics (phase 1, implemented 10-10-2026)|

**Access:**

- Exhibited external: `https://wemait.app` (demo: `https://wemait.app/app/`)

---

## INTERNAL DESCRIPTION

**Problem it solves:** Coaches sell "systems" (training + nutrition + habits) without proof they work, and juggle several apps plus extras. WEMAIT measures compliance and results per system and includes everything in one price.

**Why it exists on Pyadra:** To grow. Pyadra brings participants who can fund the launch (stores, payments) or operate it with the coaches already interested.

**Who it speaks to:** Both — the accessible investor and the creator (certified coaches: NASM, ACE, ISSA, NSCA, ACSM, RD…).

---

## EXPERIENCE & DESIGN

**The feeling in one sentence:** Moving forward together — coach and client on the same side.

**Atmosphere:** Fresh, clear and practical ("WEMAIT v2 · Juntos" identity; "Esencial" design system).

**Color palette:**

|Token|Hex|Usage|
|---|---|---|
|primary|`#0F766E`|Main actions, brand teal|
|primaryPressed|`#115E59`|Pressed state|
|primarySoft|`#CCFBF1`|Soft highlights|
|coral|`#F36545`|Warm accent|
|background|`#F8FAFC`|App background|
|surface|`#FFFFFF`|Cards|
|text|`#0F172A`|Main text|
|textMuted|`#475569`|Secondary text|
|ink|`#091020`|Brand dark (logo/ribbons)|
|danger|`#B91C1C`|Errors, pain alerts|
|warning|`#92400E`|Warnings|

Source: `apps/mobile/src/theme.ts`.

**Typography:**

|Role|Font|Size|Weight|Usage|
|---|---|---|---|---|
|All UI|Manrope|15 px controls|—|Per `docs/DISENO-ESENCIAL.md`|

**Key interactions:** Client "Today" screen with one-tap Start; coach priority traffic light (green / yellow / red); "Prepare client"; group sessions graded in one screen; macro calculator suggestion that the coach reviews.

**Animation principles:** 3-second welcome animation on every opening (owner decision 19-10-2026); otherwise functional.

**Copy voice:**

- ✅ "progress we build together" (main), "forward together" (closing) — always English, lowercase, no period, in both languages.
- ❌ Both taglines under the same logo; tagline on every card; "team" in pricing (it's "clients").

**Design rules (project-specific):** Buttons 44 px surface, 48 px minimum touch area, control text 15 px. Text size Normal/Large/Very large per device. US number format in both languages (150.5 · 1,500). Status never depends on color alone.

**What it must never feel like:** Surveillance of clients, or a medical tool (health conditions → suggest referral).

---

## ARCHITECTURE

**Can it operate independently from Pyadra?** Yes.

**Stack:** npm-workspaces monorepo — Expo 57 (mobile + web), Fastify API, Prisma, SQLite; Resend for email; wger exercise catalog; USDA FoodData Central + Open Food Facts. [Implemented]

**Repository:** GitHub (private), branch `main` is the published source.

**Deploy:** Hostinger VPS (Ubuntu, Docker, Traefik); public demo and account services over HTTPS. [Deployed] Signed store binaries: none yet.

**Pyadra dependencies:** None.

**What independence requires:** 1. Already independent. 2. — 3. —

**Estimated effort for independence:** N/A.

---

## FLOWS

**Coach onboarding:**

```
Coach registers and uploads certification
  ↓
Admin approves (until then, no invitations)
  ↓
Coach builds a System (program + nutrition + habits + check-in)
  ↓
Coach invites clients by link or code
```

**Client day:**

```
Client opens "Today" (works offline)
  ↓
Logs workout, meals, habits, check-in
  ↓
Coach sees priorities and reviews pending items
  ↓
Systems analytics: complies ≥70% · at risk 50–70% · doesn't comply <50% (min. 14 days)
```

**Payments (planned, not built):**

```
Coach connects Stripe Connect
  ↓
Client pays coach directly (recurring, packages, coupons)
  ↓
WEMAIT takes its tier commission (3% → 0%)
```

---

## PRODUCTS AND PRICING

_USD per month · yearly = 2 months free · Owner decisions 30-09, 11-10 and 19-10-2026. Contracting not active._

|Product|Price|Status|Notes|
|---|---|---|---|
|Free|$0 · 2 clients|Owner decision|3% commission; no time limit|
|Starter|$25 · 10 clients|Owner decision|2%|
|Pro|$55 · 30 clients|Owner decision|1%|
|Growth|$95 · 60 clients|Owner decision|0.5%|
|Scale|$159 · 120 clients|Owner decision|0%|
|Elite|$279 · 250 clients|Owner decision|0%, branded app|
|Marketplace (phase 2)|10% own link · 25% via marketplace|Plan|Licenses 15% / 25%|

---

## CURRENT STATE

_Checked October 23, 2026 against `docs/ESTADO.md` (19-10-2026) and the owner's answers._

**What works:**

- Phase 1a complete: coach web, admin, Systems and analytics, ES/EN. [Implemented · Deployed as demo]
- Schedule (stages A–C), notifications (stages 1–2), macro calculator, meal plans with PDF. [Deployed 13–19 Oct 2026]
- Account recovery, sessions, deletion and legal pages over HTTPS with real email. [Deployed]
- Tests: API 756/756, scripts 50/50 at last release. [Verified by tests]
- 5 coaches in conversation. [Owner report, 23-10-2026]

**What's missing:**

- Real notifications on Android/iPhone (stage 3); test with a real coach without help.
- Store accounts, signing, external backups, moderation, legal review; capacity test for 200 clients.
- Payments module (Stripe Connect).

**Active blockers:**

- Owner: confirm entity for the stores, Apple/Google/Expo accounts, monthly budget and support owner.

---

## OPEN QUESTIONS

**Technical:** Capacity for 200 clients and 24 h continuity not yet proven.

**Business:** Individual or company for the stores? Monthly budget? Commissions still "subject to confirmation". Which of the coaches in conversation becomes the first real user?

**Product:** Loose exercises without a program in the schedule; HIIT timer; paid packages and classes with capacity.

---

## DECISIONS LOG

|Date|Decision|Reason|
|---|---|---|
|2026-10-23|Listed on Pyadra (Jungle) as For sale; all participation models active; creator keeps a perpetual royalty through Pyadra|Owner: growth of the projects|
|2026-10-19|Coach assistants are not offered; removed from pricing|Owner decision|
|2026-10-19|Macro calculator in the nutrition goal (coach reviews before saving)|Owner ("haz las 1 a la 3")|
|2026-10-18|Schedule with group sessions from v1|Owner request|
|2026-10-17|Tutorials published without voice-over, style "A · Fresh"|Most people watch muted|
|2026-10-11|Taglines: "progress we build together" / "forward together"|Owner decision|
|2026-09-30|Price by active clients, everything included; commission 3% → 0%|Differentiate from competitors' extras|

Full log: `docs/DECISIONES.md`.

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:** By design, yes: every workout, meal and check-in counts toward the system's result the coach sees. Not yet proven — no coach or client uses it for real yet.

---

## ASSET VALUE

**Maturity level:** MVP — no users (public demo; coaches in conversation).

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical|Monorepo (Expo app, Fastify API, Prisma), 750+ automated tests, VPS deployment, Resend email|
|Brand|WEMAIT name and identity v2 "Juntos", taglines, domain wemait.app, tutorial videos 01–16|
|Product|Coach + client + admin apps, Systems analytics, schedule, nutrition, chat, meal plans|
|Operational|Spec summary, decisions log, backlog, handover guide (`docs/ENTREGA-PROYECTO.md`), coach conversations|

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
|Coach subscriptions|Not active|$25–$279/month per coach|
|Commission on coach charges|Not built (Stripe Connect)|3% → 0% by tier|
|Marketplace of verified systems|Phase 2 plan|10–25% per sale|

**Post-participation structure:**

- Participant / buyer receives: the app, code, brand, domain and documentation, according to the chosen model.
- Original creator retains: a **perpetual royalty percentage, paid through Pyadra** (% set per deal).
- Pyadra receives: the permanent share defined by the participation model, and administers the creator's royalty.

> [!warning] Revenue-share protection The royalty agreement must include a reporting clause, a verification right and non-payment terms. Legal review required before signing.

**What must happen before this project can be sold or partially acquired:**

- [ ] First real coaches and clients using it
- [ ] Payments active
- [ ] Store binaries signed and published

---

## OPTIONAL — SALE-STAGE SECTIONS

_Active since October 23, 2026 (status: For sale)._

### METRICS AND NUMBERS (canonical)

|Metric|Value|Source|Verifiable|
|---|---|---|---|
|Real coaches using it|0|`docs/CONTINUAR.md` (no real users as of 12-10-2026)|Yes — database|
|Coaches in conversation|5|Owner report, 23-10-2026|Partly — messages|
|Automated tests passing|API 756/756 · scripts 50/50|`docs/ESTADO.md` (19-10-2026)|Yes — test run|
|Tutorial videos|16|`docs/DECISIONES.md`|Yes|
|Revenue to date|$0|No payments module|Yes|

### PROOF OF WORK

|Evidence|Status|Availability|Link|
|---|---|---|---|
|Brand site|Live|Public|`https://wemait.app`|
|Full demo with sample data|Live|Public|`https://wemait.app/app/`|
|Source code and history|GitHub (private)|Due diligence|—|
|Tutorial videos 01–16|Produced|Due diligence / social|`docs/branding/tutoriales/`|

### RISKS (The Honest Risks)

|Title|Description|
|---|---|
|No real users yet|Coaches are in conversation, but none uses the app for real yet.|
|Not in the stores|There are no signed iPhone/Android apps; store accounts are still to be opened.|
|Payments not built|Subscriptions and coach charges (Stripe Connect) don't exist yet.|
|Capacity unproven|The target of 200 clients has not been load-tested; external backups are pending.|
|Health data|It stores health and nutrition data; legal review and moderation are pending.|

### DUE DILIGENCE

> [!note] Does NOT appear on the public page. Shared only when there is confirmed serious interest from a potential buyer.

- [ ] Ownership of domain wemait.app, GitHub repository, VPS, Resend account
- [ ] Health-data privacy review (US) and legal texts
- [ ] Data licenses: wger, USDA FoodData Central, Open Food Facts (ODbL credit)
- [ ] List of coaches in conversation and their stage
- [ ] Royalty agreement with reporting, verification and non-payment terms

### SALE — COPY AND CONVERSION

**Main hook (hero):** The coaching platform that proves a coach's system works — built, tested and ready for its first coaches.

**Buyer journey:** Arrival (the problem: coaches can't prove results) → Interest (live demo) → Conviction (750+ tests, pricing designed, coaches in conversation) → Decision (participation model) → Action (talk to Pyadra)

---

## COPY DECK — LOCKED STRINGS

_Open proposal — no Pyadra page exists for this project yet (checked October 23, 2026). Lock these strings when the page is built and stamp: "last reconciled against `page.tsx`, {{date}}"._

### Identity block

- **Type badge:** `Global`
- **Status badge:** `For sale`
- **H1 (project name):** `WEMAIT`
- **Tagline:** `progress we build together`
- **Intro paragraph:** `An app for certified coaches and their clients. Training, nutrition, habits and check-ins in one place — and the data to show whether a coach's system really works. Built, tested and ready for its first coaches.`

### What you get

|Field|String|
|---|---|
|Heading|`What you get`|
|Item 1|`Coach, client and admin apps with their code`|
|Item 2|`The WEMAIT brand, domain and 16 tutorial videos`|
|Item 3|`A pricing model by active clients, ready to switch on`|

### Primary CTA

- **Button:** `Talk to us about WEMAIT`
- **Sub-line:** `forward together`

### Founder block (drawer) — required

- **Founder:** `Christian Ruiz`
- **Photo:** `public/images/wemait/christian_founder.jpg` (same photo on all four of Christian's projects) · chip `Christian · California`
- **Quote (serif italic):** `Coaches change lives every day. WEMAIT exists so they can prove it — with data, not promises.`
- **Signature:** `Christian Ruiz` · `Founder of WEMAIT · Co-founder of Pyadra, 2026`

### Strings that must never appear

```
Taglines with capital letter or final period; both taglines under one logo;
"team" / "assistants" in pricing; any valuation figure
```

---

## ROADMAP

**Now (current quarter):**

- [ ] Real notifications on Android/iPhone (stage 3)
- [ ] First real coach from the current conversations, without help

**Next (following quarter):**

- [ ] Store accounts, signed apps, payments (Stripe Connect)
- [ ] HIIT timer and app on a physical phone

**Future (no fixed date):**

- [ ] Phase 2: verified seal and marketplace

---

## RELATED LINKS

**Documentation:**

- [[Company_Master]]
- `CLAUDE.md`, `docs/ESTADO.md`, `docs/ESPEC-RESUMEN.md`, `docs/DECISIONES.md` (repo — outside this vault)

**Code:** `Documents\wemait` (GitHub, private)

**Sibling projects:** [[Pyadra — URELIT]] (same fitness domain), [[Pyadra — Momentos Eternos]], [[Pyadra — Mentalidad Millonaria Inquebrantable (MMI)]]

---

## RECONCILIATION RITUAL (required)

1. Whenever the page changes meaningfully, this doc is reconciled in the same session.
2. On reconciliation: bump the version at the END line, add a dated `Changelog vX.Y` note, and update the copy-deck stamp.
3. Numbers in Galaxy's sphere copy must be updated when this doc's canonical metrics change — same commit.
4. Never let a claim survive that the code doesn't keep ([[Company_Master]] non-negotiable #13).
5. A changelog records what was actually done. If a change was made only in the doc and not in code, say so.

**Changelog v1.2 (October 23, 2026):** coaches in conversation recorded as 5. Doc only.
**Changelog v1.1 (October 23, 2026):** owner answers added — Jungle, For sale, all participation models active, perpetual royalty through Pyadra, coaches in conversation; palette copied from `theme.ts`; sale-stage sections activated; copy deck and founder block proposed. Doc only — no code changed.
**Changelog v1.0 (October 23, 2026):** first version, built from the repo docs. Doc only.

---

_END · WEMAIT · v1.2_ · _Template v4 · September 19, 2026_
