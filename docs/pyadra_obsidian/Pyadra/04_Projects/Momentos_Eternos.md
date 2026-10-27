# Momentos Eternos

_Project document · Pyadra · Last updated: October 23, 2026_

> [!important] The truth hierarchy (summary of [[Company_Master]] §6)
>
> 1. **Authoring:** new or changed copy is written in this document's COPY DECK first, then built — never improvised in code.
> 2. **Record:** the live page is the record of what visitors see. If deck and page disagree, the deck is updated to the live string the SAME DAY. If the live string is false, the deck records it, marks it ⚠, and the PAGE is corrected in code.
> 3. **This document** is the source for everything the page doesn't show — each claim labelled with its evidence.

> [!note] Sources (v1.1) Built on October 23, 2026 from the project folder (`Documents\momentos-eternos`: `README.md` of 21-08-2026, `lib/pricing.ts`, `tailwind.config.ts`, `app/layout.tsx`, `lib/i18n`, `marca/CATALOGO.md`) and the owner's answers of the same day. The live site was not re-checked for this version.

---

## IDENTITY

**Type (scope):** GLOBAL — online, any genre and any language **Pyadra relation:** Exhibited external — contributed to Pyadra by co-founder Christian Ruiz **Exhibition:** Jungle **Status:** Paused (functional) · For sale **Founder / Creator:** Christian Ruiz (Pyadra co-founder) **Tagline (1 line):** Personalized songs to give as a gift — any genre, any language.

---

## WHAT THE USER SEES BEFORE ENTERING

**What it is (2 lines):** You tell us a story about someone you love; we turn it into an original song you can give them, with a gift page they open from a QR code.

**What they receive by participating:** A working gift-song business — site, payments, studio panel and brand — that has already sold every package and only needs someone to switch it back on and grow it.

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|Esencial · Premium · Signature|`lib/pricing.ts` (single source of prices and promises)|
|Price|$9.99 · $15.99 · $24.99|Stripe Checkout, USD|
|What's included|Esencial: your song in minutes, automatic lyrics. Premium: you approve the lyrics, 2 versions, reviewed by a person. Signature: + illustrated cover from your photo, dedicated letter, QR code.|Esencial produced by MusicGPT API; Premium/Signature produced by hand from `/admin` within 3 h|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|Songs delivered|`Order` table, status `READY` (today: 3 — see METRICS)|
|Packages sold|`Order` table grouped by tier|
|Average studio delivery time|`Order` paid → ready timestamps|

**Access:**

- Exhibited external: `https://momentoseternos.vercel.app` [Deployed per README, 21-08-2026 — site paused but functional per owner]

---

## INTERNAL DESCRIPTION

**Problem it solves:** Finding a gift that truly moves someone is hard; a song written from your own story surprises, moves and lasts.

**Why it exists on Pyadra:** To grow. The product works and has sold; it is paused for lack of time to run it. Pyadra can bring an operator or owner who restarts and scales it.

**Who it speaks to:** Both — the accessible investor and the creator (buyers of emotional gifts: birthdays, anniversaries, grandparents, graduations, farewells).

---

## EXPERIENCE & DESIGN

**The feeling in one sentence:** Opening a handmade gift — paper, tape and a song that starts when the envelope opens.

**Atmosphere:** Warm analog: paper texture with grain, ink, rust and gold; a 3D scroll "tunnel" of 14 planes on the landing.

**Color palette:**

|Token|Hex|Usage|
|---|---|---|
|paper|`#F7F3EA`|Background|
|ink|`#1C1A17`|Text|
|rust|`#C1502E`|Primary accent, CTAs|
|rust-dark|`#9C3D22`|Accent hover/pressed|
|tape|`#2F5D50`|Secondary accent|
|gold|`#D4A94A`|Highlights|
|cream|`#FBF8F2`|Surfaces|

**Typography:**

|Role|Font|Size|Weight|Usage|
|---|---|---|---|---|
|Display|Space Grotesk|—|—|Headlines|
|Serif|Fraunces|—|—|Emotional copy|
|Mono|JetBrains Mono|—|—|Labels, details|

**Key interactions:** The envelope that opens and starts the song (`SobreRegalo`); five sample songs in tabs; cover style picker; live "time remaining" for studio orders.

**Animation principles:** Scroll-driven 3D depth on the landing; the gift reveal is the moment, everything else stays calm.

