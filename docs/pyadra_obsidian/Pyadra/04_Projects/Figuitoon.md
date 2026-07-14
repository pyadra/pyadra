---

## tags: [pyadra, project, figuitoon, galaxy, glocal] created: 2026-06-29 version: 1.2 status: active type: GLOCAL exhibition: Galaxy updated: 2026-07-14

# Figuitoon

## IDENTITY

**Name:** Figuitoon **Type:** GLOCAL (global product · local production & delivery) **Exhibition:** [[Galaxy]] **Status:** Functional prototype — pre-sale validation **Founder / builder:** Eduardo Díaz **Future owner / CEO:** Charina Loja (takes ownership once the project is running) **Page label:** Project Handover / Product Store

> [!note] Galaxy zone Galaxy is "60% investment showcase, 40% product store." Figuitoon uses both: a light/product zone (the Shopify store, buy a figurine) and a dark/handover zone (acquire or operate the project). It replaces no prior project — it's a native Galaxy product.

---

## WHAT THE USER SEES BEFORE ENTERING

> [!note] Two audiences, one project
> 
> - **Customer** → buys a personalized 3D figurine ($49 AUD).
> - **Buyer / operator** → acquires the project to run it (handover to a CEO/owner).

**Tagline (working):** `Your face. Your team. Your figurine.` **One-line:** `A custom 3D-printed collectible — upload a photo, pick a model, get a stylized mini version of you.`

**Public metrics (all real — no sales yet):**

- Figurines sold: 0 (be the first)
- Styles in catalogue: +100 (teams, sports & professions) — owner-confirmed July 2026
- Price: $49 AUD (launch / validation price)
- Production: in-house, Bambu 3D printer
- Project value: $15,000 AUD · launch sale price: $11,500 AUD (owner-decided July 2026)

---

## INTERNAL DESCRIPTION

Figuitoon is a Shopify e-commerce project selling custom 3D-printed figurines. A customer picks a base model, uploads a photo of their face, and receives a physical, stylized collectible figurine — a "mini-me" with a caricatured big-head look, a themed body, and a 3D-printed finish.

It is deliberately NOT an exact replica of the customer or of existing branded toys. Figuitoon has its own visual style: cartoon face, big head, themed body, limited-color 3D print. The first catalogue is 10 South American football team editions, with room to grow into other sports (rugby, NBA), professions, pets, eSports, and custom themes.

The project is at functional-prototype stage: the store exists, renders and a first catalogue exist, print tests and assembly tests have been done, and there's a working pipeline from photo to physical figurine. No commercial sales yet, no formal marketing yet.

