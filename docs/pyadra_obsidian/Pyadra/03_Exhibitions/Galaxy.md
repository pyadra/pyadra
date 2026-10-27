# Galaxy

_Exhibition document · Pyadra · Last updated: September 22, 2026 — v4.3_

---

## IDENTITY

**Type:** Exhibition **Status:** Active — 4 live projects **URL:** pyadra.io/exhibitions/galaxy **Tagline (on page):** Four projects. Already alive. **Theme (as shown on the Exhibitions page):** `Built projects, ready for their next chapter` _(earlier docs said "Memory, time, permanence"; that line is not on any page)_

> [!note] Where Galaxy sits in the business (September 2026) Pyadra creates, develops and collaborates to turn ideas into real projects, then looks for the people who will acquire, operate, support, work on or carry them forward ([[Company_Master]] §1). Galaxy is the room where the finished projects are shown to those people. The museum framing is the experience, not the business definition.

---

## WHAT GALAXY IS — AND WHY IT EXISTS

Galaxy is the first active exhibition inside Pyadra. It was created to answer one question: **how do you show living digital projects the way a museum shows works — so a visitor can both experience them and, if they're the right person, take one further?**

Every project in Galaxy answers two questions at once:

- **What can I experience today?** — the product, the price, how to enter
- **What can I take further?** — support it, partner on it, or acquire it

Galaxy itself is deliberately thin: it is **the hook, not the story**. The page shows four orbital spheres; one click on a sphere goes straight into the project's own page, where the full story, the proof, the deals and the forms live. Galaxy sparks curiosity; each project page does the convincing.

> Design principle (v4, July 2026): no detail panels, no tabs, no forms inside Galaxy. All of that lives on each project's page. Galaxy's only jobs are atmosphere, orientation, and the click.

**Every person who arrives at Galaxy can:**

1. Enter a project — use the product, live the experience
2. Follow its opportunity line — support (Orbit), acquire (EterniCapsule, Figuitoon), or partner (Kangaroo)
3. Enter the museum shop through the central gem

---

## TONE AND AUDIENCE

**Who Galaxy speaks to:** Curious people, not professional investors. Normal people who can see value in a real project and want to be part of something from early on.

**How it should feel:** Trustworthy, clean, honest. A gallery where every piece is alive and floating — calm surface, real things underneath.

**What Galaxy must never feel like:**

- A stock market
- A crypto or NFT platform
- A Silicon Valley startup
- A marketplace, an app store, or an e-commerce site

**The sentence that defines the spirit:**

> "Four projects. Already alive. Step into any one of them. Take it further."

---

## HOW PARTICIPATION WORKS (business layer)

Galaxy no longer carries deal mechanics — each project's page and document is canonical for its own model:

|Project|Opportunity line (on sphere)|Model|Canonical doc|
|---|---|---|---|
|Orbit 77|`Open for support`|Contribution layers $10–$1,000+ (no equity — Pablo keeps it)|[[Orbit77]]|
|EterniCapsule|`Open for acquisition`|Hosted deals: Operator $4k / Owner $8k / Make an offer (the "hosted" framing is under owner review since the product moved to its own deployment)|[[EterniCapsule]]|
|Figuitoon|`Available to acquire`|Sale conversation; product sells via its own Shopify|[[Figuitoon]]|
|Kangaroo Cleanup|`Looking for a partner`|Handover deals $5k–$12k + revenue share|[[Kangaroo_Cleanup]]|

**Shared principles (per [[Company_Master]]):** no automatic checkout for deals — acquisition happens through conversation (contact forms → pyadra@pyadra.io → personal reply). No fixed valuation headlines on pages. Pyadra retains a small permanent share per project, defined per deal.

---

## NEXT — v5, THE ORBIT AS AN INSTRUMENT (not deployed)

> [!warning] Built on branch `feat/galaxy-orbit-instrument`, local only (October 26, 2026). Everything below describes that branch, not the live page — the v4 section after this one is still what pyadra.io serves.

**The idea (owner-approved, October 26, 2026):** the position of a sphere stops being decoration and becomes information.

**Second pass (owner review, October 27, 2026).** The first build fit 9 full cards on a 1,574px page (a MacBook shows 820): the orbit never fit on screen, 52 strings competed at once, and the "zooms" were page changes with a blank beat between them. The second pass rebuilt it around one idea per glance:

| Layer | Where | What the visitor gets |
|---|---|---|
| The way in | `/` | The symbol and **Join** zoom straight into Galaxy (one step fewer). Each tagline word is a door: `DISCOVER` → `/exhibitions`, `CONNECT` → Operate lit, `BUILD` → Build, `BUY` → Acquire (`?way=`). The 2s curtain plays on the first visit of a session; coming back, it's a breath (350ms). |
| The orbit | `/exhibitions/galaxy` | One screen, no scroll on desktop — the canvas fits the viewport. Each lot is **a sphere and a name** (dot = ready / ring = forming). **Angle = how you come in**, **ring = how ready**. Hover previews the subtitle and opportunity. The sector names are the filters. An empty sector keeps an **Open seat** → "Bring your idea". |
| The lot | same page, `?lot=<id>` | A real camera move: the canvas flies to the sphere, the rest dims, a panel opens beside it — chip, opportunity, name, subtitle, how you come in, where it stands, proof, what happens next. ← → walk the orbit; Esc or the field steps back. Primary action: **Open the dossier** (or **Ask about …** when there's no room yet); secondary: **Ask Pyadra about it** (the contact dialog, tagged with the project). |
| The dossier | the project's page | Zooms into the existing dashboard. |

Phones and tablets read the same orbit as a list grouped by sector; the lot opens as a bottom sheet. `/exhibitions` stays as the museum overview (Galaxy lit, Jungle and City as landscape) and is reached from the nav and `DISCOVER`.

**Third pass — the guide (owner review, October 27, 2026).** The owner still got lost: arriving at the projects, nothing said what Pyadra is, what a visitor can do there, or where they are. Three answers, each at the moment the question comes up:

1. **What is this place?** — the Home says it in one line under the wordmark: _"Real projects, already built — looking for the people who will take them further. Come in with money, work or skills."_ (from §1 of [[Company_Master]]).
2. **What can I do here?** — the Home asks _"What brings you here?"_: `I want to own one` · `I want to run one` · `I want to back one` · `I have an idea` · `Just looking`. The answer is the visitor's **intent** (`components/guide/intent.ts`, kept for the session): Galaxy opens with that direction lit, the title says it (_"What you can own."_), phones list it first, and a contact message records it (`came in as: …`). Each lot's panel answers in plain words — **what you can do · what you put in · what you take away** — from each project's own doc (`offer` in `lots.ts`, never a valuation figure).
3. **Where am I?** — **the guide** (`components/guide/Guide.tsx`): the museum's audio guide in one line, fixed at the bottom of Galaxy and Exhibitions. "You are here · Pyadra › Galaxy › EterniCapsule", and one sentence that speaks to the visitor's intent and to what they're pointing at — counted from the lots, so it never falls behind the data. It folds into a dot for anyone who'd rather walk alone. Not on the Home (the question does that job) nor the dossiers (full-screen boards; the nav already shows the path).

**Fourth pass — the lot sheet, and no more hall (owner, October 27, 2026).**
- **Ways in reorganized:** EterniCapsule, Figuitoon, Byndi, Momentos Inolvidables, Gym routines and We Made It are all **for sale** (`acquire`). Orbit 77 (support) and Kangaroo Cleanup (operate) are the different ones; BackMate stays forming. The `To confirm` sector is gone.
- **The lot sheet:** every project's panel shows the same fields in the same order — key facts (asking price · format · where it stands), what it is, what's included, ideal for, in numbers, how it works (you can · you put in · you take away · handover), proof, what happens next — with the main action pinned at the bottom. Fields come from [[Lot_Sheet_Template]], one per project; empty ones hide on the live site and show as "To complete" slots locally. Content not written yet — the owner is preparing it.
- **`/exhibitions` redirects to Galaxy** (308). Galaxy is the only open room, so the hall only delayed it; the page comes back when a second exhibition opens. Jungle and City are no longer shown.

**Fifth pass — one voice, three steps (owner, October 27, 2026).**
- **One type system.** An audit found the official six-size scale used nowhere: Galaxy alone set 11 sizes, the Home 7, the dossiers their own. New pages now compose `components/ui/type.ts` — the voice the dossiers already spoke: names in Fraunces, labels in IBM Plex Mono uppercase, the rest in DM Sans; six sizes (36/30 · 24 · 16 · 14 · 13 · 11). The palette has names in `globals.css` (`ink`, `ink-soft`, `ink-mute`, `paper`, `accent`, `accent-deep`) — the dossiers' same hex values. Galaxy's and the Home's titles, the Store's title, the guide and the panels moved to it.
- **Three steps, each showing a little more:** hover shows **the hook** (kind, hook line, price, opportunity); a click opens a **dashboard** that fits one screen (name, hook, opportunity, price · format · stage, three numbers, ideal for, the action); the dossier holds the rest. New field: `hook` in the lot sheet.

**Sixth pass — design, motion, experience (owner, October 27, 2026).** The owner rated it 6.5: the idea and the information were right, the feel wasn't. What changed:
- **The orbit is alive and has depth.** It tilts a few degrees toward the pointer and its layers part (rings back, spheres forward); a light follows the pointer across the floor. The dial draws itself in on arrival — a scale of ticks, the ready ring, the sectors as lit segments of it — and a light travels each ring forever. Every lot leaves the centre and flies out to its place. Hover draws a thread from the centre to the sphere and lights its sector; opening a lot puts the rest out of focus (blur), like depth of field.
- **The spheres are objects.** Glass light (specular spot, rim, shade), a contact shadow that breathes with the float, and the project's colour spilling onto the floor. A project without a logo shows its **initials** in the museum's serif, like a monogram, instead of an empty ball.
- **The panel carries the project's colour** as light from its corner; names rise word by word; numbers count up; the main button leans toward the pointer. On phones it rises from the bottom.
- **The Home shows Galaxy before you enter:** the nine projects orbit the symbol as small spheres in their own colours, and each door says what waits behind it (`6 projects`, `1 project`, `An open seat`) — counted from `lots.ts`. The cards light where the pointer is.
- **Transitions read as one move inward:** the zoom door blurs the old room as it pushes in; the new room settles from slightly small and soft to sharp (`template.tsx`, 0.7s).
- **Lighter to run.** The background dust was hundreds of JavaScript-animated nodes on every page (280 on the Home and the dossiers); it is now ≤72 CSS motes the compositor moves, plus a static grid and grain. Motion curves live in `components/ui/motion.ts`, like type in `type.ts`. Reduced motion turns all of it off.

**Christian's three projects filled in (owner, October 27, 2026).** The owner handed over the Project Standard docs of three of co-founder Christian Ruiz's projects, now in `04_Projects/`: [[Momentos_Eternos]], [[URELIT]] and [[WEMAIT]]. They are the projects the branch had as "Momentos Inolvidables", "Gym routines" and "We Made It" (names heard in a voice note); the docs' names win. Each lot now carries its sheet from its doc — hook (the doc's sale hook, trimmed to 80 characters where needed), summary, formats, what's included (the copy deck's "What you get" or the asset list), ideal for (from "Why it exists on Pyadra"), three canonical numbers, and a live link where the product is public (URELIT, the WEMAIT demo; Momentos Eternos is paused, so none). No asking price: the docs share the figure only in due diligence. The docs list them under **Jungle**; they show in Galaxy because Galaxy is the only open room (owner, October 27). No Pyadra page yet, so the panel offers **Ask about …** and, when there is one, **See it live**.