**Copy voice:**

- ✅ "I won't describe it. Listen." · say who makes the song, not only how long it takes.
- ❌ Invented social proof (testimonials, stars, sales counters); real artist names ("sounds like X"); brand-name styles ("Pixar", "anime").

**Design rules (project-specific):** Spanish and English must always exist together (the `es.ts` dictionary defines the type). Cover styles are artistic registers: watercolour, animated illustration, pencil portrait, retro vinyl, cinema, digital painting.

**What it must never feel like:** A cheap AI meme, or a promise the studio can't keep.

---

## ARCHITECTURE

**Can it operate independently from Pyadra?** Yes.

**Stack:** Next.js 15 (App Router), Prisma on Postgres (Neon), NextAuth, Stripe, MusicGPT API, Anthropic API (suggested lyrics and dedicated letter), Gmail SMTP, Vercel Blob, Telegram alerts. [Implemented]

**Repository:** Local folder `Documents\momentos-eternos` — no Git.

**Deploy:** Vercel CLI (`vercel --prod`), only when the owner asks. [Deployed] The site can be closed with `SITE_PAUSED`.

**Pyadra dependencies:** None.

**What independence requires:** 1. Already independent. 2. — 3. —

**Estimated effort for independence:** N/A.

---

## FLOWS

**Order and payment:**

```
/order — who it's for, occasion, genre, language, mood, the story (account or guest)
  ↓
/api/checkout creates the Order (PENDING_PAYMENT) and opens Stripe Checkout
  ↓
Stripe webhook confirms payment and branches:
  Esencial → MusicGPT generates (GENERATING) → READY in minutes
  Premium / Signature → IN_STUDIO + Telegram alert → 3-hour clock starts
```

**Studio delivery (Premium / Signature):**

```
/admin shows orders with time remaining
  ↓
Operator uploads two versions, cover, letter and QR at /admin/[id]
  ↓
Order → READY → "your song is ready" email in the purchase language
  ↓
Buyer sees /dashboard; the recipient opens /regalo/[token] from the QR
```

---

## PRODUCTS AND PRICING

|Product|Price|Status|Notes|
|---|---|---|---|
|Esencial|$9.99|Implemented · sold 1|Automatic, delivered in minutes; audio links expire after ~24 h|
|Premium|$15.99|Implemented · sold 1|Lyrics approved before paying, up to 5 rewrites, 2 versions, human review, up to 3 h|
|Signature|$24.99|Implemented · sold 1|+ illustrated cover from photo, printable letter (PDF), QR code|

> [!warning] The 3-hour delivery is contractual: if missed, the amount is refunded. The clock starts with the payment. A new operator inherits this promise.

---

## CURRENT STATE

_Checked October 23, 2026 against the project folder and the owner's answers._

**What works:**

- Full order → payment → delivery flow for the three packages. [Implemented · Verified in real use — one sale per package, owner report]
- Admin production panel with deadline clock; Telegram alert on new studio orders. [Implemented]
- Bilingual site, legal pages (aviso legal, privacidad, condiciones). [Implemented]
- Ads published on Facebook, Instagram and TikTok (catalog revised 30-08-2026). [Owner record — `marca/CATALOGO.md`]

**What's missing:**

- An operator: the project is paused for lack of time to run the studio.
- Permanent storage for Esencial audio (MusicGPT links expire ~24 h).

**Active blockers:**

- Paused by the owner; functional and ready to reopen.

---

## OPEN QUESTIONS

**Technical:** Move Esencial audio to permanent storage (Vercel Blob)?

**Business:** Which acquisition channel worked for the 3 sales? Cost per sale of the ads?

**Product:** Is the 3-hour studio promise sustainable for a new operator, or should Premium/Signature move to a longer window?

---

## DECISIONS LOG

|Date|Decision|Reason|
|---|---|---|
|2026-10-23|Listed on Pyadra (Jungle) as For sale; all participation models active; creator keeps a perpetual royalty through Pyadra|Owner: growth of the projects|
|2026-10-23|Recorded as paused but functional|Owner report|
|Before 21-08-2026|Three packages: automatic Esencial + two manual studio packages|Signature must not read as "costs more and arrives later"|
|Before 21-08-2026|3-hour delivery as a contractual promise with refund|Trust; the clock starts with the payment|
|Before 21-08-2026|No invented social proof; the sample gift is the proof|Honesty|
|Before 21-08-2026|Cover styles named as artistic registers, not brands|Brand rights, model quality, timeless gifts|
|Before 21-08-2026|Admin access only via `ADMIN_EMAILS` environment variable|No way to become admin from inside the app|

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:** This is the product's core: the buyer leaves a real story and gets it back as a song someone keeps. Three real gifts were delivered; there is no recorded feedback from the recipients yet.

