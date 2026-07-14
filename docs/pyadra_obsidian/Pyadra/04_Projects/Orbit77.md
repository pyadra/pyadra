_Project document · Pyadra · Last updated: July 14, 2026_

---

## IDENTITY

**Type (scope):** GLOCAL (digital podcast + physical merch/events) **Pyadra relation:** External with internal product (podcast lives on YouTube; credential system is native) **Exhibition:** Galaxy **Status:** Active · Funding S2 **Founder:** Pablo Ramírez (page shows Pablo only since July 2026; Eduardo operates Pyadra) **Tagline (1 line):** Real conversations. No filters. No script. No bullshit.

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
|Season 2 funding raised|`/api/stats/orbit-fund` → `SUM(orbit_support_credentials.amount_aud WHERE payment_status='paid')`|
|Funding goal ($10,000 AUD)|`pyadra_settings` key `orbit.funding_goal_aud` — served by `/api/stats/orbit-fund`, editable in Supabase without a deploy|
|Episodes live (10)|`pyadra_settings` key `orbit.episodes_live` — same API, same editability|
|Progress %|Computed on the page from raised/goal|

> [!note] Data debt RESOLVED (July 14, 2026) The episodes count and the funding goal are no longer hardcoded — both live in the `pyadra_settings` table. The values in code (`CONFIG`) are fallbacks only. To publish episode 11: edit the `orbit.episodes_live` row in Supabase.

**Access:**