**Seventh pass — quiet at rest (owner, October 27, 2026).** The owner found Galaxy overwhelming, "like reading a puzzle". Measured at rest: 73 running animations, 142 dial strokes, 56 motes, nine equal spheres in seven colours, five direction labels floating in the middle of the dial, and the count said three times. The fix was subtraction, not more design:
- **At rest the room is only the rings and the spheres.** The scale of ticks, the lit sector and its spokes appear when the visitor reaches for something (a direction, a sphere) and leave with the hand. The travelling lights on the rings are gone; the tilt and parallax are halved; 16 motes instead of 56. 17 running animations at rest instead of 73.
- **Colour is something that wakes.** At rest the spheres are muted (35% saturation) and their glow is off; a sphere gets its colour back under the hand, when its direction is chosen, or when it's the featured piece. Names at rest are `ink-soft` medium, full ink when awake.
- **The directions moved out of the dial into a filter row** under the title, in the Home's own verbs — `Own · Run · Back · Build · Forming` (the sector labels in `lots.ts` changed with it, so the phone list says the same). "I want to own one" on the Home lands on **Own** in Galaxy. An empty direction has no chip; its open seat on the orbit already says it.
- **One piece leads.** `featured` in `lots.ts` (one at most, and only a lot with a room — tested): larger, in full colour, with a `Start here` label; the guide says "Start with …". Set to EterniCapsule (live, with its own room) — owner to confirm.
- **The header speaks like the Home:** label (`Galaxy`), name (`Nine real projects.` / `What you can own.`), the line under it (`The closer to the centre, the readier it is.`). The nav no longer repeats the count.