---

## ASSET VALUE

**Maturity level:** MVP — first users (3 sales, one per package).

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical|Next.js app with payments, automatic generation, studio panel, bilingual emails, gift pages with QR|
|Brand|Momentos Eternos name, characters M and E, ad videos and images, social copy|
|Product|Three packages, six cover styles with examples, five sample songs|
|Operational|README with flows and pitfalls, content catalog, production scripts, cover prompts per style|

**Participation models:**

|Model|Description|Investment range|Status|
|---|---|---|---|
|Supporter / contribution|Contributes, receives a product or credential. No ownership, no revenue share.|Low (product price)|Active|
|Operator / lower upfront|Lower upfront + higher permanent share to Pyadra. Operator runs it, pays infrastructure.|Medium|Active|
|Owner / higher upfront|Higher upfront + lower permanent share. Operator keeps more per sale.|High|Active|
|Make an offer|Different structure (incl. taking it independent). Private conversation, never a fixed page button.|Negotiable|Active|

> [!note] Valuation method: built product with minimal revenue → reconstruction cost (sales history is too short for an earnings multiple). No valuation headline on the page; the figure is shared privately in due diligence.

**How a participant or buyer makes money:**

|Revenue stream|Current state|Potential|
|---|---|---|
|Song sales|Paused · 3 sales to date ($50.97 gross)|$9.99–$24.99 per order; studio packages carry the margin|

**Post-participation structure:**

- Participant / buyer receives: the site, code, brand, content and documentation, according to the chosen model.
- Original creator retains: a **perpetual royalty percentage, paid through Pyadra** (% set per deal).
- Pyadra receives: the permanent share defined by the participation model, and administers the creator's royalty.

> [!warning] Revenue-share protection The royalty agreement must include a reporting clause, a verification right and non-payment terms. Legal review required before signing.

**What must happen before this project can be sold or partially acquired:**

- [ ] Confirm the site reopens and a test order goes through end to end
- [ ] Permanent audio storage for Esencial
- [ ] Hand-over guide for the studio operator (3-hour production)

---

## OPTIONAL — SALE-STAGE SECTIONS

_Active since October 23, 2026 (status: For sale)._

### METRICS AND NUMBERS (canonical)

|Metric|Value|Source|Verifiable|
|---|---|---|---|
|Orders completed|3 (1 Esencial · 1 Premium · 1 Signature)|Owner report, 23-10-2026|Yes — `Order` table and Stripe|
|Gross revenue|$50.97|Sum of the three package prices|Yes — Stripe|
|Prices|$9.99 · $15.99 · $24.99|`lib/pricing.ts`|Yes — site|
|Status|Paused, functional|Owner report, 23-10-2026|Yes — site|

### PROOF OF WORK

|Evidence|Status|Availability|Link|
|---|---|---|---|
|Site|Paused, functional|Public when reopened|`https://momentoseternos.vercel.app`|
|Stripe payments|3 real sales|Due diligence|—|
|Facebook page (ads published Aug 2026)|Active|Public|`https://www.facebook.com/profile.php?id=61593612624515`|
|Instagram|Active|Public|`https://www.instagram.com/momentos_eternos_io/`|
|Content catalog|Kept|Due diligence|`marca/CATALOGO.md`|

### RISKS (The Honest Risks)

|Title|Description|
|---|---|
|Very short sales history|Only 3 sales; demand at scale is not proven.|
|Paused|The site is closed to new orders until an operator restarts it.|
|Human promise|Premium and Signature are made by hand in 3 hours or refunded; it needs someone available.|
|Supplier dependency|Automatic songs depend on MusicGPT (its links expire in ~24 h and it bans real artist names).|
|AI rights|Rights over AI-generated music and covers depend on the providers' terms; to verify.|
|No Git|The code lives in one local folder; a buyer should move it to version control.|

### DUE DILIGENCE

> [!note] Does NOT appear on the public page. Shared only when there is confirmed serious interest from a potential buyer.