- Internal product (credential): `/exhibitions/galaxy/orbit`
- Post-payment confirmation: `/transmission-confirmed`
- Supporter archive: `/archive/[credential-id]` (linked from the credential email)
- Podcast — YouTube: [@Orbit77Podcast](https://www.youtube.com/@Orbit77Podcast)
- Podcast — Spotify: TBD (link hidden until real)
- External store: [orbit77.shop](https://orbit77.shop/)
- Instagram: TBD (link hidden until real)

> [!note] Crew applications RETIRED (July 14, 2026) The `/orbit/join` page, `/api/applications` and the `orbit_applications` table were removed by owner decision. The path to join is a conversation, not a form.

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

> [!important] Design system CHANGED (July 2026) The Orbit dashboard now follows the Pyadra light museum dashboard pattern (same family as Kangaroo Cleanup): smoke-gray surface `#EDEFED`, emerald accent `#059669`, white glass panels, Design System v1 type scale. The old dark "deep space transmission" aesthetic (`#020503` / `#39FF14` neon) survives ONLY inside the drawer ("The Origin Story", dark panel, cream text `#F4EFEA`) and in the ritual copy voice. The post-payment page (`/transmission-confirmed`) and the archive (`/archive/[id]`) were restyled July 14, 2026 to this same light museum language — no more dark neon pages.

**The feeling in one sentence:** A museum dashboard examining a living transmission — calm surface, ritual language underneath.

**Color palette (current page):**

|Token|Hex|Usage|
|---|---|---|
|Surface|`#EDEFED`|Page background (Pyadra museum smoke)|
|Ink|`#1A1C1A`|Primary text|
|Emerald|`#059669` / `#047857`|PRIMARY accent — CTAs, badges, progress|
|Muted|`#6B8070`|Labels, secondary text|
|Drawer dark|`#0D1612`-family|Origin Story drawer only|
|Drawer cream|`#F4EFEA`|Drawer text|

**Typography:** Design System v1 (Fraunces serif display · DM Sans body · IBM Plex Mono labels), dashboard density scale `T` (display 3xl/4xl · heading 16 · body 14 · small 13 · micro 11).

**Key interactions:**

- **Orbit sphere** — draggable interactive monolith in the middle column
- **Funding progress** — live bar fed by `/api/stats/orbit-fund` (raised, goal, %)
- **Lock In dialog** — contribution flow opens in a modal per layer

**Animation principles:** Organic breathing over mechanical linearity. Pulses use elastic easing. Movement feels like signal drift, not button clicks.

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
- `src/app/transmission-confirmed/page.tsx` (post-payment, Orbit light style)
- `src/app/archive/[id]/page.tsx` (supporter archive, Orbit light style)
- `src/app/api/donate/route.ts` (amount validated $5–$1,000 AUD)
- `src/app/api/stats/orbit-fund/route.ts` (raised + goal + episodes from `pyadra_settings`)
- `src/app/api/session/route.ts` (post-payment lookup → archive link)
- `src/app/api/stripe/webhook/route.ts` (shared — critical blocker)
- `src/app/lib/orbit-db.ts` (ONLY entry point to orbit tables)
- `src/app/lib/email.ts`

**Deploy:** Production: [pyadra.io/exhibitions/galaxy/orbit](https://pyadra.io/exhibitions/galaxy/orbit)

**Pyadra dependencies:**

- Stripe — shared account with EterniCapsule
- Supabase — shared DB, ONE table: `orbit_support_credentials`. All access goes through the dedicated client `src/app/lib/orbit-db.ts` (`getOrbitSupabase()`); setting `ORBIT_SUPABASE_URL` + `ORBIT_SUPABASE_SERVICE_ROLE_KEY` moves Orbit to its own DB with zero code changes (see `supabase/README.md`)
- Resend — shared email service
- `/api/stripe/webhook` — monolithic webhook (🔴 critical blocker)
- Shared components: `SiteNav`, `SiteFooter`, `MuseumAtmosphere`
- Design tokens in `globals.css`

**What independence requires:**

|#|Task|Effort|Priority|Blocker|
|---|---|---|---|---|
|1|Extract Orbit Stripe webhook from monolith|3–4h|P0|YES|
|2|Dedicated Supabase project — ✅ code side done (dedicated client + env-var switch); only remains creating the project and running the orbit part of migration 0008|~1h left|P1|No|
|3|Separate Resend API key|1h|P1|No|
|4|Duplicate shared components|2–3h|P2|No|
|5|Extract design tokens to Orbit-specific CSS|1h|P2|No|
|6|End-to-end test of independent deployment|2h|P0|YES|

**Estimated effort for independence:** 10–12 hours

**Database tables (single-table design since July 14, 2026):**

- `orbit_support_credentials` — one row per contribution (O77-S1-XXXXXX, amount, payment status, supporter name/email/display name). The supporter's identity lives on each row; the archive page groups a supporter's credentials by `supporter_email`. (`orbit_supporters` and `orbit_applications` were removed — see migration `0008_full_reset_baseline.sql`.)

**API routes:**

|Route|Method|Auth|Purpose|
|---|---|---|---|
|`/api/donate`|POST|Public (rate-limited)|Create Stripe Checkout session ($5–$1,000 AUD)|
|`/api/stats/orbit-fund`|GET|Public (rate-limited)|Return raised total + goal + episodes (goal/episodes from `pyadra_settings`)|
|`/api/session`|GET|Public (rate-limited)|Post-payment lookup: session → credential id for the archive link|
|`/api/stripe/webhook`|POST|Stripe signature|Process payments (shared — needs split)|

---

## FLOWS

**Flow 1 — Supporter Contribution:**

```
Observer lands on /exhibitions/galaxy/orbit
  ↓
Picks a contribution layer → Lock In dialog opens
  ↓
Fills: Display Name (optional), Email, anonymity toggle, optional message
Layer sets the amount ($10 → $1,000)
  ↓
"Lock In — $X AUD →" → POST /api/donate → Stripe Checkout
  ↓
Payment → Stripe webhook (signature-verified)
  ↓
Webhook upserts orbit_support_credentials (O77-S1-XXXXXX, idempotent on session id)
Sends credential email via Resend (archive link = credential id)
  ↓
/transmission-confirmed → credential card (Orbit light style)
  ↓
"View in Archive" → /archive/[credential-id] → all of that email's paid credentials
```

**Flow 2 — Crew Application:** RETIRED July 14, 2026 (page, API and table removed by owner decision).

**Flow 3 — Stats & Progress Tracking:**

```
Page loads → useEffect → GET /api/stats/orbit-fund
API: SUM(paid credentials) + goal + episodes from pyadra_settings
Returns { total, goal, episodes_live }
  ↓
Progress % = total / goal — bar + stats grid (Episodes · Raised · Goal · Progress)
Goal and episodes are editable in Supabase without a deploy
```

---

## PRODUCTS AND PRICING

|Product|Price|Status|Notes|
|---|---|---|---|
|Signal Carrier|$10 AUD|Active|Entry layer (featured "Entry" badge)|
|Archive Node|$20 AUD|Active|+ early Season 2 access|
|Transmission Keeper|$50 AUD|Active|+ direct updates from Pablo|
|Journey Patron|$100–500 AUD|Active|+ S2 credits, behind-the-scenes, merch|
|Co-Producer / Sponsor|$1,000+ AUD|Active|Brand named in the podcast + product placement|
|Big investor|By conversation|Active|Contact form, never a checkout|
|Official Merchandise|Variable|Active|External: [orbit77.shop](https://orbit77.shop/)|
|Season 2 Episodes — early access|TBD|Planned Q3–Q4 2026|For Season 1 supporters|

**Funding goal:** $10,000 AUD for Season 2 (owner decision July 2026; stored in `pyadra_settings` → `orbit.funding_goal_aud`).

---

## CURRENT STATE

**What works (verified in production July 14, 2026):**

- ✅ 10 episodes live on YouTube
- ✅ Full contribution flow end-to-end (Stripe + Supabase + Resend) — all six layers, including the $1,000 Sponsor tier (a $500 amount cap bug was fixed July 14)
- ✅ Credential generation (O77-S1-XXXXXX) + credential email
- ✅ Six contribution layers (Signal Carrier → Big investor)
- ✅ Supporter archive page `/archive/[credential-id]` — Orbit light style
- ✅ Post-payment page `/transmission-confirmed` — Orbit light style
- ✅ Dynamic funding progress + stats grid (Episodes · Raised · Goal · Progress)
- ✅ Goal and episodes editable in Supabase (`pyadra_settings`) without deploys
- ✅ Light museum dashboard design (Kangaroo pattern) + dark Origin Story drawer
- ✅ Ritual copy language throughout

**What's missing:**

- ❌ Spotify + Instagram links (hidden until real)
- ❌ Custom audio/video player (currently YouTube embeds)
- ❌ Season 2 episode DB structure
- ❌ Mobile experience audit

**Active blockers:**

- 🔴 **Monolithic Stripe webhook** — blocks independence. P0.
- 🟡 **Season 2 funding at $0 real** — goal $10,000 AUD. Check `/api/stats/orbit-fund`.

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

- **Nav status badge (SiteNav, live dot):** `For support`
- **Type badge:** `Global · Podcast Archive`
- **Status badge (identity panel):** `Funding S2`
- **H1:** `Orbit 77`
- **Tagline:** `Real conversations. No filters. No script. No bullshit.`
- **Intro:** `Orbit 77 is a podcast created in Sydney that does things differently, moving through three orbits: real talks about life, art and music. {episodes} episodes live — built for permanence, not virality.` (episodes is dynamic from `pyadra_settings`)

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

### Metrics — stats grid (dynamic — real data)

|Label|Value (source)|Sub|
|---|---|---|
|`Episodes`|dynamic — `pyadra_settings` → `orbit.episodes_live`|`live on YouTube`|
|`Raised`|live `/api/stats/orbit-fund` (paid credentials only)|`Season 2 fund · live`|
|`Goal`|dynamic — `pyadra_settings` → `orbit.funding_goal_aud` (rendered `$10k`)|`AUD · Season 2`|
|`Progress`|computed raised/goal|`funded`|

> [!warning] No fake numbers All four stats are dynamic. Episodes and goal come from `pyadra_settings` (editable in Supabase, no deploy); raised comes from paid credentials only — test-mode Stripe rows must never sit in the production table.

### Contribution layers (draft v1 — provisional, refine with Pablo)

Section label: `Contribution Layers` · chip `draft v1`

**Panel intro line (above the layers):** `Pick a layer, pay by card — your name is engraved in the archive with a permanent credential. No equity, no return.`

**Featured badge:** Signal Carrier carries the `Entry` chip (featured layer).

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

- **Goal figure:** `$10,000 AUD` — DECIDED by owner July 2026. Stored in `pyadra_settings` → `orbit.funding_goal_aud`; the page, the progress bar and the "where does the money go" FAQ all read the same live value, so they can never contradict each other.

> [!warning] Raised must show real money only The live API (`/api/stats/orbit-fund`) sums `orbit_support_credentials` filtered to `payment_status = 'paid'`. The database was fully reset July 14, 2026 (migration 0008) — no test rows remain.

### The Honest Risks (right column)

Section label: `The Honest Risks`

|Title|Description|
|---|---|
|`The audience is small`|`Early YouTube channel, supporters still being counted. You'd be backing it before the proof — that's the point, and the risk.`|
|`Monetization isn't active yet`|`No AdSense, no Spotify revenue, no sponsors yet. Today the only revenue is credentials and merch.`|
|`Production is real work`|`A podcast doesn't run itself. Episodes need recording, editing and publishing — actively, every season.`|
|`Shared infrastructure`|`Stripe webhook and database are shared with Pyadra today. Independence is documented and takes 10–12 hours.`|
|`Draft tiers`|`The goal is set — $10,000 AUD for Season 2. The tiers are v1, still being refined with Pablo; the exact perks may shift.`|

### Not included

Section label: `Not Included`

|Item|Note|
|---|---|
|`Equity`|`no shares, no ownership — Pablo keeps the project.`|
|`A return`|`this is a contribution, not an investment.`|
|`Creative votes`|`no influence on episodes, guests or direction.`|

### Lock In dialog (verbatim)

|Field|String|
|---|---|
|Kicker (Stripe layers)|`Orbit 77 · Lock In Your Frequency`|
|Kicker (Big investor)|`Orbit 77 · Private channel`|
|Range note (Journey Patron)|`For ranges, the exact final amount is set at checkout.`|
|Big-investor prompt|`Tell us the structure you're thinking.`|
|Field label|`Display name`|
|Submit (Stripe)|`Lock In — $X AUD →` (states: `Opening checkout…`)|
|Submit (form)|`Hold The Signal — Send →` (states: `Sending…`)|
|Form success|`Transmission recorded.` + `Pablo has received your note. He'll reach out personally.`|
|Error fallback|`Something went wrong.`|

### Confirmation / ritual strings (keep the approved voice)

- Credential format: `Archive ID: O77-S1-XXXXXX`
- Post-payment page heading: `Your signal arrived.` · kicker `Orbit 77 — Transmission recorded`
- Post-payment buttons: `Share my credential` · `Return to Orbit 77` · `View in Archive`

### FAQ (drawer)

|Q|A|
|---|---|
|`Is this real?`|`{episodes} episodes are public on YouTube and the credential system processes real payments through Stripe. Watch first, decide later.` (episodes dynamic)|
|`What do supporters get?`|`A permanent credential engraved in the archive (O77-S1-XXXXXX), founding member status, early Season 2 access, and direct founder updates.`|
|`Is this an investment? Do I own a piece?`|`No. You're funding the journey, not buying equity. Pablo keeps the project and creative control. Supporters get recognition, perks and a permanent credential — never ownership, never a return, never a vote on the content.`|
|`Where does the money go?`|`Straight into Season 2 production. The goal is ${goal} AUD — the progress bar on this page is live, and every credential moves it.` (goal dynamic)|

### Founder block (drawer)

> [!important] The founder shown is Pablo Ramírez only (July 2026) The old "Pablo & Eduardo" joint signature is replaced. Drawer shows Pablo's photo (like Kangaroo/EterniCapsule founder blocks), his quote, and his name. All page copy referring to the founders now says **Pablo** — enquiries still arrive at pyadra@pyadra.io.

- **Photo:** `public/images/orbit/pablo_founder.jpg` (landscape 4:3 preferred) · alt `Pablo Ramírez, founder of Orbit 77` · caption chip `Pablo · Sydney`
- **Quote:** `"I'm a graphic designer who likes to listen, help and build things with other people. Orbit 77 is where all of that lives — art, deep conversations, and orbiting at high frequencies."`
- **Signature:** `Pablo Ramírez` · `Founder · Orbit 77, Sydney 2025`

### Drawer shell (The Origin Story)

|Field|String|
|---|---|
|Drawer trigger|`Read FAQ & Origin Story →`|
|Drawer title|`The Origin Story`|
|Links label|`Verify Links`|
|FAQ label|`Quick FAQ`|
|Photo caption chip|`Pablo · Sydney`|
|Bottom button|`Contact the founder`|

### Secondary CTAs & labels

- **Contact email:** `pyadra@pyadra.io`
- **Links:** `YouTube` (active) · `orbit77.shop` · Spotify/Instagram only if real (no dead links)

> [!note] Crew / join REMOVED (July 14, 2026) The `Join the crew` CTA, the `/orbit/join` page and its API no longer exist. Do not rebuild them without an owner decision.

### Strings that must never appear

```
Support Orbit 77 · Donate Now · Season Pass · Subscribe
own a piece · 49% · available to own · acquire · equity
buy now · fake supporter numbers
```

---

## ROADMAP

**Now (Q3 2026):**

- [ ] Reach $10,000 AUD funding goal for Season 2
- [ ] Mobile experience audit
- [ ] Add Spotify + Instagram links (when real)
- [ ] Begin Season 2 production (once funded)

**Next (Q4 2026):**

- [ ] Season 2 Ep 1–3 early access for Season 1 supporters
- [ ] Season 2 credential system (O77-S2-XXXXXX)
- [ ] Custom audio player
- [ ] Split Stripe webhook for independence

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
- [[Company_Master]]
- `supabase/README.md` — table ownership + migration path to a dedicated DB

**Code:**

- `src/app/exhibitions/galaxy/orbit/page.tsx`
- `src/app/transmission-confirmed/page.tsx`
- `src/app/archive/[id]/page.tsx`
- `src/app/api/donate/route.ts`
- `src/app/api/stats/orbit-fund/route.ts`
- `src/app/api/session/route.ts`
- `src/app/lib/orbit-db.ts`
- `src/app/lib/email.ts`

**Database migrations:**

- `supabase/migrations/0008_full_reset_baseline.sql` — the single source of truth (0000–0007 are history only)

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

> [!note] Changelog v1.4 (July 14, 2026) — Full reconciliation against production code after the July 14 overhaul. IDENTITY: template-v2 fields (GLOBAL + External with internal product), founder shown is Pablo only. DESIGN: documented the light museum dashboard (the dark transmission aesthetic now lives only in the Origin Story drawer and the ritual copy); /transmission-confirmed and /archive/[id] restyled to match. DATA: single table `orbit_support_credentials` (supporters + applications tables removed, migration 0008); archive links use the credential id and group by supporter_email. Crew form retired (page, API, table, CTA). Goal $10,000 and episodes count now DYNAMIC via `pyadra_settings` — data debt resolved. Copy deck rebuilt from the live page verbatim: nav badge `For support`, badges, stats grid (Episodes/Raised/Goal/Progress), six layers with `Entry` chip, Honest Risks, Not Included, Lock In dialog, drawer shell, post-payment strings, FAQ (4 entries, two dynamic). $1,000 tier verified working (amount-cap bug fixed). Roadmap and related links updated.

_END · ORBIT 77 · v1.4_