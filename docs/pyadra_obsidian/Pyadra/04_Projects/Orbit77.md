
_Project document · Pyadra_ _Last updated: May 21, 2026_

---

## IDENTITY

**Type:** Type 2 — External Project with Internal Product **Exhibition:** Galaxy **Status:** Active **Founders:** Pablo & Eduardo **Tagline (1 line):** Real conversations. No filters. No script. No bullshit.

---

## WHAT THE USER SEES BEFORE ENTERING

_This block feeds the public dashboard in Galaxy._ _Maximum 2 lines per field. No technical jargon. Write for the person standing in front of the exhibition._

**What it is (2 lines):**

> A podcast recorded from Australia exploring liminal questions about life, creation, identity, and what we leave behind. 10 episodes live. No script. No filters. Raw transmissions.

**What they receive by participating:**

> A permanent digital credential (O77-S1-XXXXXX) engraved in the archive. Founding member status, early access to Season 2, and direct updates from Pablo & Eduardo.

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|Season 1 Supporter Credential|Digital credential + founding member access|
|Price|$10 / $20 / $50 AUD|Three tiers — Signal Carrier / Archive Node / Transmission Keeper|
|What's included|Permanent Archive ID, founding member status, early Season 2 access, direct founder updates|`orbit_support_credentials` table, unique code O77-S1-XXXXXX, email delivery via Resend|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|Season 2 funding progress|`/api/stats/orbit-fund` → `SUM(orbit_support_credentials.amount_aud)`|
|Total supporters|`SELECT COUNT(*) FROM orbit_supporters`|
|Funding goal|$1,000 AUD (fixed production budget — acceptable hardcode)|

**⚠️ Known data debt:** Episodes live count (currently 10) is hardcoded in the UI. Must become dynamic in Season 2 via an `orbit_episodes` table.

**Access:**