**Eighth pass — the ring that turns (owner, October 27, 2026).** The quiet orbit read better but visitors could still get lost: nine equal objects, nothing to start with, and every fact hidden behind a hover. Three sketches were compared (an orbit with an always-open dashboard, a turning ring, constellations); the owner chose a mix — the turning ring, with the dashboard appearing only when the hand is there:
- **The ring lies on the floor** (a wide ellipse, front edge nearest the visitor). The project in front is large and in its own colour; the rest shrink, fade and lose colour with distance. Positions are computed per frame from one spring (`turn`), so the ring always takes the short way round.
- **Left alone it turns by itself** — one step every 4.8 s, inside the chosen direction if there is one — and each project lights once as it arrives. It stops while a hand is over it, while a lot is open, or with reduced motion.
- **The glance:** moving the mouse over the ring unfolds a card beside the front sphere — kind, name, hook, the three numbers (counting up), price and **See it all**. It folds away when the hand leaves. Clicking the front sphere (or See it all) opens the panel; clicking another sphere brings it round. Drag or ← → turn it.
- **The featured lot starts in front**; a direction chosen on the Home (`?way=`) brings its first project round; a shared `?lot=` arrives with that lot in front and the ring steps left for the panel.
- **Gone:** the dial (ticks, sector arcs, spokes), the tilt and parallax, and the readiness rings — the stage now shows as the dot before a name and in the panel. Empty directions keep an open seat on the ring. Phones keep the list.