**Why GLOCAL:** the product and store are global (anyone can order online), but production and initial delivery are local (printed on Eduardo's Bambu printer in Perth, hand-delivered locally, shipped for the rest of Australia).

**Commercial strategy (initial):**

The first commercial idea is to use the product as a physical conversation object:

- Place Figuitoon figurines inside an Uber car so passengers see them, ask, and scan a QR — turning the car into a moving display.
- Possibly test the same with a friend in the USA using their Uber car as an exposure channel.
- In Perth: initial delivery in person and free. Rest of Australia: charge shipping.

> [!note] This is a scrappy validation tactic, not a marketing plan The Uber-display idea is a clever zero-cost way to get first eyes and maybe first sales. It is not a substitute for a real marketing strategy, which is still an open item.

**Operation & handover (Charina):**

Figuitoon is associated with **Charina Loja**. She bought the 3D printer and is the person who could stay running the project. The vision: Eduardo sets up the system and leaves it working, then steps back from daily operation. Charina maintains and grows Figuitoon, with Eduardo's support when needed, and becomes CEO/owner once it's running.

> [!important] Document everything for the handover Because the project is meant to run without depending on Eduardo's memory, the operations manual is essential: the full pipeline, print settings, color rules, assembly steps, supplier/filament info, and the bad-photo policy. The handover only works if it's written down.

**Why it exists on Pyadra:**

Within [[Galaxy]], Figuitoon presents as a project that was created, tested and documented — not just an idea. It's a functional prototype combining brand, e-commerce, AI, 3D printing, a physical product, Shopify, social media, a production flow, and real tests. It can serve as a case study of building a physical product using digital tools, and as a project with potential for operation or sale (handover to Charina).

---

## EXPERIENCE & DESIGN

**The product concept**

The customer receives a figurine made of:

- A head inspired by their uploaded photo (Figuitoon style, not exact)
- A themed body (e.g. a football kit by color/pattern)
- A base
- Limited-color 3D print finish
- Size: ~15–16 cm with base

The final product is a stylized, collectible, personalized version — never an exact replica of the customer or the digital render. This expectation must be set clearly on the store (the render is a reference; the physical result varies in color, texture, dimensions, detail).

**Modular architecture (production strategy)**

The figurine is produced in parts: custom head + themed body + base + (future) accessories. The strategy is to reuse generic bodies and personalize mainly the head — this cuts design time, complexity, and cost. A head/body connector system keeps parts interchangeable.

**Color constraint (core design rule)**

The printer handles a maximum of 4 colors per piece. So designs must be simplified:

- Body keeps a simple structure: skin color, black or white, plus one or two main team/category colors.
- The shirt/jersey is the most expressive part of the model; arms, legs, socks, shorts and shoes stay simple to reduce errors and waste.

**IP / legal design rules (locked)**

- NO real federation crests or brand logos on figurines.
- Color-and-pattern only to evoke a team — never the official mark.
- A Figuitoon isotype replaces federation marks.
- The product is "inspired by," a stylized original — not a counterfeit.

**Copy voice**

Playful, warm, collectible-culture. Never "cheap toy." It's a personalized keepsake. Avoid claiming it's an exact likeness; sell the fun of a stylized mini-you.

---

## ARCHITECTURE

**Stack / tools**

The project combines AI, 3D modeling, Shopify and 3D printing into a working pipeline:

- **Shopify** — the online store
- **ChatGPT** — prompts, renders, visual style, face-to-style transformation
- **Hunyuan3D / Wuhan 3D** — converts the 2D design into a 3D file
- **Bambu Studio** — prepares the print files
- **Bambu 3D printer (X1, AMS multicolor)** — produces the figurines
- **Instagram & TikTok** — initial digital presence

> [!note] Pipeline status The route works end-to-end (photo → stylized face → 3D file → print → assembly → figurine), but each step still needs optimization for time, cost and quality.

> [!important] Shopify is the ONLY sales channel (decision July 14, 2026) Pyadra once had an internal Figuitoon purchase flow (forge/upload/sealed pages, `/api/figurines`, a `figurine_orders` table and a Stripe webhook branch). It was never linked from anywhere and was removed entirely in the July 14 cleanup — code and table (migration 0008). Figuitoon takes orders exclusively on its Shopify store (`figuitoon.com`); the Pyadra page is a showcase + project-sale dashboard that links out via "Make mine →". Do not rebuild an internal checkout without an owner decision.

---

## FLOWS

**Customer purchase flow:**

1. Customer enters the Shopify store
2. Selects a base model
3. Reviews the reference render
4. Reads the photo-upload instructions
5. Uploads a clear, front-facing photo
6. Completes the purchase
7. Figuitoon processes the image
8. The face is generated in Figuitoon style
9. The 3D file is prepared
10. The figurine is printed
11. The figurine is assembled
12. Delivered (free locally in Perth) or shipped (rest of Australia)

> [!warning] Open flow gap What happens when a customer uploads a bad photo (blurry, side angle, poor lighting)? No policy yet. Needs a defined fallback (request a new photo, best-effort with disclaimer, refund). See Open Questions.

---

## PRODUCTS AND PRICING

|Product|Price (AUD)|State|
|---|---|---|
|Figuitoon Standard|$49|Launch / validation price|
|Accessories (future)|TBD|Upsells: car mount, keyring loop, special base, themed accessories, premium versions, gift figurines|

> [!note] Price is a validation price, not final $49 AUD is a launch and validation price, set before the real per-figurine cost is known. It may change once cost, waste and production time are measured. Do not present it as a permanent price.

> [!warning] Cost is not yet known The real cost per figurine has not been calculated. Print times are currently high (head ~16h, body ~14h), and there's filament waste, color-mixing issues, and finishing work to resolve. Margin is unproven until cost is measured. This is the #1 thing to validate before scaling.

---

## CURRENT STATE

**Figuitoon already has:**

- Shopify store created
- Brand and concept defined
- Initial renders
- First catalogue (10 football models, South America)
- Print tests done
- Assembly tests done
- Initial measurements
- Production flow tested end-to-end
- Social media created
- Launch price defined
- 3D printer purchased (by Charina)

**Figuitoon does NOT yet have:**

- Any sales (zero)
- A formal marketing strategy executed
- A known per-figurine cost
- Defined production / delivery / variation policies
- A complete written operations manual

**Maturity:** Functional prototype. Technically works; commercially unvalidated.

---

## OPEN QUESTIONS

- [ ] Calculate the real cost per figurine (filament, time, electricity, failed prints)
- [ ] Reduce filament waste
- [ ] Improve print quality (finish, supports, texture, calibration, nozzle changes)
- [ ] Optimize production time (head ~16h / body ~14h is too high)
- [ ] Define the bad-photo policy
- [ ] Validate willingness to pay (first real sales)
- [ ] Create and run marketing
- [ ] Document the full process (operations manual for handover to Charina)
- [ ] Define production, delivery and variation policies
- [ ] Clarify daily operation

---

## DECISIONS LOG

- Name is **Figuitoon** (not "Figitune" / other spellings)
- Type is GLOCAL: global store, local production & delivery
- Modular head/body architecture; reuse bodies, personalize the head
- Max 4 colors per piece → simplified body design, expressive shirt
- IP rule: no real crests/logos — color-and-pattern + Figuitoon isotype only
- Launch price $49 AUD as validation price
- Charina owns the printer; she becomes CEO/owner once the project is running; Eduardo builds and sets it up, then steps back from daily operation
- First commercial idea: figurines as physical conversation objects (Uber car as a moving display with a QR code)

---

## THE QUESTION THAT DEFINES EVERYTHING

**Can the standard figurine be sold, produced at acceptable quality, and still leave a margin?**

Everything else (more categories, accessories, premium versions) is secondary. The priority is NOT to create more variants — it's to validate that the standard product can sell, print well, and make money. Until that's true, Figuitoon is a working prototype, not a business.

---

## ASSET VALUE

**What Figuitoon is, honestly:** a built, functional prototype with a real pipeline, brand, store and first catalogue — but zero sales and unproven unit economics. It is valued like a _built pre-revenue product with physical assets_, not like a running business (see [[Company_Master]] valuation methods).

**Initial sale idea (draft):**

|Item|Detail|
|---|---|
|Working sale price (draft)|$11,500 AUD|
|What's included (draft)|Brand, logo, Shopify store, social media, renders, initial models, prompts, production process, the 3D printer, filaments, files, test results, operations manual, accumulated know-how, initial marketing strategy, full workflow|

> [!warning] The $11,500 figure is not yet justified — and the printer is Charina's Two honesty flags, in line with how other Pyadra projects are valued:
> 
> 1. **No sales = the value rests on the asset, not earnings.** To justify $11,500, Figuitoon needs first sales, documented costs, recorded tests, physical samples, and a clear operations manual. Without those, a buyer values it as an unproven prototype (much lower). Don't show a hard valuation headline on the page — use a narrative of what's built, per [[Company_Master]].
> 2. **The 3D printer belongs to Charina.** It is listed in "what's included," but Charina owns it and is the intended future CEO/owner. The printer (and Charina's role) cannot be sold out from under her. The deal structure must be defined WITH Charina before any sale is offered. This is a real blocker, not a detail.

> [!note] Charina is the planned destination, not a co-decider today Eduardo builds and decides now; Charina becomes CEO/owner once the project is running. So the "sale" of Figuitoon is really a handover to Charina, not a sale to a stranger — unless the plan changes. Clarify which path before building a sale page: handover-to-Charina vs sell-to-external. They are different pages.

**Pyadra's cut:** per [[Company_Master]], Pyadra retains a 1–5% permanent stake + transaction fee on any deal. Figuitoon is GLOCAL and self-produced, so infrastructure (printer, filament) is the operator's — consistent with the Pyadra principle that operators carry production costs.

**How a participant or buyer makes money (revenue streams):**

|Stream|State|Potential|
|---|---|---|
|Standard figurine ($49)|Active store, no sales yet|Core product — must validate first|
|Accessories / upsells|Not built|Car mount, keyring, special base, premium versions, gift figurines|
|New categories|Renders only (football)|Rugby, NBA, professions, pets, eSports, custom|
|Gift / personalized market|Concept|Personalized gifts as a use case|

> [!note] World Cup 2026 angle The football editions target the Latin diaspora around the FIFA World Cup 2026 — a time-bound traffic opportunity. SEO and launch timing should ride that window.

## COPY DECK — LOCKED STRINGS

> [!important] How to use this section Single source of truth for every visible string on the Figuitoon page. Claude Code copies verbatim — no paraphrasing, no inventing. For any NUMBER, the metrics in "WHAT THE USER SEES" and "PRODUCTS AND PRICING" are canonical; update those first. NOTE: this deck is a v1 draft — Figuitoon has no page built yet, and the sale path depends on the Charina decision (handover vs external sale).

### Identity block

- **Nav status badge (SiteNav, live dot):** `For sale`
- **Type badge:** `Local production · Global store`
- **Status badge (identity panel):** `Prototype · Pre-launch`
- **H1:** `Figuitoon`
- **Tagline (serif italic):** `Your face. Your team. Your figurine.`
- **Intro:** `Figuitoon turns one photo into a mini you — a 3D-printed figurine in your favourite team's colors, your sport or your profession. Made for gifts, keepsakes and collectors.`

### What you get (PROJECT — buyer view, updated July 2026)

> [!important] This page sells the PROJECT, not figurines (owner decision, July 2026) "What You Get" lists what the buyer of the project takes, not what a figurine customer receives. Figurine-customer copy lives on the Shopify store, not here.

Section label: `What You Get` · counter `6 assets`

|Title|Description|
|---|---|
|`The store`|`A polished Shopify e-commerce where customers order their figuitoons — products, inventory and deliveries managed in one place.`|
|`100+ styles`|`More than one hundred designs across teams, sports and professions, ready to sell.`|
|`The brand`|`Name, logo, visual identity and the Instagram presence — all included.`|
|`The 3D printer`|`The Bambu printer that produces every figurine comes with the project.`|
|`The software pipeline`|`Turns a customer's photo into a stylized render, then into a print-ready 3D file.`|
|`The know-how`|`Print settings, measurements, filaments, 3D structure — and what we've learned about making it profitable.`|

### Store metrics (real — no sales yet)

|Label|Value|Sub|
|---|---|---|
|`Styles`|`+100`|`teams & professions`|
|`Price`|`$49 AUD`|`launch price`|
|`Made to order`|`100%`|`from your photo`|

> [!warning] No fake sales Do not display invented sales counts. There are zero sales. If a "sold" counter is shown, it must be real (currently 0) and framed invitingly ("be the first").

### How it works (the flow)

> [!note] Removed from the Pyadra page (owner decision, July 2026) The 5-step flow panel was redundant with the intro and the pipeline asset. Kept here only as internal reference: `1. Pick a model` · `2. Upload a clear front photo` · `3. We stylize your face` · `4. We print & assemble` · `5. Delivered to you`

### Expectation-setting

> [!note] Removed from the Pyadra page (owner decision, July 2026) The render-is-a-reference disclaimer is figurine-customer copy — it belongs on the Shopify store, not on the project-sale page. Old string kept for the store: `The render is a reference. Your figurine is hand-made and 3D-printed, so colors, texture and small details will vary. That's what makes it yours.`

### The honest risks (handover/acquisition zone)

Section label: `The Honest Risks`

|Title|Description|
|---|---|
|`No sales yet`|`The store and the product are real and tested, but no one has bought one yet. You'd be validating demand.`|
|`Costs not yet measured`|`Print times are still high and the true cost per figurine isn't calculated yet. Margin is unproven.`|
|`Quality still maturing`|`It prints and assembles, but finish, waste and calibration still need work to reach premium quality.`|
|`Built to hand over`|`It's designed to run without the original builder — but the operations manual is still being written.`|

### Acquisition panel (updated July 2026 — direct sale, launch price)

- **Value anchor:** label `Project value` · figure `$15,000 AUD` · sub-line `brand, store, pipeline, printer, files, know-how`
- **Launch price line:** `Launch price — the full project for $11,500 AUD instead of $15,000.`
- **Availability:** `By conversation`
- **Deal cards:** `Take it all` (featured, `$11,500`, sub `Everything included — store, brand, printer, files, styles, know-how.`) · `Make an offer` (`Let's talk`, sub `Different structure? Let's talk.`)

> [!note] Owner decision (July 2026) Eduardo values the project at $15,000 AUD and sells it at $11,500 AUD as a launch price. This IS a direct sale — the buyer takes everything, including the 3D printer.

### Founder block (drawer — updated July 2026)

- **Founder:** Charina Oan (surname confirmed by owner, July 2026 — earlier deck versions said "Loja")
- **Photo:** `public/images/figuitoon/charina_founder.jpg` · chip `Charina · Philippines`
- **Quote (serif italic):** `"I'm from the Philippines and helping people is just who I am. Figuitoon caught me because I love new things — innovating, creating something people haven't seen before."`
- **Signature:** `Charina Oan` · `Founder · Figuitoon, 2026`

### FAQ (drawer)

|Q|A|
|---|---|
|`Does it really work end-to-end?`|`Yes — the pipeline runs from photo to physical figurine. The Shopify store is live for orders. The first paying customer is still pending; everything else has been tested.`|
|`Why $11,500 and not $15,000?`|`The project is valued at $15,000 AUD — brand, store, styles, printer, pipeline and know-how. $11,500 is the launch price while Figuitoon is new to the museum.`|
|`What exactly is for sale on this page?`|`The whole project — brand, Shopify store, the 3D printer, files, pipeline and know-how. Buying a figurine is a separate thing (the Make mine button).`|
|`Why $49 per figurine?`|`It is a launch / validation price set before the true per-figurine cost is fully measured. It may change once production costs and waste are properly calculated.`|

### Acquisition dialog (verbatim)

|Field|String|
|---|---|
|Kicker|`Figuitoon · Acquisition enquiry`|
|Heading|`Talk about Figuitoon.` (Make-an-offer variant: `Tell us your structure.`)|
|Intro|`Leave your details below. Charina handles negotiations directly and personally.`|
|Field labels|`Name` · `Email` · `Your offer` (offer variant) · `Short note`|
|Error fallback|`Something went wrong.`|

### Drawer shell

- **Drawer trigger:** `Read FAQ & The Full Story →`
- **Founder photo chip:** `Charina · Philippines`
- **Store button (in drawer):** links to `CONFIG.SHOPIFY_URL`

### Secondary CTAs & labels

- **Product CTA:** `Make mine →` → `https://www.figuitoon.com` (Shopify — the ONLY purchase path)
- **Project CTA:** deal cards open the acquisition dialog
- **Contact email:** `pyadra@pyadra.io`
- **Social:** `Instagram` → `https://www.instagram.com/figuitoon` (button in drawer next to the store button) · `TikTok` (TBD)

### Strings that must never appear

```
exact replica · perfect likeness · clone of you
official [team] merchandise · licensed
buy now · add to cart spam · cheap
fake sales numbers
```

---

## ROADMAP

_Priorities only. One line per item._

**Now (current quarter):**

- [ ] Calculate the real cost per figurine (filament, time, electricity, failed prints)
- [ ] Get the first real sales (validate willingness to pay $49)
- [ ] Reduce filament waste and improve print quality (finish, supports, calibration)

**Next (following quarter):**

- [ ] Optimize production time (head ~16h / body ~14h is too high)
- [ ] Write the operations manual (for the handover to Charina)
- [ ] Define the bad-photo policy and production/delivery/variation policies
- [ ] Run a first marketing test (the Uber-display tactic)

**Future (no fixed date):**

- [ ] New categories (rugby, NBA, professions, pets, eSports, custom)
- [ ] Paid accessories / upsells (car mount, keyring, premium versions)
- [ ] Full handover of CEO/ownership to Charina once running

---

## RELATED LINKS

- [[Company_Master]] — read before working with this project
- [[Galaxy]] — exhibition where this project lives
- [[Kangaroo_Cleanup]] · [[EterniCapsule]] · [[Orbit77]] — sibling Galaxy projects

---

> [!note] Changelog v1.0 (June 2026) — First structured version of Figuitoon, organized from Eduardo's mental dump into the Pyadra project template. Captured concept, pipeline, modular architecture, color/IP rules, current state, open questions, asset value, and a v1 copy deck. Two key flags: the $11,500 valuation needs first sales + cost data to justify, and the sale path depends on the Charina decision (handover vs external) since she owns the printer and is the intended CEO/owner. No page built yet.

> [!note] Changelog v1.1 (June 2026) — Added the ROADMAP section (Now/Next/Future) reconstructed from Eduardo's priorities: cost + first sales now; production optimization + ops manual next; new categories + accessories + Charina handover future.

> [!note] Changelog v1.2 (July 14, 2026) — Reconciled against the live page (the "no page built yet" flag from v1.0 is obsolete — the dashboard is live at /exhibitions/galaxy/figurines). Copy deck completed with the strings that existed on the page but not in the deck: nav badge `For sale`, the 4-entry FAQ, the acquisition dialog, and the drawer shell. Recorded the July 14 decision: the never-used internal purchase flow (forge/upload/sealed, /api/figurines, figurine_orders table, webhook branch) was deleted — Shopify (figuitoon.com) is the ONLY sales channel; do not rebuild an internal checkout without an owner decision.

_END · FIGUITOON · v1.2 · Pyadra 2026