- Internal product (credential): `/exhibitions/galaxy/orbit`
- Crew applications: `/exhibitions/galaxy/orbit/join`
- Podcast — YouTube: [@Orbit77Podcast](https://www.youtube.com/@Orbit77Podcast)
- Podcast — Spotify: TBD
- External store: [orbit77.shop](https://orbit77.shop/)
- Instagram: TBD

---

## INTERNAL DESCRIPTION

_For the founders. Does not appear on the dashboard._

**Problem it solves:** Independent creators struggle to fund meaningful content without compromising creative control. Orbit 77 solves this by building a direct relationship with supporters who believe in permanent, unfiltered conversations over viral, disposable content.

**Why it exists on Pyadra:** Orbit 77 embodies Pyadra's philosophy: "What you leave behind matters." It is not optimized for virality or algorithm gaming. It is built for permanence, intention, and community funding. Every supporter receives a permanent credential — they become part of the archive, not just a transaction.

**Who it speaks to:**

- **The accessible investor:** People who want to support independent creation without needing wealth. $10–50 contributions matter.
- **The creator:** Other podcasters and content creators looking for an alternative funding model that respects their audience and creative control.

---

## EXPERIENCE & DESIGN

_How it feels, not just how it works. Required reading before touching any UI component._

**The feeling in one sentence:** Accessing a restricted transmission from deep space — secure, encrypted, exclusive, and raw.

**Atmosphere:** Heavy tension, brutalist transmission aesthetic. Like listening to intercepted communications from a restricted orbital station. High-contrast alert tones, stark blacks, glowing greens, golden warnings. Terminal-style interface. Everything feels secure, intentional, and permanent.

**Color palette:**

|Token|Hex|Usage|
|---|---|---|
|`--orbit-black`|`#020503`|Base canvas, deep void|
|`--orbit-void`|`#050A07`|Card backgrounds|
|`--orbit-deep`|`#0A1A0D`|Elevated surfaces|
|`--orbit-charcoal`|`#0A120D`|Input backgrounds|
|`--orbit-green`|`#39FF14`|PRIMARY — signal active, CTAs, pulses|
|`--orbit-gold`|`#FFB000`|PRIMARY — Pyadra accent, tension, titles|
|`--orbit-cream`|`#F4EFEA`|Primary text|
|`--orbit-alert`|`#FF4444`|Critical alerts|

**Typography:**

|Role|Font|Size|Weight|Usage|
|---|---|---|---|---|
|Titles|Playfair Display / Cormorant|3xl–8xl|Light italic|Hero, section headings|
|Body|Inter / Geist Sans|sm–base|Light / Regular|Descriptions, body copy|
|System|JetBrains Mono / Source Code Pro|xs–sm|Regular / Bold|Stats, labels, terminal text|

**Key interactions:**

- **Glitch transmission effect** — Hero title and Latest Episode card auto-glitch every 8 seconds, mimicking signal interference
- **Orbital diagram** — Season 1 (inner orbit, complete, green) + Season 2 (outer orbit, partial based on funding %, gold). Animated satellite orbits Season 1.
- **Funding progress bar** — Dynamic, real-time with animated stripe pattern

**Animation principles:** Organic breathing over mechanical linearity. Glitch effects brief and unpredictable. Scroll reveals fade in with slight blur. Pulses use elastic easing. Movement feels like signal drift, not button clicks.

**Copy voice:** Ritual over transactional. Military terminal meets sacred archive.

- ✅ "Lock In Your Frequency" / "Hold The Signal" / "Transmission Recorded" / "Archive ID: O77-S1-XXXXXX"
- ❌ "Support Orbit 77" / "Donate Now" / "Season Pass" / "Subscribe"

**Design rules (project-specific):**

- Minimum typography: 12px (WCAG AAA enforced)
- Maximum 3–4 glows per page — avoid over-illumination
- Green = signal active / CTAs. Gold = tension / Pyadra ecosystem.
- Backdrop blur: `sm` default, `md` only for critical modals
- No FilmGrain component — removed for performance

**What it must never feel like:** A LinkedIn job board. A Patreon tier page. A SaaS landing page. A corporate KPI dashboard.

---

## ARCHITECTURE

_Type 2 — podcast lives externally (YouTube, Spotify). Credential lives natively on Pyadra._

**Can it operate independently from Pyadra?** No — currently integrated with Pyadra's Stripe account, Supabase DB, and email infrastructure.

**Stack:**

- **Framework:** Next.js 16 + React 19
- **Animations:** Framer Motion
- **Database:** Supabase PostgreSQL
- **Payments:** Stripe (live mode)
- **Email:** Resend (transactional)
- **Hosting:** Vercel

**Repository:** Main Pyadra monorepo: `/src/app/exhibitions/galaxy/orbit`

Key files:

- `src/app/exhibitions/galaxy/orbit/page.tsx`
- `src/app/exhibitions/galaxy/orbit/join/page.tsx`
- `src/app/exhibitions/galaxy/orbit/components/`
- `src/app/api/donate/route.ts`
- `src/app/api/stats/orbit-fund/route.ts`
- `src/app/api/applications/route.ts`
- `src/app/api/stripe/webhook/route.ts` (shared — critical blocker)
- `src/app/lib/email.ts`

**Deploy:** Production: [pyadra.io/exhibitions/galaxy/orbit](https://pyadra.io/exhibitions/galaxy/orbit)

**Pyadra dependencies:**

- Stripe — shared account with EterniCapsule and Figurines
- Supabase — shared DB, tables: `orbit_supporters`, `orbit_support_credentials`, `orbit_applications`
- Resend — shared email service
- `/api/stripe/webhook` — monolithic webhook (🔴 critical blocker)
- Shared components: `ProjectNav`, `LiveBackground`
- Design tokens in `globals.css`

**What independence requires:**

|#|Task|Effort|Priority|Blocker|
|---|---|---|---|---|
|1|Extract Orbit Stripe webhook from monolith|3–4h|P0|YES|
|2|Dedicated Supabase project or extract 3 tables|3–4h|P1|No|
|3|Separate Resend API key|1h|P1|No|
|4|Duplicate shared components|2–3h|P2|No|
|5|Extract design tokens to Orbit-specific CSS|1h|P2|No|
|6|End-to-end test of independent deployment|2h|P0|YES|

**Estimated effort for independence:** 10–12 hours

**Database tables:**

- `orbit_supporters` — one record per supporter (email, display name, anonymity toggle)
- `orbit_support_credentials` — one per contribution (O77-S1-XXXXXX, amount, tier)
- `orbit_applications` — crew applications (name, email, role, message, status)

**API routes:**

|Route|Method|Auth|Purpose|
|---|---|---|---|
|`/api/donate`|POST|Public|Create Stripe Checkout session|
|`/api/stats/orbit-fund`|GET|Public|Return total funding amount|
|`/api/applications`|POST|Public|Submit crew application|
|`/api/stripe/webhook`|POST|Stripe signature|Process payments (shared — needs split)|

---

## FLOWS

**Flow 1 — Supporter Contribution:**

```
Observer lands on /exhibitions/galaxy/orbit
  ↓
Clicks "Lock In Now →"
  ↓
Modal opens with credential preview
  ↓
Fills: Display Name (optional), Email, visibility toggle, optional message
Selects tier: $10 / $20 / $50 AUD
  ↓
"Lock In Transmission" → POST /api/donate → Stripe session
  ↓
Stripe Checkout → payment
  ↓
Webhook → upserts orbit_supporters → inserts orbit_support_credentials (O77-S1-XXXXXX)
Sends credential email via Resend
  ↓
/transmission-confirmed → credential card displayed
```

**Flow 2 — Crew Application:**

```
Observer clicks "Join Crew" → /exhibitions/galaxy/orbit/join
  ↓
Fills: Name, Email, Role, Portfolio link, "Why Orbit 77?" message
  ↓
POST /api/applications → orbit_applications (status: pending)
  ↓
"Application recorded. Pablo and Eduardo will review shortly."
(Future: email notification to founders + admin dashboard)
```

**Flow 3 — Stats & Progress Tracking:**

```
Page loads → useEffect → GET /api/stats/orbit-fund
API: SUM(orbit_support_credentials.amount_aud)
Returns { total: X }
  ↓
Funding % = (total / 1000) * 100
Progress bar animates 0% → funding % (Framer Motion)
Orbital diagram: Season 2 arc draws to funding %
Legend: "X% funded — $X / $1,000 AUD"
```

---

## PRODUCTS AND PRICING

|Product|Price|Status|Notes|
|---|---|---|---|
|Season 1 Credential — Signal Carrier|$10 AUD|Active|Entry tier|
|Season 1 Credential — Archive Node|$20 AUD|Active|Recommended tier|
|Season 1 Credential — Transmission Keeper|$50 AUD|Active|Premium tier|
|Official Merchandise|Variable|Active|External: [orbit77.shop](https://orbit77.shop/)|
|Season 2 Episodes — early access|TBD|Planned Q3–Q4 2026|For Season 1 supporters|

**Funding goal:** $1,000 AUD for Season 2 production (10 episodes).

---

## CURRENT STATE

**What works:**

- ✅ 10 episodes live on YouTube
- ✅ Supporter contribution flow (Stripe + Supabase + Resend)
- ✅ Credential generation (O77-S1-XXXXXX)
- ✅ Three contribution tiers with distinct names
- ✅ Dynamic funding progress bar
- ✅ Orbital diagram (Season 1 complete, Season 2 in progress)
- ✅ Crew application system
- ✅ Design tokens (100% consistency)
- ✅ WCAG AAA typography (12px minimum)
- ✅ Performance optimized (FilmGrain removed, backdrop-blur reduced)
- ✅ Ritual copy language throughout

**What's missing:**

- ❌ Episodes count dynamic (currently hardcoded as 10)
- ❌ Private supporter archive page (`/archive/[supporter_id]`)
- ❌ Admin dashboard for crew applications (currently manual SQL)
- ❌ Email notifications to founders on new applications
- ❌ Spotify + Instagram links (placeholders exist)
- ❌ Custom audio/video player (currently YouTube embeds)
- ❌ Season 2 episode DB structure
- ❌ Mobile experience audit

**Active blockers:**

- 🔴 **Monolithic Stripe webhook** — blocks independence. P0.
- 🟡 **Season 2 funding incomplete** — needs $1,000 AUD. Check `/api/stats/orbit-fund`.
- 🟡 **Crew review manual** — applications in DB, no admin interface yet.

---

## OPEN QUESTIONS

**Technical:**

- Private archive: credential code gate or email magic link?
- Season 2 credential versioning: O77-S2-XXXXXX or tier-based?
- Custom audio player or keep YouTube embeds?

**Business:**

- Revenue split if Orbit 77 is partially acquired — what % do Pablo & Eduardo retain?
- Season 2 tiered early access (supporters get Ep 1–3 one week early)?
- Is $1,000 AUD realistic for 10 episodes or should the goal be higher?
- Physical Orbit Store — when does this become a real planning item?

**Product:**

- Supporter profile pages showing all credentials across seasons?
- Public leaderboard of top supporters (opt-in)?
- What happens to Season 1 supporters when Season 2 launches — auto-upgrade or new credential?

---

## DECISIONS LOG

|Date|Decision|Reason|
|---|---|---|
|April 6, 2026|Moved from `/projects/orbit` to `/exhibitions/galaxy/orbit`|Galaxy exhibition consolidation|
|April 13, 2026|Removed "Mission Status" and "Who We Need" sections|Corporate noise — broke immersion|
|April 14, 2026|Design tokens in globals.css|Consistency with EterniCapsule and Figurines|
|April 14, 2026|12px minimum typography + WCAG AAA|Accessibility and legibility|
|April 14, 2026|Removed FilmGrain component|Performance — regenerated noise 20x/second|
|April 14, 2026|Backdrop-blur `xl` → `sm`|40–50% performance gain without visual loss|
|April 14, 2026|Transactional → ritual copy|"Support" → "Lock In", "Distribution Fund" → "Season 2 Fund"|
|May 7, 2026|Orbital diagram visualization|Visual representation of Season 1 complete + Season 2 funding|

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:** Yes — for supporters. When you contribute, you receive a permanent credential engraved in the archive. You are not just a supporter — you are part of the permanent record.

No — for casual observers. If you only watch on YouTube, you don't feel permanence. That is intentional. The tension between public audience and permanent archive is the product.

---

## ASSET VALUE

_For potential buyers and participants. Answers: what can they get involved in, how, and what do they receive._

**Maturity level:** MVP — first users confirmed (credential system operational, supporters exist).

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical|Source code (Next.js 16, React 19), Supabase schema + migrations (3 tables), Stripe integration (live), Resend email system, credential generation system, funding stats API, crew application system, orbital diagram visualization, Vercel deployment config|
|Brand|Orbit 77 name, visual identity (palette, typography, design tokens), ritual copy voice and guidelines, orbital concept and aesthetic, orbit77.shop domain|
|Product|Operational credential system, three contribution tiers, crew application flow, dynamic funding tracker, 10 episodes of Season 1 content (YouTube)|
|Operational|Deployment guide, architecture docs, DB schema, independence roadmap (10–12h to fully separate from Pyadra)|

**Participation model — CONTRIBUTION, not sale (initial draft v1 · iterate with Pablo)**

> [!important] Orbit 77 is NOT being sold — it raises support It is the active creative work of Pablo & Eduardo, who keep it. The goal is to fund Season 2, not hand the project over. So the model is layered CONTRIBUTION (crowdfunding-style), not acquisition. People give to be part of the journey and get recognition/perks — NOT equity, NOT revenue share, NOT a vote on the creative direction. This protects the founders' voice (the whole point of Orbit 77) while raising money. This whole section is a v1 starting point to refine with Pablo — numbers are provisional.

**The contribution layers (draft):**

|Layer|Amount (AUD)|What they get|What they do NOT get|
|---|---|---|---|
|Signal Carrier|$10|Permanent credential, name in the archive|No ownership, no return|
|Archive Node|$20|Above + early Season 2 access|No ownership, no return|
|Transmission Keeper|$50|Above + founder updates, higher status|No ownership, no return|
|**Journey Patron** (new)|$100–500|Name in Season 2 credits, exclusive Bali behind-the-scenes, exclusive merch, episode mention|No ownership, no return|
|**Co-Producer / Sponsor** (new)|$1,000+|Brand/logo in the podcast, prominent thanks, product placement — for a brand or business wanting exposure|No ownership, no creative control|
|**Big investor** (rare)|By conversation|If someone wants to put serious money and discuss a real partnership → private talk|Never a page button|

> [!warning] The $15k reality (honest note) Pablo's full vision (Season 2 = a week in Bali, 3 people, edit in Colombia, then a physical store for Season 3 with painted clothing) needs ~$15,000 AUD. The math does not work as a financial investment: a small podcast cannot repay $15k from its income in a reasonable time (see deal analysis — 4 to 15 years). So $15k will NOT come from "investors expecting a return." It realistically comes from: (a) sponsors/brands wanting exposure (no repayment expected), (b) many small contributors who believe in the journey, and/or (c) starting with a SMALLER goal (~$2–3k) to prove traction first, then raising more once there is proof. Decide the real minimum cost of Season 2 vs the dream version before launching a $15k ask.

**What Pyadra earns here (draft — NEW model type, needs Company Master entry):**

> [!note] Crowdfunding is a new Pyadra model type Pyadra's defined model (transaction fee + 1–5% permanent stake) is for project SALES. A project that RAISES money instead of selling is a case the Company Master does not cover yet. Draft proposal: Pyadra takes a **platform fee of ~5% of funds raised** (like Kickstarter), for providing the credential system, payment processing, and Galaxy exhibition. Plus, as with every project, Pyadra's 1–5% permanent stake still applies to Orbit's future revenue. Since Orbit is the founders' own project, this fee is partly theirs anyway. THIS NEEDS to be added to [[Company_Master]] as a new "contribution/crowdfunding" model once confirmed.

**Revenue streams (what could eventually fund the founders and repay nothing to contributors):**

|Revenue stream|Current state|Potential|
|---|---|---|
|Supporter credentials ($10–50 AUD)|Active — supporters confirmed|Funds part of a season|
|Journey Patron / Sponsor tiers|Draft — not built|The realistic path to bigger sums|
|Merchandise (orbit77.shop)|Active — external store|Variable — the planned core monetization (clothing)|
|Season 2 content monetization|Planned — YouTube AdSense|Proportional to audience growth (needs marketing)|
|Physical Orbit Store (Season 3 vision)|Conceptual — Pablo's vision|Clothing people paint in-store, live sessions, studio|

**Open deal questions to resolve with Pablo:**

- [ ] Real minimum cost of Season 2 (Bali version vs a leaner version)
- [ ] Is the first goal $15k, or a smaller proof-of-traction goal first?
- [ ] Exact Journey Patron / Sponsor amounts and perks
- [ ] Confirm Pyadra's cut for a contribution model (the ~5% draft above)
- [ ] Split between Pablo & Eduardo of whatever the founders retain
- [ ] Legal review (raising money from the public may have regulatory implications)

---

## COPY DECK — LOCKED STRINGS

> [!important] How to use this section Single source of truth for every visible string on the Orbit 77 dashboard. Claude Code copies verbatim — never paraphrase, invent, or "improve". For any NUMBER (tiers, funding goal, supporters, episodes), the metrics in WHAT THE USER SEES are canonical; update those first. This deck reflects the CONTRIBUTION model (no equity, no "own a piece" — that old framing is removed). Draft amounts are provisional (refine with Pablo).

> [!warning] Orbit is a CONTRIBUTION page, not a sale Remove all "own / 49% / acquire / equity" language. People contribute to fund Season 2 and get recognition/perks — never ownership, revenue share, or creative control. The founders keep Orbit 77.

### Identity block

- **Type badge:** `Global · Podcast`
- **Status badge:** `Season 2 funding`
- **H1:** `Orbit 77`
- **Tagline:** `Real conversations. No filters. No script. No bullshit.`
- **Intro:** `Orbit 77 is a podcast created in Sydney that does things differently, moving through three orbits: real talks about life, art and music. 10 episodes live — built for permanence, not virality.`

> [!note] Intro rewritten July 2026 Now says plainly where it was made (Sydney) and its three pillars (life, art, music), per owner feedback.

### What your support builds (left column, replaces "What You Fund")

Section label: `What Your Support Builds` · counter `6 goals`

> [!important] Orbit is not for sale — nothing transfers Buyers/visitors don't take anything home here. This section lists what the contributions make possible (the vision), not assets received.

|Title|Description|
|---|---|
|`More listeners`|`Growing the audience on YouTube and Spotify, getting Season 1 in front of the people it was made for.`|
|`Seasons 2, 3 and 4`|`Recording and releasing the next three seasons — life, art and music, one orbit at a time.`|
|`The clothing brand`|`orbit77.shop is live today. Support helps refresh the designs and grow the merch that funds the show.`|
|`A physical home`|`A space in Sydney to record the podcast, paint and sell the clothing — studio, gallery and store in one.`|
|`Events & parties`|`Live Orbit 77 nights with sponsors and brands — the conversations, in a room full of people.`|
|`A real community`|`The Orbit 77 community, each member with their own credential, permanently in the archive.`|

### Metrics (dynamic — real data)

|Label|Value (source)|Sub|
|---|---|---|
|`Episodes live`|`10` (move to dynamic later)|`on YouTube`|
|`Season 2 funding`|live `/api/stats/orbit-fund`|`raised so far`|
|`Supporters`|live `COUNT orbit_supporters`|`and counting`|

> [!warning] No fake numbers Funding and supporter counts are dynamic from the database. The "10 episodes" is a known data-debt hardcode — keep it in one editable place until an `orbit_episodes` table exists.

### Contribution layers (draft v1 — provisional, refine with Pablo)

Section label: `Lock In Your Frequency`

**Panel intro line (above the layers):** `Pick a layer, pay by card, and your name is engraved in the archive with a permanent credential. No equity, no return — you're funding the journey.`

|Name|Amount (AUD)|What they get (sub-line, one line)|
|---|---|---|
|`Signal Carrier`|`$10`|`Your name in the archive + a permanent credential.`|
|`Archive Node`|`$20`|`Everything above + early access to Season 2.`|
|`Transmission Keeper`|`$50`|`Everything above + direct updates from Pablo.`|
|`Journey Patron`|`$100–500`|`Everything above + name in S2 credits, behind-the-scenes, exclusive merch.`|
|`Co-Producer / Sponsor`|`$1,000+`|`Your brand named in the podcast + product placement.`|
|`Big investor`|`Let's talk`|`Bigger support? A private conversation with Pablo — not a checkout.`|

> [!note] Each contribution returns recognition only — NO ownership, NO revenue share, NO creative vote. The "Big investor" door is a contact form, not Stripe. Sub-lines rewritten July 2026 to say plainly what each layer does (owner feedback: "ser más claros un poquitico").

### Funding goal

- **Goal figure:** `$10,000 AUD` — DECIDED by owner July 2026 (was draft $1,000). Raised so far: `$0` real — progress `0%`. The "where the money goes" FAQ reads from the same config value so it never contradicts the progress bar.

> [!warning] Raised must show real $0 The live API (`/api/stats/orbit-fund`) sums `orbit_support_credentials`. Any test-mode Stripe rows in that table must be deleted from Supabase or the page shows fake money (it was showing $690 of test payments). The API filters `payment_status = 'paid'`.

### Confirmation / ritual strings (keep the approved voice)

- On contribution: `Transmission Recorded`
- Credential format: `Archive ID: O77-S1-XXXXXX`
- Primary CTA: `Lock In Your Frequency`
- Secondary: `Hold The Signal`

### FAQ (drawer)

|Q|A|
|---|---|
|`Is this real?`|`10 episodes are public on YouTube and the credential system processes real payments through Stripe. Watch first, decide later.`|
|`What do I get for contributing?`|`A permanent credential, founding-member status, early Season 2 access, and founder updates. You're funding the journey — recognition, not ownership.`|
|`Where does the money go?`|`Straight into Season 2 production. The goal and live progress are shown on this page.`|
|`Can I own part of Orbit 77?`|`No — Orbit stays with Pablo. Contributions fund the work; they don't buy equity or a say in the content. If you want to support at a bigger level, let's talk.`|

### Founder block (drawer)

> [!important] The founder shown is Pablo Ramírez only (July 2026) The old "Pablo & Eduardo" joint signature is replaced. Drawer shows Pablo's photo (like Kangaroo/EterniCapsule founder blocks), his quote, and his name. All page copy referring to the founders now says **Pablo** — enquiries still arrive at pyadra@pyadra.io.

- **Photo:** `public/images/orbit/pablo_founder.jpg` (landscape 4:3 preferred) · alt `Pablo Ramírez, founder of Orbit 77` · caption chip `Pablo · Sydney`
- **Quote:** `"I'm a graphic designer who likes to listen, help and build things with other people. Orbit 77 is where all of that lives — art, deep conversations, and orbiting at high frequencies."`
- **Signature:** `Pablo Ramírez` · `Founder · Orbit 77, Sydney 2025`

### Crew / join

- CTA: `Join the crew` → `/exhibitions/galaxy/orbit/join`

### Secondary CTAs & labels

- **Contact email:** `pyadra@pyadra.io`
- **Links:** `YouTube` (active) · `Store` (orbit77.shop) · Spotify/Instagram only if real (no dead links)
- **Footer:** keep existing transmission-style footer

### Strings that must never appear

```
Support Orbit 77 · Donate Now · Season Pass · Subscribe
own a piece · 49% · available to own · acquire · equity
buy now · fake supporter numbers
```

---

## ROADMAP

**Now (Q2–Q3 2026):**

- [ ] Reach $1,000 AUD funding goal for Season 2
- [ ] Admin dashboard for crew applications
- [ ] Mobile experience audit
- [ ] Add Spotify + Instagram links
- [ ] Begin Season 2 production (once funded)

**Next (Q4 2026):**

- [ ] Private supporter archive page (`/archive/[supporter_id]`)
- [ ] Season 2 Ep 1–3 early access for Season 1 supporters
- [ ] Season 2 credential system (O77-S2-XXXXXX)
- [ ] Custom audio player (terminal aesthetic)
- [ ] Split Stripe webhook for independence
- [ ] Episodes count dynamic (`orbit_episodes` table)

**Future (no fixed date):**

- [ ] Multi-season credential dashboard
- [ ] Public leaderboard (opt-in)
- [ ] Supporter nodes visualization
- [ ] Orbital diagram expands to show multiple seasons as concentric rings
- [ ] Physical Orbit Store — creative space, studio, merchandise point (Pablo's concept)
- [ ] Project extraction → ready for Phase 2 partial or full acquisition

---

## RELATED LINKS

**Documentation:**

- [[VISION]]
- [[ROADMAP]]
- [[DATABASE_SCHEMA]]
- [[ARCHITECTURE]]

**Code:**

- `src/app/exhibitions/galaxy/orbit/page.tsx`
- `src/app/exhibitions/galaxy/orbit/join/page.tsx`
- `src/app/api/donate/route.ts`
- `src/app/api/stats/orbit-fund/route.ts`
- `src/app/api/applications/route.ts`
- `src/app/lib/email.ts`

**Database migrations:**

- `supabase/migrations/0000_orbit_support_credentials.sql`
- `supabase/migrations/0001_orbit_supporters.sql`
- `supabase/migrations/0004_orbit_applications.sql`

**External:**

- YouTube: [@Orbit77Podcast](https://www.youtube.com/@Orbit77Podcast)
- Store: [orbit77.shop](https://orbit77.shop/)
- Instagram: TBD
- Spotify: TBD

**Sibling projects in Galaxy:**

- [[ETHERNICAPSULE]] — Time-locked cryptographic messages
- [[Figuitoon]] — Physical figurines from photos

---

> [!note] Changelog v1.3 (June 2026) — Reframed the deal: Orbit 77 is NOT for sale — it raises CONTRIBUTION to fund Season 2 while Pablo & Eduardo keep it. Replaced the old acquisition models (partial/full/hosted) with a draft layered contribution model (Signal Carrier → Sponsor + private big-investor door), no equity / no revenue share to protect the founders' creative voice. Added the honest $15k reality note (math doesn't work as investment; comes from sponsors / many small contributors / smaller first goal). Flagged that "contribution/crowdfunding" is a NEW Pyadra model type not yet in Company Master (draft: ~5% platform fee). All numbers are v1 to refine with Pablo. Page NOT built yet — skeleton + deal draft only.

_END · ORBIT 77 · v1.3_