**Ninth pass — from the Home without a cut (owner, October 27, 2026).** The step from the Home into Galaxy felt broken: the Home zoomed toward the card, a disc covered the screen and Galaxy faded up already built — two scenes with a curtain between. After a prototype the owner approved, the nine spheres circling the symbol on the Home are now the same objects that form Galaxy's ring, and they travel:
- **The flight** (`components/flight/`): choosing a door on the Home (or the symbol) measures the nine spheres and the symbol's gem and hands them to `FlightLayer`, mounted in the root layout so it outlives the page change. The Home steps back (fades, drops, blurs) and its own spheres hide at once.
- **Galaxy says where to land:** it lays its ring out with the spheres hidden, measures each one (and the shop's gem), and the flying spheres travel there — one after another, on a small arc, turning from the Home's glow into Galaxy's sphere with its mark, already dimmed and muted as they'll be. The symbol's gem comes down to the heart of the ring and becomes the shop's gem. When they touch down Galaxy shows its own, the layer fades, and the title and filters arrive.
- **Only on desktop and with motion on** — that's where the ring is; phones and reduced motion keep the zoom door. If Galaxy never answers, the layer lets go after 3.5 s. The room template skips its settle-in when the flight brought the visitor.
- **The sphere is drawn in one place** (`galaxy/Sphere.tsx`), shared by the ring, the list and the flight.

**Tenth pass — one dashboard for every project (owner, October 27, 2026).** The four project pages (EterniCapsule, Figuitoon, Kangaroo Cleanup, Orbit 77) were four hand-copied files of ~750 lines each, with their own forms, type scales and section names, and every number written in three places (the doc, `lots.ts`, the page). After an analysis and a prototype the owner approved, they are one template:
- **`galaxy/[project]/page.tsx` + `room/ProjectDashboard.tsx`** render every project from **`lots.ts`** (name, hook, summary, numbers, ideal for, the link to its own site — the same row Galaxy reads) and **`rooms.ts`** (what changes hands, the ways in and their prices, after the deal, risks, the person, questions). The four old addresses are kept (`/ethernicapsule`, `/figurines`, `/kangaroo-cleanup`, `/orbit`); Momentos Eternos, URELIT, WEMAIT, Byndi and BackMate get theirs. Every sphere now opens its dashboard ("Open the project").
- **The first screen decides:** the sphere from Galaxy, name, hook, summary, **Visit {its site}** (where its product is sold — Pyadra sells the project, the project sells its product), up to four numbers each labelled with its evidence (§0), ideal for, and beside it the **ways in** with one button and "after the deal". The detail waits in tabs: what you'd take, how a deal works (the four steps — conversation, due diligence, legal review, signed), before you decide, the person, questions. Phones keep the ask in a bar at the bottom.
- **Four ways in:** acquire and operate end in a conversation (`/api/contact`, `express-interest`, with the option chosen); **support** (Orbit) keeps its real Stripe checkout (`/api/donate`) and live Season 2 bar; **forming** (BackMate) only asks for an email.
- **Numbers read live where they can** (`live.ts`): Kangaroo's Airtasker jobs and Orbit's episodes, raised and goal — in Galaxy and in the dashboard alike. EterniCapsule's live capsule counter is not shown until its fix is deployed (its zeros mean nothing yet).
- **Prices are estimates, set low on purpose (owner, October 27):** Pyadra wants allies who help it grow, not only buyers. EterniCapsule $1,500 / $3,000 · Figuitoon $2,500 · Kangaroo $2,500 + 8% / $4,000 + 5% / $6,000 + 3% · Momentos $750 / $1,500 · URELIT $1,000 / $2,000 · WEMAIT $1,500 / $3,000 · Byndi $750 / $1,500 · Orbit's support tiers unchanged. AUD. The owner will send the real figures. The dashboard calls them introductory; Galaxy's glance and panel show the lowest as "From $…" — a deliberate change to the "On request" rule above, which one line in `rooms.ts` (`priceFrom`) undoes. No struck-through prices (Figuitoon's "$15,000 → $11,500" is gone: its own doc says the figure isn't justified yet).
- **Honesty fixes on the way:** Byndi's proof line said "Live on Android · App Store next"; its doc marks store publication as unverified — it now reads "Built · in testing". Cristian Ruiz's photo is the team one (`/images/team/cris.jpg`).
- **Settled (owner, October 27):** Figuitoon's 3D printer is included in the sale. **Still open:** Byndi's doc says it is not exhibited yet and has no participation option; its dashboard uses the owner's estimate. BackMate has no project doc. Each project doc's copy deck must be reconciled with the new strings.

**Eleventh pass — one step into a project, and a quicker flight (owner, October 27, 2026).** The owner found two previews before a project redundant (the glance on hover, then a side panel showing nearly the same) and the step from the Home a little stuck. Now:
- **The side panel is gone.** The glance is the only preview; clicking the front sphere or **Open the project** goes straight to its dashboard (the zoom door). An old `?lot=` link opens the project itself.
- **The glance rises under the front sphere**, as one horizontal card (kind, hook, three numbers, "From $…", Open the project), so it never covers the spheres either side — the visitor can still reach right or left. The guide steps aside while it's open. The ring sits a little higher (`cy` 34%) to make room.
- **The flight starts at the click:** the Home hands over its spheres and changes page after 140 ms (was 420), and while Galaxy loads the spheres already drift toward where the ring will be instead of waiting; once Galaxy measures the ring they carry on from where they are. Each travels 0.8 s (was 1.05), 30 ms apart (was 45).

**Twelfth pass — two looks, each saying something new (owner, October 27, 2026).** With the side panel gone (eleventh pass) the owner missed the step where the chosen sphere is singled out; and the glance only ever showed the front sphere, so moving the hand to another sphere changed nothing, and it reached the guide. What the owner actually objected to was two previews saying the same thing. Now each step adds something:
- **Hover — what it is.** A small card on whichever sphere is under the hand (kind, name, hook, "From $…", "Click for the ways in"), above it on the near half of the ring and below it on the far half. It lifts that sphere to full opacity and to the top. Nothing covers the guide.
- **Click — how you'd come in** (`FocusPanel.tsx`). The sphere turns to the front and is ringed, the rest dim, the ring steps left, and the panel opens: the numbers with their evidence, ideal for, the ways in with their prices (three; the rest on the page), after the deal — and **Open the project** / **Visit {its site}**. ← → walk the projects, Esc or the field steps back; a second click on the chosen sphere opens the project too. `?lot=` is this panel again.
- **Open — everything** (the dashboard).

**Thirteenth pass — small fixes before deploying (owner, October 27, 2026).**
- **The curtain lasts long enough to read:** 3.2 s on the first visit of a session (was 2 s), 1.1 s when coming back (was 0.35 s, a flash).
- **The Home's sentence is said, not shouted:** Fraunces regular in `ink-soft` (new `TYPE.statement`) instead of semibold black, and without the dash — "Real projects, already built. Looking for the people who will take them further."
- **No dashes in the copy a visitor reads** on the Home, Galaxy and the dashboards (`lots.ts`, `rooms.ts`, the panel, the dialogs): the owner reads " — " as machine-written. Commas, colons and full stops instead; founders' quotes keep their words, only the punctuation changed. Other pages (manifesto, store, legal, team) were not touched.
- **The Home's doors lost their counts** ("6 projects", "An open seat"…): numbers on every card read as noise. Galaxy's filter still counts.
- **Hover says what it is; the panel says what it has:** the hover card no longer shows the price — "From $…" lives in the panel with the ways in.
- **The flight no longer pauses:** the path to the ring is a spring, so when Galaxy says where to land each sphere turns toward it with the speed it already has, instead of slowing to a stop and starting again; no sphere waits its turn.
- **The Observer number:** works in production (the database answers there); locally the Supabase key in `.env.local` is no longer registered, so the API returns no number and none is shown — by design, never an invented one.

**One data file.** `src/app/exhibitions/galaxy/lots.ts` holds one row per project — the "WHAT THE USER SEES BEFORE ENTERING" block plus `wayIn` and `stage`. `orbit.ts` computes every position from those two fields (sectors sized by how many lots they hold; spacing even along the ring, measured in card sizes). **Adding a project is adding a row.** Tested in `__tests__/orbit.test.ts`.

**Projects on the branch (owner, October 26–27, 2026):** EterniCapsule, Figuitoon, Byndi, Momentos Eternos, URELIT, WEMAIT (acquire · ready), Kangaroo Cleanup (operate · ready), Orbit 77 (support · ready), BackMate (forming).

**Before this can ship — owner decisions:**
- ~~The **way in** of Byndi, Momentos Inolvidables, Gym routines and We Made It.~~ Set: all four are `acquire` (October 27). Until set they sit in a sector labelled `To confirm`, which disappears once it's empty.
- Their **copy** (subtitle, proof, opportunity), from each one's Project Standard doc, and their **destination** (Pyadra page or own URL). We Made It has no details yet; BackMate exists in no doc.
- Rule changes this version makes, which §7 of [[Company_Master]] must record if accepted:
  - On the orbit a sphere shows **its name only**; the five elements move to the hover preview and the lot panel.
  - A sphere click **opens its panel** instead of going straight to the dashboard.
  - The Home's doors go **straight to Galaxy**; `/exhibitions` is no longer a required step.
  - `/exhibitions` **redirects to Galaxy** — the hall is gone while Galaxy is the only room.
  - The lot sheet can show an **asking price** in Galaxy, if the owner fills it (see [[Lot_Sheet_Template]]).
  - The curtain plays in full **once per session**, not on every visit.
- The copy deck below, `/team`'s `soon-*` rows and the metadata update with it, in the same commit.

---

## THE PAGE — WHAT IT ACTUALLY IS (v4)

### Structure

```
SiteNav (crumbs: Exhibitions / Galaxy · status badge: "4 live projects" · live dot)
  ↓
Headline: "Four projects." / "Already alive." (second line emerald)
Sub-line: "Step into any one of them. Take it further."
  ↓
THE ORBITAL FIELD (max-width 1100px)
  · three orbital rings (SVG, two dashed rings slowly counter-rotating)
  · central gem (desktop) → hover chip "The museum shop →" → /store
  · 2×2 grid of magnetic spheres — one per project
  · on mobile the shop entrance is its own row between sphere rows
  ↓
SiteFooter
```

### Each sphere shows exactly 5 things (copy deck below)

1. Type chip: `{Scope} · {Kind}` (e.g. `Glocal · Podcast`)
2. The sphere itself — magnetic hover, floating loop, logo inside
3. Project name
4. Subtitle line + proof line
5. Opportunity line (emerald)

### Interactions

- **Magnetic spheres** — follow the cursor slightly (springs), scale on hover, whole sphere is the link
- **Floating** — each sphere bobs on its own rhythm so the field breathes without a cursor
- **Parallax** — blueprint grid, rings and gem move at different depths with the mouse
- **Atmosphere** — grain, green dust particles (`GreenDust`, 280), ambient vignette

---

## COPY DECK — LOCKED STRINGS (v4 page)

_Verbatim record of every visible string in Galaxy. New copy is written here first; if this deck and the live page disagree, the deck is updated to the live string the same day, and a false live string is flagged ⚠ and fixed in code ([[Company_Master]] §6). Last reconciled against `page.tsx` on September 19, 2026._

### Headline block

- **H1 line 1:** `Four projects.`
- **H1 line 2 (emerald):** `Already alive.`
- **Sub-line:** `Step into any one of them. Take it further.`
- **Nav status badge:** `4 live projects` (live dot)

### The four spheres

|Project|Type chip|Subtitle|Proof line|Opportunity line|Logo|
|---|---|---|---|---|---|
|`Orbit 77`|`Glocal · Podcast`|`Podcast · real conversations`|`10 episodes live · Season 2 in the works`|`Open for support`|`/orbit-logo.png`|
|`EterniCapsule`|`Global · Digital vault`|`Encrypted time capsules`|`Built & live · Global product · Independently deployed (eternicapsule.com)`|`Open for acquisition`|inline gold capsule mark (TODO: real logo asset)|
|`Figuitoon`|`Glocal · Physical product`|`Custom 3D figurines`|`Prototype built · Shopify store · Printer included`|`Available to acquire`|`/figuitoon-logo.png`|
|`Kangaroo Cleanup`|`Local · Cleanup business`|`Local cleanup business`|`Sydney-based · 500+ jobs done · 5.0 reputation`|`Looking for a partner`|`/images/kangaroo/kangaroo_logo.png`|

> [!note] EterniCapsule proof line — fixed September 22, 2026 `Hosted on Pyadra` stopped being accurate when the product moved to its own deployment (eternicapsule.com, August 26, 2026; Pyadra's copy retired September 15). The v4.1 changelog below recorded the replacement, but it had only been made in this doc — `page.tsx` kept the old line until September 22, when the code was finally changed. Note the product still uses accounts Pyadra controls, which is why the owner is reviewing what "hosted" means in the deal options ([[EterniCapsule]]). Now deployed — live on `main` since September 22, 2026.

> [!warning] Proof lines carry numbers The `10 episodes` and `500+ jobs · 5.0` figures must match each project's canonical metrics ([[Orbit77]] metrics, [[Kangaroo_Cleanup]] METRICS AND NUMBERS). They are hardcoded in this page's `PROJECTS` array — now the only place, since the founder's room moved to `/team` and no longer lists per-project numbers (`/eduardo` is a permanent redirect to `/team`). If a number changes, update this page in the same commit.

> [!note] EterniCapsule subtitle says "Encrypted time capsules" Acceptable as shorthand for the key-locked seal, but see the truth correction in [[EterniCapsule]] — no in-browser encryption exists yet. When client-side AES ships this subtitle becomes fully literal. Re-checked and kept as an accepted owner decision (October 21, 2026): the shorthand stays as-is, to become literal with EterniCapsule v2.

### Shop entrance

- **Gem hover chip (desktop):** `The museum shop →`
- **Mobile row:** gem icon + `The museum shop →` → `/store`

---

## DESIGN

Galaxy uses the **light museum palette** — never a dark background (dark belongs inside projects that choose it).

|Token|Hex|Usage|
|---|---|---|
|Background|`#EDEFED`|Page — smoke gray|
|Text primary|`#1A1C1A`|Names, headline|
|Text secondary|`#3A4A3E`|Subtitles, sub-line|
|Text tertiary|`#6B8070`|Proof lines|
|Emerald|`#059669`|Accent line 2, opportunity lines, rings, gem|
|Grid/border|`#D4DDD6`|Blueprint grid, vignette|

**Sphere gradients (each project has its own material):** Orbit = green glass (`#F2FBF5→#A3CFB6`) · EterniCapsule = gold (`#FDF6EA→#D3B58C`) · Figuitoon = white porcelain · Kangaroo = warm sand (`#FFFEF9→#DCD5C2`).

**Typography:** Design System v1 (Fraunces / DM Sans / IBM Plex Mono via next/font). The Galaxy headline is bold sans with tight tracking; sphere copy uses the small utility sizes.

---

## DATA

The page is fully static today — the four projects live in the `PROJECTS` array in `page.tsx` (name, type, kind, logo, subtitle, proof, opportunity, enter_url, sphere material). With only four projects this is the right amount of engineering.

**Future (only when the project count makes editing code painful):** move the array to a `pyadra_projects` table or to `pyadra_settings`. Do not build it speculatively — that was decided against in the July 2026 database reset.

---

## WHAT GALAXY MUST NEVER DO

- Use a dark background — that belongs inside each project
- Use investment jargon: stocks, equity, token, NFT, blockchain, ROI
- Show valuation figures on spheres — value narratives live on project pages
- Promise returns — show proof, not guarantees
- Use generic language: "buy now", "add to cart", "shop", "checkout"
- Grow detail panels, tabs or forms back into the exhibition — Galaxy is the hook, not the story

---

## RELATED LINKS

**Documentation:** [[Company_Master]] · `VISION.md` (repo root) · [[Orbit77]] · [[EterniCapsule]] · [[Figuitoon]] · [[Kangaroo_Cleanup]]

**Code:** `src/app/exhibitions/galaxy/page.tsx` · `src/app/exhibitions/page.tsx` (the Exhibitions hall) · `src/app/components/ui/GreenDust.tsx` · `src/app/components/nav/SiteNav.tsx`

**Live URLs:** pyadra.io/exhibitions · pyadra.io/exhibitions/galaxy

**Other entrance to the same projects:** the founder's room `/eduardo` lists the four Galaxy projects with their own one-line summaries and links ([[Company_Master]] §7 flags this against the "projects only inside their exhibition" rule).

---

> [!note] Changelog v4.0 (July 14, 2026) — Full rewrite against the production page. The v3.2 document described a UI that no longer exists (side detail panel with Experience/Acquire tabs, in-panel express-interest form, per-sphere valuations, gris-ratón acquire palette, and an "Ebooks" project). Current reality: Galaxy is a thin orbital field — 4 spheres (Kangaroo Cleanup replaced Ebooks), one click straight into each project's page, central gem → museum shop, no panels or forms. Kept and sharpened the conceptual core (what Galaxy is, why it exists, tone, never-do list); moved all deal mechanics to each project's canonical doc; added the v4 copy deck verbatim from `page.tsx`. Contact email corrected (the old doc still said eduardo@pyadra.io — the only real inbox is pyadra@pyadra.io).

> [!note] Changelog v4.1 (September 15, 2026) — EterniCapsule's proof line corrected: "Hosted on Pyadra" → "Independently deployed (eternicapsule.com)", now that it split into its own repo/deploy. _(⚠ Added September 19: this change was made in the doc only, never in `page.tsx` — see v4.2.)_ Model/deal wording in the opportunity table unchanged — see [[EterniCapsule]] for the owner-decision flag on whether the "hosted deal" pricing logic still applies.

> [!note] Changelog v4.2 (September 19, 2026) — Documentation audit. Corrected the EterniCapsule proof line in the copy deck back to what is actually live (`Hosted on Pyadra`), flagged it ⚠ as outdated, and recorded that the v4.1 "correction" was never made in code — the proposed replacement is kept as a proposal. Theme updated to the live Exhibitions-page line (`Built projects, ready for their next chapter`). Copy-deck rule aligned with [[Company_Master]] §6. Added the `/eduardo` hardcoded proof lines to the sync rule, and the note on Galaxy's place in the business definition. Replaced the out-of-vault `[[VISION]]` link with a path.

> [!note] Changelog v4.3 (September 22, 2026) — The EterniCapsule proof line was corrected in `page.tsx` (`Hosted on Pyadra` → `Independently deployed (eternicapsule.com)`), so the deck and the page agree again; pending a deploy. Orbit's type is confirmed GLOCAL by the owner, matching the `Glocal · Podcast` chip on this page.

> [!note] Changelog v4.4 (October 21, 2026) — Documentation audit. The v4.3 corrections (EterniCapsule proof line, Orbit's GLOCAL chip) are confirmed live on `main`, so the "pending a deploy" note is resolved. The number-sync rule was corrected: the founder's room moved to `/team` (`/eduardo` now redirects there) and no longer lists per-project numbers, so Galaxy's `PROJECTS` array is the only hardcoded copy. The "Encrypted time capsules" shorthand was re-checked and kept as an accepted owner decision, to become literal with EterniCapsule v2. No copy-deck strings or numbers changed.

_END · GALAXY · v4.4 · October 21, 2026_
