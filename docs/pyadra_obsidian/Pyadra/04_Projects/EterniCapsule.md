_Project document · Pyadra · Last updated: July 14, 2026_

> [!warning] TRUTH CORRECTION (July 14, 2026) — read before quoting security claims The product is NOT zero-knowledge today. There is NO client-side encryption in the code: messages are stored in plaintext on Supabase's encrypted infrastructure. What IS true: capsule access requires a unique 128-bit key, keys are stored only as SHA-256 hashes (a lost key is genuinely unrecoverable), and the operator uses the service role server-side only. The public page copy was corrected the same day to stop claiming "encrypted in your browser / not even us can read it" — a false claim is a legal and due-diligence liability. Client-side AES is on the roadmap; when it ships, restore the stronger copy.

---

## IDENTITY

**Type (scope):** GLOBAL **Pyadra relation:** Native on Pyadra **Exhibition:** Galaxy **Status:** Active (in production since April 2026) **Founder / Creator:** Cristian Niño (page, since July 2026; built by Eduardo Díaz) **Tagline (1 line):** Sealed until its day. Key-locked. Permanent.

---

## WHAT THE USER SEES BEFORE ENTERING

_This block feeds the public dashboard in Galaxy._ _Maximum 2 lines per field. No technical jargon. Write for the person standing in front of the exhibition._

**What it is (2 lines):**

> A vault for words you can't say today. Write them, seal them in digital metal, and choose the exact day they can be opened.

**What they receive by participating:**

> A permanent message that opens on the date you choose. Only the keyholder can open it — and lost keys are unrecoverable, even by Pyadra.

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|Capsule Sealing|Capsule Sealing|
|Price|$9 AUD|Fixed — no tiers, no dynamic pricing|
|What's included|Your message sealed behind a unique key and openable only on the day you choose.|128-bit access keys (sender / capsule / guardian token) stored as SHA-256 hashes only; message stored on encrypted infrastructure (plaintext at rest — client-side AES is roadmap); key emails via Resend at sealing; on-demand guardian time-vault unlock|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|Capsules sealed|`SELECT COUNT(*) FROM ethernicapsule_capsules WHERE status = 'sealed'`|
|Capsules delivered|`SELECT COUNT(*) FROM ethernicapsule_capsules WHERE status = 'opened'`|
|Awaiting delivery|`SELECT COUNT(*) FROM ethernicapsule_capsules WHERE status = 'sealed' AND deliver_at > NOW()`|
|Total value generated|`SELECT COUNT(*) * 9 FROM ethernicapsule_capsules WHERE status != 'pending'` (AUD)|

**Conversion funnel (internal — no tracking yet):**

```
Landing → Entry Complete → Compose → Preview → Payment → Sealed
  100%          ?%            ?%        ?%        ?%        ?%
```

**Access:**

- Type 1 — native on Pyadra: [pyadra.io/exhibitions/galaxy/ethernicapsule](https://pyadra.io/exhibitions/galaxy/ethernicapsule)

---

## INTERNAL DESCRIPTION

_For the founder. Does not appear on the dashboard._

**Problem it solves:** There are words, thoughts, confessions, and truths that cannot be said today — too early, too fragile, too dangerous. People need a place where these words can exist without being judged, read, or altered until the right moment arrives. EterniCapsule creates permanence in a world where everything is editable, deletable, and ephemeral.

**Why it exists on Pyadra:** EterniCapsule perfectly embodies Pyadra's philosophy: "What you leave behind matters." Every capsule is an act of intention — a ritual, not a casual click. It is beauty (the breathing 3D monolith, the ceremonial animations), mystery (the threshold entry, the encryption users don't understand but trust), and absolute permanence. Once sealed, the capsule cannot be modified — not even by us.

**Who it speaks to:**

- **Primary:** People who want to preserve something important with ceremonial intention. Letters to your future self, confessions you can't make yet, words of forgiveness that need time.
- **Secondary:** Creators who understand the value of the immutable. Writers, artists, thinkers who want to document their evolution without the temptation to edit the past.

---

## EXPERIENCE & DESIGN

_How it feels, not just how it works. Required reading before touching any UI component._

**The feeling in one sentence:** The moment before closing a letter you know you can never reopen.

**Atmosphere:** Ceremonial, dark, permanent. Like entering a vault — not a store. Every second inside feels intentional. The darkness is not a bug; it is the point. Silence before something important. Weight before something irreversible.

**Color palette:**

|Token|Hex|Usage|
|---|---|---|
|`--etn-void`|`#0D0907`|Deep background, full darkness|
|`--etn-earth`|`#1A1410`|Main background|
|`--etn-soil`|`#2C2218`|Containers|
|`--etn-charcoal`|`#3C2F2F`|Cards, modals|
|`--etn-parchment`|`#F5E6D3`|Primary text|
|`--etn-cream`|`#E8D9D0`|Headlines|
|`--etn-ash`|`#C4B5A8`|Metadata, secondary text|
|`--etn-bronze`|`#C9A961`|Navigation, labels|
|`--etn-bronze-bright`|`#D4AF6E`|Monolith, hero elements|
|`--etn-copper`|`#9C6644`|Primary CTA — SEAL button|
|`--etn-patina`|`#7A9B8E`|Sealed state (oxidation green)|
|`--etn-rust`|`#8B4444`|Error state|
|`--etn-sage`|`#8FAA80`|Success state|

