# EterniCapsule

_Project document · Pyadra_ _Last updated: May 21, 2026_

---

## IDENTITY

**Type:** Type 1 — Native Project **Exhibition:** Galaxy **Status:** Active (in production since April 2026) **Founder / Creator:** Eduardo Díaz **Tagline (1 line):** Cryptographic vault. Zero knowledge. Permanent.

---

## WHAT THE USER SEES BEFORE ENTERING

_This block feeds the public dashboard in Galaxy._ _Maximum 2 lines per field. No technical jargon. Write for the person standing in front of the exhibition._

**What it is (2 lines):**

> A vault for words you can't say today. Write them, seal them in digital metal, and choose the exact day they can be opened.

**What they receive by participating:**

> A permanent message delivered on the date you choose. Only the person you select can open it — not even Pyadra can read it.

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|Capsule Sealing|Capsule Sealing|
|Price|$9 AUD|Fixed — no tiers, no dynamic pricing|
|What's included|Your message sealed, encrypted, and delivered on the exact day you choose. Only your recipient can open it.|Client-side AES encryption, permanent DB storage, scheduled email delivery via Resend, optional guardian system, unique access keys (sender / recipient / guardian)|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|Capsules sealed|`SELECT COUNT(*) FROM ethernicapsule_capsules WHERE status = 'sealed'`|
|Capsules delivered|`SELECT COUNT(*) FROM ethernicapsule_capsules WHERE status = 'opened'`|
|Awaiting delivery|`SELECT COUNT(*) FROM ethernicapsule_capsules WHERE status = 'sealed' AND unlock_date > NOW()`|
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
- **3D:** Three.js + React Three Fiber
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS + Custom CSS Variables (`--etn-*`)
- **Audio:** Web Audio API (`audio.ts`)
- **Backend:** Next.js API Routes (serverless)
- **Database:** Supabase PostgreSQL
- **Payments:** Stripe Checkout + Webhooks
- **Email:** Resend API
- **Encryption:** Client-side AES (CryptoJS), SHA-256 hashing
- **Hosting:** Vercel

**Repository:** Main Pyadra monorepo: `/src/app/exhibitions/galaxy/ethernicapsule`

**Deploy:**

