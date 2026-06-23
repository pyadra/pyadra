# Orbit 77

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

**Participation models:** _Pyadra supports different levels of involvement — from supporter to full owner._

|Model|Description|Investment range|Status|
|---|---|---|---|
|Supporter|Contributes $10–50 AUD. Receives permanent credential. No ownership.|$10–50 AUD|Active|
|Partial acquisition|Buys a % of Orbit 77. Co-creates with Pablo & Eduardo. Revenue share proportional to stake. Example: 49% available, 51% retained by founders.|TBD — requires legal review|Planned (Phase 2)|
|Full acquisition|Buys 100% of Orbit 77. Founders retain royalty + advisory role.|TBD — requires legal review|Planned (Phase 2)|
|Hosted ownership|Acquires ownership but Orbit stays inside Pyadra infrastructure. Pyadra maintains deployment and operations.|TBD — requires legal review|Planned (Phase 2)|

**How a participant or buyer makes money:**

|Revenue stream|Current state|Potential|
|---|---|---|
|Supporter credentials ($10–50 AUD)|Active — supporters confirmed|At full $1,000 goal = Season 2 funded|
|Merchandise (orbit77.shop)|Active — external store|Variable — grows with audience|
|Season 2 content monetization|Planned — YouTube AdSense + Spotify|Proportional to audience growth|
|Sponsorships|Not active — no outreach yet|High potential once audience is proven|
|Physical Orbit Store|Conceptual — Pablo's long-term vision|Creative space, studio, merchandise, live sessions|
|Future season credentials (S2, S3…)|Planned|Recurring revenue per season|

**Post-participation structure:**

- Participant / buyer receives: agreed % of revenue streams (credentials, merch, monetization, sponsorships)
- Original founders retain: perpetual royalty (% TBD), creative direction, minority stake
- Pyadra receives: transaction fee on acquisition + hosting % if buyer opts for Pyadra-hosted model

**What must happen before this project can be sold or partially acquired:**

- [ ] Season 2 funded and in production (validates the model)
- [ ] Stripe webhook separated from monolith (project must deploy independently)
- [ ] Independence architecture completed (10–12h)
- [ ] Legal review completed (ASIC Australia)
- [ ] Admin dashboard operational (crew + supporter management)

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

_END · ORBIT 77 · v1.2_