**Typography:**

|Role|Font|Size|Weight|Usage|
|---|---|---|---|---|
|Titles|Cormorant Garamond|48–56px|300–400 italic|H1, H2, capsule preview text|
|Body|EB Garamond|14px|300–400|Paragraphs, descriptions, instructions|
|Data / Labels|JetBrains Mono|9–12px|—|Keys, metadata — uppercase, letter-spacing 0.3–0.5em|

**Key interactions:**

- **Entry ritual** — 30 seconds of darkness and slow typewriter text before anything. No skip button. The time is the message.
- **3D Capsule breathing** — the monolith never stops. Scale 1.0 → 1.02 → 1.0 every 4–6s. Slows to 8s on sealed state.
- **Spotlight cursor** — 600px radial gold glow follows cursor. Particles brighten inside it.

**Animation principles:**

- All movement organic, never mechanical
- Typewriter: 60–70ms per character
- Page transitions: fade + blur, 1.5–2s — no slides, no swipes
- Glow: opacity 0.2 → 0.6 over 500ms
- 60fps desktop, 30fps mobile — reduce particles before reducing quality

**Audio:**

- Ambient drone: 432Hz + 648Hz harmonic (volume 0.03)
- Hover shimmer: 1200Hz → 300Hz (0.1s)
- Enter button hover: 100Hz bass rumble (0.6s)
- Click Enter: white noise shatter (1.5s)
- Seal action: 200Hz → 800Hz with vibrato (1.5s)
- Toggle: SENSORS ACTIVE / MUTED — top right, default active

**Copy voice:**

- Ceremonial, not casual. Direct, not explanatory. Mysterious, not prescriptive.
- ✅ "Seal capsule" / "Enter your key" / "The message is permanent"
- ❌ "Submit" / "Add to cart" / "Get started" / "Learn more" / "Sign up"

**Design rules (project-specific):**

- No vertical scroll on any main page
- No skip button on entry ritual — the 30 seconds are the product
- Capsule color shifts on sealed state: gold → green patina (`--etn-patina`)
- Unlock page: no UI chrome, no nav — only the message centered on dark background

**What it must never feel like:**

- A note-taking app (Notion, Apple Notes)
- An email client
- An e-commerce checkout
- Something you can undo
- Something fast

---

## ARCHITECTURE

_Relevant for Type 1 and Type 2 only._

**Can it operate independently from Pyadra?** In progress — core logic is independent, shared infrastructure must be separated first.

**Stack:**

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript
- **Capsule visual:** CSS/Framer Motion (`Capsule3D.tsx` — no Three.js; the dependency was removed July 2026 as unused)
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS + Custom CSS Variables (`--etn-*`)
- **Audio:** Web Audio API (`audio.ts`)
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase PostgreSQL
- **Payments:** Stripe Checkout + Webhooks
- **Keys:** 128-bit random access keys, SHA-256 hashed at rest (NO client-side message encryption yet — roadmap)
- **Email:** Resend API
- **Hosting:** Vercel

**Repository:** Main Pyadra monorepo: `/src/app/exhibitions/galaxy/ethernicapsule`

**Deploy:**