- [ ] Ownership of domain/Vercel project, Neon database, Stripe, Gmail sender, social accounts
- [ ] MusicGPT and image-tool terms: commercial use and transfer of generated works
- [ ] Stripe export of the 3 sales and any refunds
- [ ] Legal texts (aviso legal, privacidad, condiciones) and the refund promise
- [ ] Royalty agreement with reporting, verification and non-payment terms

### SALE — COPY AND CONVERSION

**Main hook (hero):** A gift business that already sold every package — paused, working, and waiting for someone to switch it back on.

**Buyer journey:** Arrival (the envelope and the song) → Interest (three packages, automatic + studio) → Conviction (real sales, complete flow, brand and ads ready) → Decision (participation model) → Action (talk to Pyadra)

---

## COPY DECK — LOCKED STRINGS

_Open proposal — no Pyadra page exists for this project yet (checked October 23, 2026). Strings marked (site) are verbatim from `lib/i18n/dictionaries/en.ts`. Lock them when the page is built and stamp: "last reconciled against `page.tsx`, {{date}}"._

### Identity block

- **Type badge:** `Global`
- **Status badge:** `For sale`
- **H1 (project name):** `Momentos Eternos`
- **Tagline:** `Any genre · Any language` (site)
- **Intro paragraph:** `People tell us a story about someone they love, and we turn it into an original song they can give — with a gift page that opens from a QR code. The site, payments and studio are built, every package has sold, and it is ready to reopen.`

### Benefits (site)

|Field|String|
|---|---|
|Benefit 1|`It moves them`|
|Benefit 2|`It surprises`|
|Benefit 3|`It lasts`|
|Samples title|`I won't describe it.` / `Listen.`|

### Primary CTA

- **Button:** `Talk to us about Momentos Eternos`
- **Sub-line:** `Reopen it, run it or own it through Pyadra.`

### Founder block (drawer) — required

- **Founder:** `Christian Ruiz`
- **Photo:** `public/images/momentos-eternos/christian_founder.jpg` (same photo on all four of Christian's projects) · chip `Christian · California`
- **Quote (serif italic):** `Some stories deserve more than a card. They deserve a song that stays.`
- **Signature:** `Christian Ruiz` · `Founder of Momentos Eternos · Co-founder of Pyadra, 2026`

### Strings that must never appear

```
Testimonials, star ratings, sales counters, "sounds like <artist>",
"Pixar", "anime", any delivery time not in lib/pricing.ts, any valuation figure
```

---

## ROADMAP

**Now (current quarter):**

- [ ] Find an operator or owner through Pyadra

**Next (following quarter):**

- [ ] Reopen the site with a test order end to end
- [ ] Permanent storage for Esencial audio

**Future (no fixed date):**

- [ ] Scale ads by occasion (birthdays, anniversaries, Mother's Day)

---

## RELATED LINKS

**Documentation:**

- [[Company_Master]]
- `README.md`, `marca/CATALOGO.md`, `prisma/schema.prisma` (project folder — outside this vault)

**Code:** `Documents\momentos-eternos` (local, no Git)

**Sibling projects:** [[Pyadra — URELIT]], [[Pyadra — WEMAIT]], [[Pyadra — Mentalidad Millonaria Inquebrantable (MMI)]]

---

## RECONCILIATION RITUAL (required)

1. Whenever the page changes meaningfully, this doc is reconciled in the same session.
2. On reconciliation: bump the version at the END line, add a dated `Changelog vX.Y` note, and update the copy-deck stamp.
3. Numbers in Galaxy's sphere copy must be updated when this doc's canonical metrics change — same commit.
4. Never let a claim survive that the code doesn't keep ([[Company_Master]] non-negotiable #13).
5. A changelog records what was actually done. If a change was made only in the doc and not in code, say so.

**Changelog v1.2 (October 23, 2026):** Facebook and Instagram links added. Doc only.
**Changelog v1.1 (October 23, 2026):** owner answers added — Jungle, For sale, paused but functional, one sale per package, all participation models active, perpetual royalty through Pyadra; sale-stage sections activated; copy deck and founder block proposed. Doc only — no code changed.
**Changelog v1.0 (October 23, 2026):** first version, built from the project folder. Doc only.

---

_END · Momentos Eternos · v1.2_ · _Template v4 · September 19, 2026_