- Production: [pyadra.io/exhibitions/galaxy/ethernicapsule](https://pyadra.io/exhibitions/galaxy/ethernicapsule)
- Vercel auto-deploy from `main`
- Daily cron: `/api/cron/ethernicapsule`

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

**Database schema:**

```sql
CREATE TABLE ethernicapsule_capsules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  sender_email TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  guardian_email TEXT,
  capsule_key_hash TEXT UNIQUE NOT NULL,
  sender_key_hash TEXT UNIQUE NOT NULL,
  guardian_key_hash TEXT UNIQUE,
  message_ciphertext TEXT NOT NULL,
  unlock_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  previewed_at TIMESTAMPTZ,
  guardian_accessed_at TIMESTAMPTZ,
  status TEXT DEFAULT 'sealed'
    CHECK (status IN ('sealed', 'previewed', 'opened', 'guardian_accessed'))
);
```

**API routes:**

|Route|Method|Auth|Purpose|
|---|---|---|---|
|`/api/ethernicapsule/checkout`|POST|Public|Create Stripe session|
|`/api/ethernicapsule/verify`|POST|Key-based|Verify key, return ciphertext|
|`/api/ethernicapsule/edit`|POST|Sender key|Update pending capsule|
|`/api/ethernicapsule/guardian-access`|POST|Guardian key|Emergency unlock|
|`/api/cron/ethernicapsule`|GET|CRON_SECRET|Daily delivery check|

**Security model — zero-knowledge:**

1. Message written in browser
2. Keys generated client-side
3. Message encrypted AES-256 with `capsuleKey`
4. Only ciphertext sent to server
5. Keys hashed SHA-256 before storage
6. Server stores only hashes — never plaintext
7. Server cannot decrypt messages

_Key distribution:_ sender → `senderKey` / recipient → `capsuleKey` / guardian → `guardianKey`

---

## FLOWS

**Seal Flow:**

```
User lands on entry page
  ↓
Complete darkness (3s) → 4-stage typewriter ritual (~30s)
No skip — the ritual is the product
  ↓
"Enter" → 3D zoom-in (2.5s) → main page
  ↓
/compose — fields reveal progressively
Capsule glows brighter as word count grows
  ↓
"PREVIEW CAPSULE" → crystallize sound → /preview
  ↓
"SEAL CAPSULE — $9 AUD"
Keys generated client-side → message encrypted → keys hashed
POST /api/ethernicapsule/checkout → Stripe session
  ↓
Stripe Checkout → payment
  ↓
Webhook → DB (status: sealed) → email with keys via Resend
  ↓
/sealed — capsule turns green patina, breathing slows to 8s
```

**Unlock Flow:**

```
Recipient receives email on unlock_date
Contains: capsule ID + key + link
  ↓
/unlock?id=<uuid> → enters key
POST /api/ethernicapsule/verify → hashes key → compares DB
If match: returns ciphertext
  ↓
Particle burst → screen fades white (2s)
Message decrypted client-side
Fades in: blur(30px) → 0 over 4s
Centered, 24px serif, no UI chrome
"Close" appears after 5s
  ↓
DB: status = 'opened'
```

**Cron Delivery Flow:**

```
Vercel Cron daily 00:00 UTC
GET /api/cron/ethernicapsule (CRON_SECRET)
Query: sealed capsules with unlock_date <= TODAY
For each: send delivery email via Resend
Status stays 'sealed' until recipient opens
```

**Guardian Emergency Flow:**

```
Guardian navigates to /guardian-access
POST /api/ethernicapsule/guardian-access with guardianKey
Hashes key → verifies DB → returns ciphertext
Message decrypted client-side
DB: status = 'guardian_accessed'
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
- ✅ Client-side AES + SHA-256
- ✅ Guardian system
- ✅ Scheduled email delivery (Resend)
- ✅ Sender preview, recipient unlock, guardian access
- ✅ Row Level Security on DB
- ✅ Daily cron delivery
- ✅ Audio engine + SENSORS ACTIVE toggle
- ✅ Mobile responsive

**What's missing:**

- ❌ First real paying user
- ❌ Analytics events — no funnel tracking
- ❌ Rate limiting on API routes
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

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:** Yes — but only for those who complete the ritual. The friction creates real perceived value. The problem is the funnel: many arrive, few seal. No analytics yet to know where people leave. That data is the next priority.

---

## ASSET VALUE

_For potential buyers and participants. Answers: what can they get involved in, how, and what do they receive._

**Maturity level:** MVP — no users yet. Fully functional and deployed. First sale not confirmed.

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical|Full source code (Next.js 16, React 19, TypeScript), Supabase schema + migrations, Stripe integration (live), Resend email system, client-side AES encryption engine, cron delivery system, guardian access system, Vercel deployment config|
|Brand|EterniCapsule name, visual identity (palette, typography, CSS variables), ceremonial UX concept, copywriting voice and guidelines, 3D capsule design and animations, audio engine|
|Product|Operational MVP — full seal → deliver → unlock flow, guardian system, zero-knowledge architecture, mobile-responsive interface|
|Operational|Deployment guide, architecture docs, DB schema, API documentation, independence roadmap (15–25h to fully separate from Pyadra)|

**Participation models:** _Pyadra supports different levels of involvement — from user to full owner._

|Model|Description|Investment range|Status|
|---|---|---|---|
|User|Buys a capsule ($9 AUD). No ownership.|$9 AUD|Active|
|Partial acquisition|Buys a % of the project. Co-operates with original creator. Revenue share proportional to stake.|TBD — requires legal review|Planned (Phase 2)|
|Full acquisition|Buys 100% of the project. Creator retains royalty + advisory role.|TBD — requires legal review|Planned (Phase 2)|
|Hosted ownership|Acquires ownership but project stays inside Pyadra infrastructure. Pyadra maintains deployment and operations.|TBD — requires legal review|Planned (Phase 2)|

**How a participant or buyer makes money:**

|Revenue stream|Current state|Potential|
|---|---|---|
|Capsule sealing ($9 AUD)|Active — no sales yet|200 capsules/month = $1,800 AUD/month|
|Audio capsules — Tier 2|Not built — concept in VISION.md|$25 AUD per capsule|
|Video capsules — Tier 3|Not built — concept in VISION.md|$49 AUD per capsule|
|White-label licensing|Not built|License system to memorial services, therapists, legal firms|

**Post-participation structure:**

- Participant / buyer receives: operational ownership + agreed % of capsule revenue
- Original creator retains: perpetual royalty (% TBD), advisory role
- Pyadra receives: transaction fee on acquisition + hosting % if buyer opts for Pyadra-hosted model

**What must happen before this project can be sold or partially acquired:**

- [ ] First real sale confirmed (validates end-to-end with real users)
- [ ] Stripe webhook separated from monolith (project must deploy independently)
- [ ] Independence architecture completed and tested (15–25h)
- [ ] Legal review completed (ASIC Australia — selling stakes may be classified as financial security)

---

## ROADMAP

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

## RELATED LINKS

**Documentation:**

- [[VISION]]
- [[ARCHITECTURE]]
- [[ROADMAP]]
- [[DATABASE_SCHEMA]]

**Code:**

- `src/app/exhibitions/galaxy/ethernicapsule/page.tsx`
- `src/app/exhibitions/galaxy/ethernicapsule/compose/ComposeFormUnified.tsx`
- `src/app/exhibitions/galaxy/ethernicapsule/Capsule3D.tsx`
- `src/app/api/ethernicapsule/checkout/route.ts`
- `src/app/api/cron/ethernicapsule/route.ts`
- `src/app/exhibitions/galaxy/lib/audio.ts`

**Sibling projects in Galaxy:**

- [[ORBIT77]] — Podcast + supporter funding
- [[FIGURINES]] — Physical figurines from photos

---

_END · ETHERNICAPSULE · v1.6_