# {{PROJECT NAME}}

_Project document · Pyadra · Last updated: {{date}}_

> [!note] Template v4 (September 19, 2026) New in v4: status claims carry evidence labels (Implemented / Deployed / Verified in real use / Owner decision / Plan / Open proposal / Unverified — [[Company_Master]] §0); the truth hierarchy is defined once, in [[Company_Master]] §6, and summarized below; the "Type 1 / Type 2" wording is gone; the number-sync rule includes the founder's room. v3 (July 14, 2026) made the copy deck cover every surface, required the FOUNDER BLOCK, made the truth rule explicit (non-negotiable #13), pointed editable numbers to `pyadra_settings`, and defined the reconciliation ritual.

> [!important] The truth hierarchy (summary of [[Company_Master]] §6)
>
> 1. **Authoring:** new or changed copy is written in this document's COPY DECK first, then built — never improvised in code.
> 2. **Record:** the live page is the record of what visitors see. If deck and page disagree, the deck is updated to the live string the SAME DAY. If the live string is false, the deck records it, marks it ⚠, and the PAGE is corrected in code (EterniCapsule's false zero-knowledge claim is the cautionary tale).
> 3. **This document** is the source for everything the page doesn't show (deals, due diligence, history, private valuations) — each claim labelled with its evidence.

---

## IDENTITY

**Type (scope):** <!-- LOCAL / GLOBAL / GLOCAL --> **Pyadra relation:** <!-- Native on Pyadra / External with internal product / Exhibited external --> **Exhibition:** <!-- Galaxy / Jungle / City --> **Status:** <!-- Forming / Active / Paused / Archived --> **Founder / Creator:** **Tagline (1 line):**

> [!note] Type system The primary type is SCOPE — LOCAL (operates in one place), GLOBAL (operates anywhere), or GLOCAL (global reach, local production/delivery). The secondary "Pyadra relation" field captures how the project connects to Pyadra (native / internal product / exhibited), which determines the Access links below.

---

## WHAT THE USER SEES BEFORE ENTERING

_This block feeds the public dashboard in Galaxy._ _Maximum 2 lines per field. No technical jargon. Write for the person standing in front of the exhibition._

**What it is (2 lines):**

**What they receive by participating:**

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|||
|Price|||
|What's included|Human language — no jargon|Full spec if needed|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|||
|||
|||

> [!note] Editable numbers → `pyadra_settings` If a number must change over time without a deploy (a goal, a count, a toggle), it lives as a row in the `pyadra_settings` table and is read with `getSetting(key, fallback)`. Never a new hardcode. Worked example: `orbit.funding_goal_aud`, `orbit.episodes_live`.

**Access:**

- Native on Pyadra: `[internal link]`
- Internal product, external project: `[Pyadra product link]` + `[external project link]`
- Exhibited external: `[external link]`

---

## INTERNAL DESCRIPTION

_For the founder. Does not appear on the dashboard._

**Problem it solves:**

**Why it exists on Pyadra:**

**Who it speaks to:**

<!-- The accessible investor / The creator / Both -->

---

## EXPERIENCE & DESIGN

_How it feels, not just how it works. Required reading before touching any UI component._

**The feeling in one sentence:**

**Atmosphere:**

**Color palette:**

|Token|Hex|Usage|
|---|---|---|
||||

**Typography:**

|Role|Font|Size|Weight|Usage|
|---|---|---|---|---|
||||||

**Key interactions:**

**Animation principles:**

**Copy voice:**

- ✅
- ❌

**Design rules (project-specific):**

**What it must never feel like:**

---

## ARCHITECTURE

_For projects with their own software or infrastructure (skip for purely physical businesses — write "N/A" and why)._

**Can it operate independently from Pyadra?**

<!-- Yes / No / In progress -->

**Stack:**

**Repository:**

**Deploy:**

**Pyadra dependencies:**

<!-- List everything this project needs from Pyadra to function. The goal is for this list to reach zero. -->

**What independence requires:** 1. 2. 3.

**Estimated effort for independence:**

---

## FLOWS

_For projects with software. Document every user journey that touches payment, data, or delivery._ _Format: step → step → step. One flow per block._

**[Flow name]:**

```
Step 1
  ↓
Step 2
  ↓
Step 3
```

---

## PRODUCTS AND PRICING

|Product|Price|Status|Notes|
|---|---|---|---|
|||||

---

## CURRENT STATE

_Label every item with its evidence ([[Company_Master]] §0) and date the check. Code proves an implementation — not sales, ownership, agreements or deployment._

**What works:**

**What's missing:**

**Active blockers:**

---

## OPEN QUESTIONS

**Technical:**

**Business:**

**Product:**

---

## DECISIONS LOG

_One line per decision. Date + decision + brief reason._

|Date|Decision|Reason|
|---|---|---|
||||

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:**

---

## ASSET VALUE

_For potential buyers and participants. Answers: what can they get involved in, how, and what do they receive._

**Maturity level:**

<!-- Idea / Prototype / MVP — no users / MVP — first users / Validated product -->

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical||
|Brand||
|Product||
|Operational||

**Participation models:** _Say which of the ways in apply — acquire, operate, support, work on, carry forward ([[Company_Master]] §3). Match the model to the project. Lower upfront ↔ higher permanent share. The project can always leave Pyadra; staying hosted is a negotiated option, not a lock-in. Infrastructure costs are always the operator's. See [[Company_Master]]._

|Model|Description|Investment range|Status|
|---|---|---|---|
|Supporter / contribution|Contributes, receives a product or credential. No ownership, no revenue share.|Low (product price)|<!-- Active / Planned -->|
|Operator / lower upfront|Lower upfront + higher permanent share to Pyadra. Operator runs it, pays infrastructure.|Medium|<!-- Active / Planned -->|
|Owner / higher upfront|Higher upfront + lower permanent share. Operator keeps more per sale.|High|<!-- Active / Planned -->|
|Make an offer|Different structure (incl. taking it independent). Private conversation, never a fixed page button.|Negotiable|<!-- Active / Planned -->|

> [!note] Valuation method (pick per project type, see [[Company_Master]]) Business with real history → earnings × market multiple (SDE). Built pre-revenue product → reconstruction cost (what it took to build). Idea stage → potential only (lowest). Do NOT show a hard valuation headline on the page — use a worth narrative; share the exact figure privately in due diligence.

> [!warning] Revenue-share protection If a deal includes a revenue share paid over time, the agreement MUST include a reporting clause, a verification right, and non-payment terms. Never close on a handshake. Legal review required before signing.

**How a participant or buyer makes money:**

|Revenue stream|Current state|Potential|
|---|---|---|
||||

**Post-participation structure:**

- Participant / buyer receives:
- Original creator retains: <!-- perpetual royalty %, minority stake, advisory role -->
- Pyadra receives: <!-- transaction fee, hosting %, ecosystem royalty -->

**What must happen before this project can be sold or partially acquired:**

- [ ]
- [ ]

---

## OPTIONAL — SALE-STAGE SECTIONS

_Activate these only when a project moves into active sale / acquisition (like [[Kangaroo_Cleanup]]). Projects in build/exhibit stage can skip them. They live between ASSET VALUE and COPY DECK._

### METRICS AND NUMBERS (canonical)

_When a project sells, its numbers become a due-diligence matter and deserve a dedicated canonical table. This is THE single source of truth for every number; all other mentions point here._

|Metric|Value|Source|Verifiable|
|---|---|---|---|
|||||

### PROOF OF WORK

_Real evidence that the project/business exists and operated. Public, verifiable items a buyer can check themselves._

|Evidence|Status|Availability|Link|
|---|---|---|---|
|||||

### RISKS (The Honest Risks)

_Stated plainly, in the buyer's language. Honesty here builds trust._

|Title|Description|
|---|---|
|||

### DUE DILIGENCE

> [!note] Does NOT appear on the public page. Shared only when there is confirmed serious interest from a potential buyer.

_Checklist of legal, business, financial and operational items to verify before closing._

- [ ]

### SALE — COPY AND CONVERSION

> [!note] Strategy layer — how the page convinces, not just informs. The emotional hook, the buyer journey, CTAs by stage, and urgency. This guides the COPY DECK below; the exact verbatim strings live in the deck.

**Main hook (hero):**

**Buyer journey:** Arrival → Interest → Conviction → Decision → Action

---

## COPY DECK — LOCKED STRINGS

_The verbatim record of every visible string on the project's page. Claude Code and any builder copy these strings VERBATIM — never paraphrase, invent, or "improve" them. If a string is needed that isn't here, add it here first, then build it. If this deck and the live page disagree, update the deck to the live string the same day; if the live string is false, mark it ⚠ and fix the page in code ([[Company_Master]] §6). Stamp: "last reconciled against `page.tsx`, {{date}}"._

> [!important] Why this exists This is what stops the page and the document from drifting apart. The page copies from here; it never improvises copy in code. See [[Company_Master]] Project Standard point 14.

> [!important] The deck covers EVERY surface (v3 rule — learned reconciling all four projects) The deck is not just the main page sections. It must include, verbatim: the **SiteNav status badge** (e.g. `For sale`, `For support`), every **dialog** (contact/checkout modals — kicker, heading, intro, field labels, button states, success and error strings), the **drawer shell** (title, trigger, labels, founder block), any **playful micro-strings** (e.g. Kangaroo's `grab me ✦`), and **post-flow pages** (confirmation/archive pages) if the project has them. Strings with dynamic values are written with placeholders: `{episodes} episodes are public…`.

> [!note] Numbers rule Every NUMBER (price, metrics, counts) has ONE canonical source — the metrics in WHAT THE USER SEES and the PRODUCTS AND PRICING table (or the canonical METRICS table above, for sale-stage projects). The copy deck and prose point to those; a figure is never updated in two places and left to contradict itself.

### Identity block

- **Type badge:** ``
- **Status badge:** ``
- **H1 (project name):** ``
- **Tagline:** ``
- **Intro paragraph:** ``

### [Section name — repeat per page section]

_List each visible block (assets/what-you-get, metrics, CTAs, deal/participation cards, risks, FAQ, footer) with its exact strings in code-formatting._

|Field|String|
|---|---|
||``|

### Primary CTA

- **Button:** ``
- **Sub-line:** ``

### Founder block (drawer) — required

_Every project page shows a human. Photo (landscape 4:3), caption chip, quote, signature._

- **Founder:** `` <!-- the person shown on the page (may differ from the builder — e.g. Pablo on Orbit, Cristian on EterniCapsule, Charina on Figuitoon) -->
- **Photo:** `public/images/{project}/{name}_founder.jpg` · chip `` <!-- e.g. `Pablo · Sydney` -->
- **Quote (serif italic):** ``
- **Signature:** `` · `` <!-- name · role, place/year -->

### Dialog (verbatim) — required if the page has any modal

|Field|String|
|---|---|
|Kicker|``|
|Heading|``|
|Intro|``|
|Field labels|``|
|Submit (+ states)|``|
|Success|``|
|Error fallback|``|

### Strings that must never appear

```
(per Copy voice rules — list the banned words/phrases for this project)
```

---

## ROADMAP

_Priorities only. One line per item. No wishlist — only what's actually planned._

**Now (current quarter):**

- [ ]

**Next (following quarter):**

- [ ]

**Future (no fixed date):**

- [ ]

---

## RELATED LINKS

**Documentation:**

- [[Company_Master]]
- `VISION.md`, `ARCHITECTURE.md` (repo root — outside this vault)

**Code:**

**Sibling projects:**

---

## RECONCILIATION RITUAL (required)

_How this document stays true. Every project doc follows it._

1. Whenever the page changes meaningfully, this doc is reconciled in the same session (ideally the same commit).
2. On reconciliation: bump the version at the END line, add a dated `Changelog vX.Y` note describing what changed and why, and update the copy-deck stamp: _"last reconciled against `page.tsx`, {{date}}"_.
3. Numbers in Galaxy's sphere copy (proof lines, in Galaxy's `PROJECTS` array) must be updated when this doc's canonical metrics change — same commit. (The founder's room moved to `/team` and no longer lists per-project numbers, so Galaxy is the only hardcoded copy.)
4. Never let a claim survive that the code doesn't keep ([[Company_Master]] non-negotiable #13).
5. A changelog records what was actually done. If a change was made only in the doc and not in code, say so.

---

_END · {{PROJECT NAME}} · v{{version}}_ · _Template v4 · September 19, 2026_