- Production: [pyadra.io/exhibitions/galaxy/ethernicapsule](https://pyadra.io/exhibitions/galaxy/ethernicapsule)
- Vercel auto-deploy from `main`
- No cron — delivery is on-demand (guardian token system, decision March 31, 2026)

**Pyadra dependencies:**

_Shared code:_

- `/src/app/lib/db.ts` — Supabase client
- `/src/app/lib/validation.ts` — input sanitization
- `/src/app/lib/ethernicapsule-email.ts` — email templates
- `/src/app/exhibitions/galaxy/components/LiveBackground.tsx` — particle background
- `/src/app/exhibitions/galaxy/lib/audio.ts` — audio engine

_Shared styling:_

- `/src/app/globals.css` — CSS variables (`--etn-*`)
- Global typography: Cormorant Garamond, EB Garamond, JetBrains Mono

_Shared infrastructure:_

- Supabase — shared DB, table: `ethernicapsule_capsules`
- Stripe — shared account + **`/api/stripe/webhook` monolithic (🔴 critical blocker)**
- Resend — shared email account
- Vercel — shared deployment

**What independence requires:**

|#|Task|Effort|Priority|Blocker|
|---|---|---|---|---|
|1|Extract Stripe webhook from monolith|4–6h|P0|YES|
|2|Duplicate `db.ts` and `validation.ts` inside project|2–3h|P1|No|
|3|Refactor `LiveBackground` component|1–2h|P2|No|
|4|Extract `--etn-*` CSS to project-scoped file|1h|P2|No|
|5|Independent Vercel deployment + domain|2–3h|P1|No|
|6|DB: migrate to own instance or isolated credentials|2–4h|P1|No|
|7|EterniCapsule-specific `.env`|1h|P1|No|
|8|End-to-end test of independent deployment|2–3h|P0|YES|

**Estimated effort for independence:** 15–25 hours **Fast path (8–10h):** Tasks 1 → 5 → 8. Rest follows.

**Database schema (canonical: `supabase/migrations/0008_full_reset_baseline.sql`):**

```sql
CREATE TYPE capsule_status AS ENUM ('pending', 'sealed', 'previewed', 'opened');

CREATE TABLE ethernicapsule_capsules (
  id UUID PRIMARY KEY,
  created_at / updated_at TIMESTAMPTZ,          -- updated_at auto-trigger
  stripe_session_id TEXT UNIQUE NOT NULL,        -- 'pending_<uuid>' until Stripe
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,                    -- placeholder until webhook
  recipient_name TEXT,
  guardian_email TEXT,
  message TEXT NOT NULL,                         -- plaintext (client-side AES = roadmap)
  sender_key_hash TEXT NOT NULL,                 -- SHA-256 of 128-bit keys
  capsule_key_hash TEXT NOT NULL,
  guardian_token_hash TEXT,
  deliver_at TIMESTAMPTZ,                        -- time-vault opening date
  guardian_key_delivered BOOLEAN NOT NULL DEFAULT false,
  status capsule_status DEFAULT 'pending',
  previewed_at / opened_at TIMESTAMPTZ
);
```

**API routes (all rate-limited 30/min/IP by middleware):**

|Route|Method|Auth|Purpose|
|---|---|---|---|
|`/api/ethernicapsule/checkout`|POST|Public|Insert `pending` capsule + create Stripe session|
|`/api/ethernicapsule/verify`|POST|Key-based|Verify sender/capsule key → status transitions (previewed/opened)|
|`/api/ethernicapsule/edit`|POST|Sender key|Edit capsule within a 24-hour grace period|
|`/api/ethernicapsule/guardian-access`|POST|Guardian token|Time-vault unlock: after `deliver_at`, exchanges the token for the capsule key|
|`/api/stats/ethernicapsule`|GET|Public|Live dashboard counts|

**Security model — key-locked (honest version, July 14, 2026):**

1. Keys generated SERVER-side at checkout: 128 bits of entropy each (`ETN-CREATOR-…` / `ETN-CAPSULE-…`) — upgraded from 32 bits July 14
2. Keys hashed SHA-256 before storage; raw keys exist only in the emails
3. A lost key is unrecoverable — there is no reset
4. The MESSAGE is stored in plaintext on Supabase (encrypted at rest by the provider). The operator technically can read it via the service role. The privacy policy says this honestly.
5. Guardian time-vault: guardian holds a token; after `deliver_at` the token exchanges for the capsule key on demand — no cron
6. Roadmap: client-side AES-GCM so the zero-knowledge claim becomes true

_Key distribution:_ sender → `senderKey` / recipient → `capsuleKey` (via sender or guardian) / guardian → `guardianToken`

---

## FLOWS

**Seal Flow:**

```
User lands on /compose (fields reveal progressively)
Date picker offers tomorrow onwards, validated in the visitor's LOCAL timezone
(a UTC-parsing bug silently blocked the seal button in negative-offset
timezones — fixed July 14, 2026)
  ↓
All fields complete → "Strike the Metal — $9 AUD"
  ↓
POST /api/ethernicapsule/checkout:
  server generates 128-bit keys + guardian token, hashes them,
  inserts capsule (status: pending, stripe_session_id: pending_<uuid>)
  → Stripe session
  ↓
Stripe Checkout → payment → webhook (signature-verified)
  ↓
Webhook: status → sealed, sender_email recorded
Creator email (keys) via Resend
Guardian email: master key immediately, OR time-vault email with token
  ↓
/sealing (ritual animation) → /sealed — green patina
```

**Unlock Flow:**

```
Keyholder opens /unlock (or the letter link from the email)
  ↓
POST /api/ethernicapsule/verify with the key
Hashes key → compares DB
  sender key on sealed capsule → status: previewed
  capsule key → status: opened (+ opened_at)
  ↓
/letter/[id]?key=… renders the message (LetterRenderClient)
```

**Guardian Time-Vault Flow (replaces the old cron — decision March 31, 2026):**

```
At sealing, guardian receives a token by email
(time-vault: "the seal breaks on <date>" · non-vault: master key directly)
  ↓
On/after deliver_at → /guardian → POST /api/ethernicapsule/guardian-access
Token hash verified + deliver_at reached → capsule key released
guardian_key_delivered = true
  ↓
Guardian passes the key on / opens the letter
```

**Grace-Period Edit Flow:**

```
Within 24h of sealing, the sender key authorizes POST /api/ethernicapsule/edit
(recipient, message, guardian email editable; after 24h: permanent)
```

---

## PRODUCTS AND PRICING

|Product|Price|Status|Notes|
|---|---|---|---|
|Capsule Sealing|$9 AUD|Active|Encryption, storage, scheduled delivery, guardian system, access keys|
|Capsule Unlock|Free|Active|Recipients open with their key|
|Guardian Access|Free|Active|Emergency unlock with guardian key|

---

## CURRENT STATE

**What works:**

- ✅ Entry ritual — 4-stage typewriter, darkness, no skip
- ✅ 3D Capsule — breathing, sealed/unsealed states, spotlight cursor
- ✅ Full flow: Compose → Preview → Seal → Payment
- ✅ Progressive field reveal in compose
- ✅ Stripe Checkout (live mode)
- ✅ 128-bit access keys, SHA-256 hashed (upgraded from 32-bit July 14, 2026)
- ✅ Guardian time-vault system (on-demand token — no cron)
- ✅ Key emails at sealing (Resend)
- ✅ Sender preview, recipient unlock, guardian access, 24h grace-period edit (a schema bug that 500'd edits was fixed July 14)
- ✅ Row Level Security on DB, zero public policies (reset 0008)
- ✅ Rate limiting on all API routes (30/min/IP, July 14, 2026)
- ✅ Date validation in the visitor's local timezone (UTC bug fixed July 14)
- ✅ Audio engine + SENSORS ACTIVE toggle
- ✅ Mobile responsive

**What's missing:**

- ❌ Client-side message encryption (AES-GCM) — messages are plaintext at rest today; the page copy was corrected to match reality until this ships
- ❌ First real paying user
- ❌ Analytics events — no funnel tracking
- ❌ Internal metrics dashboard
- ❌ Email reminder 1 week before unlock
- ❌ User capsule dashboard
- ❌ Bundle optimization — Three.js ~600KB
- ❌ E2E tests (Playwright)
- ❌ Loading, error, empty state designs
- ❌ Keyboard navigation + ARIA labels
- ❌ Audio crystallization spec

**Active blockers:**

- 🔴 **Monolithic Stripe webhook** — blocks independence. P0.
- 🟡 **Audio crystallization** — referenced in VISION.md, no spec. Decision needed.

---

## OPEN QUESTIONS

**Technical:**

- Audio crystallization — necessary or feature creep?
- Capsule editable before unlock date with sender key?
- Resend failure on delivery day — retry logic? Fallback?
- Dead man's switch — auto-deliver if sender unreachable?

**Business:**

- Is $9 AUD the right price? No data yet.
- Tiers? — NO. Subscription? — NO.

**Product:**

- Entry ritual too long? Skip for returning users?
- Typewriter speed right? A/B test needed.
- Public capsule examples? — Risk: dilutes intimacy.
- How to communicate "zero-knowledge" without jargon?

---

## DECISIONS LOG

|Date|Decision|Reason|
|---|---|---|
|March 2026|Client-side encryption mandatory|Server must never read messages. Zero-knowledge.|
|March 2026|Fixed price $9 AUD|Ceremonial simplicity. Not "from $9" or "pay what you want."|
|April 2026|Slow typewriter entry ritual (~30s)|Intentional friction. Filters users who want something fast.|
|April 2026|SHA-256 for key hashing, not bcrypt|Encryption keys, not passwords. Faster for lookup.|
|April 2026|Optional guardian system|Emergencies exist — death, illness, catastrophe.|
|May 2026|No social features|Intimate, not viral. Anti-social by design.|
|March 31, 2026|Cron delivery replaced by on-demand guardian tokens|No cron jobs to babysit; guardian unlocks after deliver_at|
|July 14, 2026|Keys upgraded 32 → 128 bits|Unsalted SHA-256 hashes must resist offline brute-force|
|July 14, 2026|Honest security copy — "zero-knowledge" claims removed from the page|No client-side encryption exists yet; a false claim is a legal and due-diligence liability|
|July 14, 2026|Client-side AES-GCM added to roadmap|Make the zero-knowledge promise true, then restore the stronger copy|

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:** Yes — but only for those who complete the ritual. The friction creates real perceived value. The problem is the funnel: many arrive, few seal. No analytics yet to know where people leave. That data is the next priority.

---

## ASSET VALUE

_For potential buyers and participants. Answers: what can they get involved in, how, and what do they receive._

**Maturity level:** MVP — built, functional, deployed. No users/sales yet. Available now for the hosted participation options above (deployment/independence work done on close).

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical|Full source code (Next.js 16, React 19, TypeScript), Supabase schema + migrations, Stripe integration (live), Resend email system, client-side AES encryption engine, cron delivery system, guardian access system, Vercel deployment config|
|Brand|EterniCapsule name, visual identity (palette, typography, CSS variables), ceremonial UX concept, copywriting voice and guidelines, 3D capsule design and animations, audio engine|
|Product|Operational MVP — full seal → deliver → unlock flow, guardian system, zero-knowledge architecture, mobile-responsive interface|
|Operational|Deployment guide, architecture docs, DB schema, API documentation, independence roadmap (15–25h to fully separate from Pyadra)|

**Participation models:** _Both acquisition options are HOSTED — the project stays inside Pyadra. The operator pays infrastructure costs (hosting, email, database) separately in both. The only variables are upfront price and Pyadra's permanent share per capsule._

|Option|Upfront|Pyadra retains per capsule|Operator keeps (of net)|Where it lives|Status|
|---|---|---|---|---|---|
|User|$9 AUD per capsule|—|—|Pyadra|Active|
|**Option 1 — Operator**|$4,000 AUD|15%|85%|Hosted in Pyadra|Available|
|**Option 2 — Owner**|$8,000 AUD|5%|95%|Hosted in Pyadra|Available|
|**Option 3 — Make an offer**|Negotiable|Negotiable|Negotiable|Negotiable (incl. taking it independent)|By conversation|

> [!important] Model logic Lower upfront = higher permanent share for Pyadra, and vice versa. The cheap entry ($4k) is "paid back" to Pyadra through a higher per-capsule cut over time; the expensive entry ($8k) lets the operator keep almost everything per capsule. Both options stay hosted in Pyadra by default because this project is built on Pyadra infrastructure — but per [[Company_Master]], the project can always leave; staying hosted is a negotiated convenience, not a lock-in. Option 3 (make an offer) covers a buyer who wants a different structure, including taking it independent.

> [!note] Market valuation anchor: ~$12,000 AUD — the cost to rebuild this product from zero (≈150–300h of senior development plus design and concept). This is the _value reference_, not a sale price. The sale happens through the options above. Shown to serious buyers, not as a page headline.

> [!note] Infrastructure is NOT free In both hosted options the operator pays the running costs of infrastructure (Vercel hosting, Resend email, Supabase database, Stripe fees). Pyadra provides exhibition, brand and the platform — not subsidised servers. This must be explicit so a buyer never assumes hosting is included for free. NOTE: Pyadra-provided hosting applies HERE because this project is the founder's own and already lives in Pyadra infra. It is NOT a universal Pyadra rule — for other/external projects, the operator provides their own hosting.

> [!warning] Pyadra share vs creator share — not split yet The percentages above go "to Pyadra". Today the founder is both Pyadra and the creator of EterniCapsule, so the whole cut is theirs. The split between Pyadra's structural platform fee and the creator's build royalty is deferred to Phase 2 (when external creators arrive), and requires legal review per [[Company_Master]]. Do not invent the split now without a real case.

**Transaction fee:** Pyadra charges **5% at closing**, to both sides of the deal (buyer and seller), per [[Company_Master]] Phase 1 model. This is separate from the per-capsule share above.

**How a participant or buyer makes money:**

|Revenue stream|Current state|Potential|
|---|---|---|
|Capsule sealing ($9 AUD)|Active — no sales yet|At 200 capsules/month, operator nets ~$1,435 AUD/month after Stripe & a 15% Pyadra share|
|Audio capsules — Tier 2|Not built — concept in VISION.md|$25 AUD per capsule|
|Video capsules — Tier 3|Not built — concept in VISION.md|$49 AUD per capsule|
|White-label licensing|Not built|License system to memorial services, therapists, legal firms|

> [!note] Ticket-size reality A $9 capsule is a small ticket — Stripe alone takes ~$0.56 (6%) per sale. The model only produces meaningful recurring income at volume, or via the higher-ticket audio/video tiers. A buyer should understand they are buying a built, unproven product with upside, not a cash-flowing business.

**Post-participation structure:**

- Operator receives: operational control + the per-capsule majority share (85% or 95% of net, by option)
- Pyadra receives: the per-capsule share (15% or 5%) + 5% transaction fee at closing, permanently
- Operator pays: all infrastructure running costs (hosting, email, DB, Stripe fees)

**What happens when a deal closes:**

- [ ] Buyer chooses Option 1, 2, or 3 (see participation models above)
- [ ] On close: founder does the independence/deployment work needed to hand over (Stripe webhook separation, deployment config) — this is committed work, not a blocker to listing
- [ ] Legal review of the participation agreement (ASIC Australia — revenue-share terms must be checked; selling stakes may be classified as a financial security)
- [ ] Signed agreement with reporting + verification terms before any money moves

> [!note] Listing status This project IS available for the deals above now. The independence/deployment work is done _on close_, when there is a real buyer — it is not a precondition to listing. The page may present the project as available. The legal review is mandatory before signing.

---

## COPY DECK — LOCKED STRINGS

> [!important] How to use this section This is the single source of truth for every visible string on the EterniCapsule **dashboard page** (`page.tsx` — the project-sale page, NOT the /experience app). Claude Code must copy these strings verbatim — do not paraphrase, invent, or "improve". If a string is needed that is not here, add it here first. For any NUMBER, the metrics in "What the user sees before entering" and the participation tables above are canonical — update those first, then the string here.

> [!warning] Two pages, do not confuse them This deck is for the **dashboard** (sells the project). The **/experience** route is the live product app where users actually seal capsules — that has its own ceremonial copy (see Experience & Design section) and is NOT covered here. The dashboard's "ENTER THE VAULT" button is a live demo link into the product — a selling point, not the product page itself.

---

### Identity block

- **Type badge:** `Global · Digital Vault`
- **Status badge:** `Live`
- **H1:** `EterniCapsule`
- **Tagline (serif italic, emerald):** `Leave a message in time. It opens on the date you choose.`
- **Intro paragraph:** `EterniCapsule is an app for saying something today that can only be read in the future — a promise, an apology, words for someone you're not ready to talk to yet. You write it, seal it and pick the date. Until that day arrives, only the key can open it.`

> [!warning] "not even us" REMOVED (July 14, 2026) The intro used to end "no one can open it — not even us", which is false without client-side encryption. Do not restore it until AES-GCM ships.

> [!note] Voice: plain first, crypto second (July 2026) The old tagline ("A cryptographic time capsule. Zero knowledge. Permanent.") tested as not understandable. Lead with what the app does for a person; the encryption proof lives in What You Get and the FAQ.

### What you get (6 things)

Section label: `What You Get` · counter `6 things`

> [!note] Voice: buyer-facing, not technical These describe what the buyer _receives and owns_, not a tech spec sheet. Lead with the value, not the framework name.

|Title|Description|
|---|---|
|`The finished app`|`Frontend, backend and database — built, live and working today. Write, seal, pay, deliver, unlock: the whole journey already works.`|
|`The brand & the design`|`The name, the logo, the gold identity and the ceremonial vault design. The look people remember is done.`|
|`Sealed until its day`|`A capsule opens only with its key, and the keys are never stored — only their fingerprints. A lost key is truly unrecoverable. That seal is the product.`|
|`Payments already flowing`|`Stripe checkout is live and takes $9 the moment someone seals. No setup, no integration work.`|
|`Email & delivery that run themselves`|`Keys go out by email the moment a capsule is sealed, and time-vault capsules unlock for the guardian on the chosen date — no cron jobs, nothing to babysit.`|
|`A safety net for emergencies`|`A guardian system lets a trusted person unlock a capsule if something happens to the sender. The hard, human edge cases are handled.`|

> [!note] Rewritten July 2026 for directness Each item now names the concrete asset (app, brand/design, security, payments, email/delivery, guardian) in plain words — technological but understandable, per owner feedback.

> [!note] Technical detail lives elsewhere The full stack (Next.js 16, React 19, AES-256, Supabase, cron, etc.) is real and matters — but it belongs in the ASSET VALUE / due-diligence section for serious buyers, NOT as the page's first impression. The page sells what they get; due diligence proves how it's built.

### Live metrics widget

> [!warning] These numbers MUST be real — never hardcode fake sales The project has had ZERO sales to date. The old code showed "156 sealed / 42 delivered / $1,404" — these were FAKE and must be removed. Per the project rule, all metrics are dynamic from the database. Until there are real capsules, the page shows true zeroes with an honest, inviting frame. Do not display invented activity.

|Label|Value (real / dynamic)|Sub|
|---|---|---|
|`Capsules Sealed`|live count (currently `0`)|`be the first`|
|`Delivered`|live count (currently `0`)|`on schedule`|
|`Awaiting Delivery`|live count (currently `0`)|`in safe storage`|
|`Total Value`|live count × $9 (currently `$0`)|`AUD generated`|

Data sources (from project doc): sealed = `COUNT status='sealed'`; delivered = `COUNT status='opened'`; awaiting = `COUNT status='sealed' AND unlock_date > NOW()`; total value = `COUNT × 9`.

### Main CTA — REMOVED (was redundant)

> [!important] Do NOT add a big "ENTER THE VAULT" button The old code had a large "ENTER THE VAULT →" button below the monolith that linked to /experience. Remove it. Access to try the live product is ALREADY on the central monolith/logo (it's clickable / interactive). Repeating it as a big CTA is redundant and, on a project-SALE page, wrongly pushes attention to the product instead of the deal. Keep the monolith interactive as the way to try the product; the sub-line `$9 AUD per capsule · client-side sealed` can stay as a small caption near the monolith if useful, but no large duplicate button.

### Participation panel (the deal)

Section label: `Participation Models`

- **Value anchor (left):** label `What it cost to build` · figure `$12,000 AUD` · sub-line `~150 hours of senior dev + design. This is the build cost — not the price.`
- **Availability (right):** label `Availability` · figure `100% Available`

> [!important] $12,000 is NOT the asking price (July 2026) The figure was being read as "the buyer pays $12,000". The label and sub-line must make explicit that this is what building it cost, and that the deals below start lower.

> [!note] Show the work behind the value Instead of a bare "valuation", show what the project represents: the hours and craft that went into it. Format: a figure ($12,000) with a sub-line stating the development effort (~150 hours of senior development + design). This frames the price as "this is what it cost to build — you get it for less" rather than an arbitrary number a buyer can argue down. Adjust the hour count to the real estimate if known; ~150h is the working figure for a built MVP of this complexity.

> [!important] The participation panel is for ACQUIRING THE PROJECT only Do not put "Seal a Capsule" / the $9 product in this panel. Trying the product lives on the central monolith (interactive). This panel is exclusively the three acquisition options below, styled like Kangaroo's deal choices. Selecting any of them opens the **request-information form** (same pattern as Kangaroo's "TAKE THIS OVER" → contact form), NOT a mailto.

Acquisition options (deal cards — open the request-info form on click):

|Name|Sub|Description (one line under the sub)|Price tag|
|---|---|---|---|
|`Operator — hosted`|`$4k up front · Pyadra keeps 15% per capsule`|—|`$4,000`|
|`Owner — hosted`|`$8k up front · Pyadra keeps 5% per capsule`|—|`$8,000`|
|`Make an offer`|`Different structure? Let's talk.`|`Including taking the full architecture to your own servers.`|`Let's talk`|

**Panel footnote:** `"Hosted" = the app keeps running on Pyadra's servers; you cover its running costs (hosting, email, database, payment fees). Prefer your own servers? Make an offer.`

> [!warning] One-screen budget (July 2026) The page is single-screen on desktop; the Participation panel must stay ≤ ~455px tall or it crushes The Honest Risks panel below it. That's why "hosted" is explained once in the footnote (not repeated per deal card) and only "Make an offer" carries a description line. Don't add more lines to this panel without re-checking the risks panel is still visible at 1440×810.

> [!note] Request-info form Mirror Kangaroo's contact form: name, email, optional message, and which option they're interested in (pre-filled from the card they clicked). On submit, it reaches the founder. This replaces the old mailto links for acquisition. "Make an offer" routes to the same form with the message field emphasised.

### Risks (The Honest Risks)

Section label: `The Honest Risks`

> [!note] Voice: plain and honest, not technical Say the real risk in words a buyer feels, not in engineering terms.

|Title|Description|
|---|---|
|`No one has bought one yet`|`The app is finished and working, but the first paying customer hasn't arrived. You'd be buying a finished product, not a proven market.`|
|`We can't see where visitors give up`|`There are no analytics installed, so we don't know why people leave without sealing a capsule. Installing them and finding out is the new owner's first job.`|
|`It runs on Pyadra's servers today`|`Hosting, database and payments all live on Pyadra's accounts. Moving everything to your own is a documented job (~20 hours), done on close if you take it independent.`|
|`It's slow on purpose`|`Sealing takes a deliberate 30-second ritual. That's what makes it feel important — but it also means it will never be a fast, impulse-buy product.`|
|`$9 is a small ticket`|`Payment fees take about 6% of each $9 capsule. Real income needs volume — or the planned $25 audio and $49 video capsules.`|

> [!note] Rewritten July 2026 Titles and descriptions restated in words a first-time visitor understands without knowing the project (owner feedback: "yo lo entiendo porque sé de qué es el proyecto, pero la gente no").

### FAQ (drawer)

Drawer title: `Vault Details` (rename — see note) · trigger: `Read FAQ & Origin Story →`

|Q|A|
|---|---|
|`Does it actually work?`|`Yes — the complete flow is live: compose, seal, pay $9, scheduled delivery, unlock with a key. Try it yourself in the vault.`|
|`How is a capsule protected?`|`Every capsule opens only with its unique 128-bit key. Keys are never stored — only cryptographic hashes — so a lost key is truly unrecoverable. Messages rest on encrypted infrastructure, and full in-browser encryption is on the roadmap.`|
|`What exactly would I own?`|`The code, the brand, the ceremonial experience, the key and delivery system — plus a documented roadmap to full independence. It stays hosted in Pyadra unless you negotiate otherwise.`|
|`Why is there no revenue yet?`|`It launched recently and the first sale is still pending. We say it plainly because everything on Pyadra is said plainly.`|

### Founder block (drawer)

> [!important] The founder is Cristian Niño (July 2026) Eduardo is handing this project to Cristian Niño. The drawer shows Cristian's photo (like Kangaroo's founder block), his quote, and his name. All dialog copy ("Talk with…", "…will reply") says **Cristian**, not Eduardo. Enquiries still arrive at pyadra@pyadra.io.

- **Photo:** `public/images/ethernicapsule/cristian_founder.jpg` (landscape 4:3 preferred) · alt `Cristian Niño, founder of EterniCapsule` · caption chip `Cristian · Australia`
- **Quote:** `"I came to Australia as an IT student with a suitcase and a head full of ideas. I like building things that feel different — and EterniCapsule is the one I couldn't let go: a place where sealed means sealed, until the day you chose."`
- **Signature:** `Cristian Niño` · `Founder · EterniCapsule, 2025`

### Secondary CTAs & labels

- **Drawer contact button:** `Contact the founder`
- **Contact email (everywhere):** `pyadra@pyadra.io`
- **Footer:** `© 2026 Pyadra · We document. We verify. You decide.`
- **Footer links:** `Home` · `Galaxy`

### Strings that must never appear (per Experience & Design copy voice)

```
Submit · Add to cart · Get started · Learn more · Sign up · Buy now
fake metrics / invented sales numbers
"guaranteed" returns · "passive income"
```

---

**Now (Q2 2026 — May / June):**

- [ ] First real paying user
- [ ] Analytics events to track funnel drop-off
- [ ] Rate limiting on all API routes
- [ ] Extract Stripe webhook (independence — P0)
- [ ] Internal metrics dashboard

**Next (Q3 2026 — July / September):**

- [ ] Email reminder 1 week before unlock
- [ ] A/B test entry ritual (skip for returning users)
- [ ] User capsule dashboard — "My Capsules"
- [ ] E2E tests with Playwright
- [ ] Bundle optimization (Three.js code splitting)
- [ ] Define audio crystallization spec

**Future (no fixed date):**

- [ ] Audio capsules — Tier 2 (voice recording + transcription)
- [ ] Video capsules — Tier 3 (cinematic AI-generated farewell)
- [ ] White-label licensing model
- [ ] Independence architecture complete → ready for Phase 2 acquisition
- [ ] Multi-language support (English + Spanish)

---

## ROADMAP

_Priorities only. One line per item._

**Now (current quarter):**

- [ ] Client-side message encryption (AES-GCM with the capsule key) — makes the zero-knowledge promise true, then restore the stronger page copy
- [ ] Get the first real sale (validates the funnel end-to-end with a paying user)
- [ ] Add basic analytics to see where users drop off before sealing

**Next (following quarter):**

- [ ] Separate the Stripe webhook + database from the Pyadra monolith (independence, ~15–25h) — done on close if a buyer wants it independent
- [ ] Decide on the audio crystallization spec (necessary or feature creep?)

**Future (no fixed date):**

- [ ] Tier 2 — audio capsules ($25 AUD)
- [ ] Tier 3 — video capsules ($49 AUD)
- [ ] White-label licensing (memorial services, therapists, legal firms)

---

## RELATED LINKS

**Documentation:**

- [[VISION]]
- [[Company_Master]]
- `supabase/README.md` — table ownership + schema source of truth

**Code:**

- `src/app/exhibitions/galaxy/ethernicapsule/page.tsx` (dashboard)
- `src/app/exhibitions/galaxy/ethernicapsule/compose/ComposeFormUnified.tsx`
- `src/app/exhibitions/galaxy/ethernicapsule/Capsule3D.tsx`
- `src/app/exhibitions/galaxy/ethernicapsule/letter/[id]/page.tsx`
- `src/app/api/ethernicapsule/{checkout,verify,edit,guardian-access}/route.ts`
- `src/app/lib/ethernicapsule-email.ts`
- `src/app/exhibitions/galaxy/ethernicapsule/lib/audio.ts`
- `supabase/migrations/0008_full_reset_baseline.sql` (canonical schema)

**Sibling projects in Galaxy:**

- [[ORBIT77]] — Podcast + supporter funding
- [[Figuitoon]] — Physical figurines from photos

---

> [!note] Changelog v1.7 (June 2026) — Defined the economic model: two HOSTED participation options (Operator $4k + 15% / Owner $8k + 5%) plus Make-an-offer, all staying in Pyadra; operator pays infrastructure; 5% transaction fee at close; $12k reconstruction-value anchor (not a sale headline). Marked project as available now (deployment work on close, not a precondition). Added COPY DECK — LOCKED STRINGS for the dashboard page, including removal of the FAKE metrics (156/42/$1,404 → real zeroes), email fix to pyadra@pyadra.io, and removal of the "$4,000 valuation" headline. Pyadra-vs-creator share split deferred to Phase 2 with legal review.

> [!note] Changelog v1.8 (June 2026) — Copy refinement pass on the deck: rewrote "Technical Assets" → "What You Get" in buyer-facing language (value, not tech spec); rewrote risks in plain language; value anchor now shows build effort (~150h + $12,000) instead of a bare valuation; removed the redundant big "ENTER THE VAULT" button (product access lives on the monolith); removed "Seal a Capsule" from the acquisition panel (panel is acquisition-only); acquisition cards now open a Kangaroo-style request-info form instead of mailto links.

> [!note] Changelog v1.9 (June 2026) — Restored the ROADMAP section (Now/Next/Future) that had been missing, reconstructed from the project's own dispersed info (first sale + analytics now; independence separation next; audio/video tiers + white-label future).

> [!note] Changelog v2.0 (July 14, 2026) — TRUTH RECONCILIATION against production code. Removed the false zero-knowledge/client-side-AES claims everywhere: the code has NO in-browser encryption; messages are plaintext at rest (page copy corrected the same day — intro, "Sealed until its day" card, protection FAQ, delivery card; decorative "AES-256/Encrypting payload" strings in the sealing animation replaced with honest ones). Documented the REAL schema (0008: pending status, deliver_at, guardian_token_hash, plaintext message), the real flows (on-demand guardian time-vault replaced the cron in March; grace-period edit; letter page), 128-bit keys (upgraded from 32-bit July 14), rate limiting, the local-timezone date fix and the edit-500 fix. Stack corrected (no Three.js/CryptoJS). Founder shown is Cristian Niño. Client-side AES-GCM added as the top roadmap item so the stronger copy can return honestly.

_END · ETHERNICAPSULE · v2.0_