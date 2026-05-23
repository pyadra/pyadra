# {{PROJECT NAME — PENDING}}

_Project document · Pyadra_ _Last updated: May 21, 2026_

---

## IDENTITY

**Type:** Type 3 — Exhibited External **Exhibition:** Galaxy **Status:** Forming **Founder / Creator:** Eduardo Díaz **Tagline (1 line):** {{PENDING — define when name is confirmed}}

---

## WHAT THE USER SEES BEFORE ENTERING

_This block feeds the public dashboard in Galaxy._ _Maximum 2 lines per field. No technical jargon. Write for the person standing in front of the exhibition._

**What it is (2 lines):**

> A physical collectible of yourself — transformed by AI, printed in 3D, and delivered to your door. Artistic, personal, and permanent.

**What they receive by participating:**

> A miniature version of you or someone you love. A physical artifact that exists in the real world — not on a screen.

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|Personalized 3D Figurine|Custom figurine — AI generation + 3D print + shipping|
|Price|$99 AUD|Fixed base price — premium and collection tiers TBD|
|What's included|Your figurine designed from a photo, 3D printed, and shipped to you. Each one is unique.|Photo → AI stylization → 3D model (Tripo/Meshy) → Blender cleanup → color print → packaging → ship|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|Figurines created|Shopify order count (via API)|
|Countries shipped|Shopify fulfillment data|
|Current wait time|Manual update — set in Shopify metafield|

**Access:**

- Type 3 — exhibited on Pyadra, sold externally: `[{{SHOPIFY STORE URL — PENDING}}]`
- QR on physical figurine → [pyadra.io](https://pyadra.io/) (entry into full ecosystem)

---

## INTERNAL DESCRIPTION

_For the founder. Does not appear on the dashboard._

**Problem it solves:** Digital projects are invisible in the physical world. Figurines creates a tangible, emotional object that pulls real people — strangers, passengers, friends — into the Pyadra ecosystem through curiosity. It solves the onboarding problem that no landing page can: a physical object in someone's hand creates a conversation that a website cannot.

**Why it exists on Pyadra:** Figurines is the physical gateway into Pyadra. While EterniCapsule preserves words and Orbit 77 preserves conversations, Figurines preserves identity — transformed into a collectible artifact. The QR code on every figurine is a portal. The physical object creates the curiosity. Pyadra captures it.

**Who it speaks to:**

- **Primary:** People who want something personal, artistic, and unique — not mass-produced. Gifts, self-expression, collectibles.
- **Secondary:** Anyone who encounters a figurine in the real world (Uber passengers, friends, events) and becomes curious about what it is and where it came from.

---

## EXPERIENCE & DESIGN

_How it feels, not just how it works. Required reading before touching any UI component._

**The feeling in one sentence:** Holding a miniature version of yourself — curious, personal, and slightly surreal.

**Atmosphere:** Artistic and collectable. Warm, personal, handcrafted in feel even if AI-assisted in process. Not clinical or corporate. Not a toy store. Closer to a boutique art studio — where each piece feels unique and intentional.

**Color palette:** {{PENDING — define when brand identity is finalized}}

**Typography:** {{PENDING — define when brand identity is finalized}}

**Key interactions:**

- **Product page on Shopify** — photo upload, customization options, order flow
- **QR on physical figurine** — scans to pyadra.io, entry into ecosystem
- **Galaxy dashboard** — shows figurine count, countries, wait time before linking to Shopify

**Animation principles:** {{PENDING — define when Pyadra dashboard component is built}}

**Copy voice:** Personal, warm, slightly playful. Artistic but accessible.

- ✅ "Your miniature self" / "Crafted from your photo" / "A physical artifact" / "One of a kind"
- ❌ "Order now" / "Add to cart" / "Buy figurine" / "Shop collection"

**Design rules (project-specific):**

- No generic e-commerce language on the Pyadra dashboard card
- The Shopify store can use standard e-commerce UX — that is acceptable for Type 3
- QR must always link to pyadra.io — never directly to the Shopify product

**What it must never feel like:**

- A mass-produced toy brand
- An Aliexpress product page
- A generic 3D printing service
- Something disposable

---

## ARCHITECTURE

_Type 3 — no native architecture on Pyadra. Production workflow documented here._

**Can it operate independently from Pyadra?** Yes — by design. The product lives on Shopify. Pyadra only displays it.

**Production workflow (current — manual):**

```
Customer submits photo (via Shopify or direct contact)
  ↓
Photo stylized using AI (ChatGPT / image generation tools)
  ↓
Stylized image uploaded to 3D conversion tool (Tripo or Meshy)
  Generates STL / rough 3D model
  ↓
Model imported into Blender
  Cleanup, adjustments, print preparation
  ↓
Sent to 3D printer ({{PENDING — own printer or external service}})
  Color print
  ↓
Quality check + packaging
  ↓
Shipped to customer
```

**Current bottlenecks:**

- No professional 3D printer owned — currently depends on external services ($75 AUD/figure production cost)
- Blender skills limited — cleanup is manual bottleneck
- AI tool subscriptions (Tripo, Meshy) limit free exports
- No production partner or operational co-founder

**Stack:**

- **Store:** Shopify ({{PENDING — not yet created}})
- **AI stylization:** ChatGPT / image generation tools
- **3D conversion:** Tripo / Meshy
- **3D editing:** Blender
- **Printing:** {{PENDING — own printer target}}
- **Pyadra display:** Static dashboard card in Galaxy (no backend required)

**Repository:** No code repository — Type 3 project. Pyadra only displays a dashboard card.

**Deploy:**

- Shopify store: {{PENDING}}
- Pyadra Galaxy dashboard card: `/exhibitions/galaxy/figurines`

**Pyadra dependencies:**

- Galaxy dashboard card component (display only — no payment, no DB)
- Link to external Shopify store

---

## FLOWS

**Customer Order Flow (Shopify):**

```
Customer discovers figurines
  Via: Pyadra Galaxy / QR on physical figurine / word of mouth
  ↓
Visits Shopify store
  ↓
Uploads photo + selects options
  ↓
Completes order ($99 AUD base)
  ↓
Eduardo receives order notification
  ↓
Production workflow begins (AI → 3D → Blender → print → QC)
  ↓
Figurine packaged and shipped
  ↓
Customer receives figurine
  QR code on figurine → pyadra.io
```

**QR Discovery Flow (physical world):**

```
Person encounters a figurine in the real world
  (Uber, event, friend's home, gift)
  ↓
Notices QR code — scans it
  ↓
Lands on pyadra.io
  ↓
Discovers Pyadra ecosystem (Galaxy, EterniCapsule, Orbit 77, Figurines)
  ↓
Potential new user / supporter / buyer
```

---

## PRODUCTS AND PRICING

|Product|Price|Status|Notes|
|---|---|---|---|
|Personalized figurine — base|$99 AUD|Planned|Single figurine from photo|
|Personalized figurine — premium|{{PENDING}}|Planned|Larger size, detailed finish, packaging|
|Profession collection|{{PENDING}}|Concept|Doctor, athlete, creator, etc. — pre-designed|
|World Cup / event editions|{{PENDING}}|Concept|Country-themed collectibles for global events|
|Car air freshener figurine|{{PENDING}}|Concept|Figurine + magnetic attachment + fragrance|

**Production cost (current):** ~$75 AUD per figure (external printing) **Target production cost:** <$30 AUD per figure (own printer) **Margin at $99 AUD with own printer:** ~$69 AUD per figure

---

## CURRENT STATE

**What works:**

- ✅ Concept validated — figurines attracted real attention from Uber passengers
- ✅ Basic AI → 3D workflow functional (ChatGPT → Tripo/Meshy → STL)
- ✅ Two physical prototypes produced and tested
- ✅ QR concept validated — physical object creates curiosity
- ✅ Price defined ($99 AUD)
- ✅ Product direction defined (personalized, artistic, collectable)

**What's missing:**

- ❌ Project name finalized
- ❌ Brand identity (logo, colors, typography)
- ❌ Shopify store created
- ❌ Domain purchased
- ❌ Professional 3D printer owned
- ❌ Blender workflow refined
- ❌ Packaging designed
- ❌ Production pipeline scalable
- ❌ Pyadra Galaxy dashboard card built
- ❌ First real paying customer

**Active blockers:**

- 🔴 **No Shopify store** — nothing to link to from Galaxy dashboard yet
- 🔴 **No finalized name** — blocks logo, domain, and brand creation
- 🟡 **Production cost** — $75 AUD/figure externally makes margin tight at $99 AUD. Own printer reduces this to ~$30 AUD.
- 🟡 **Blender bottleneck** — manual cleanup limits production speed

---

## OPEN QUESTIONS

**Technical:**

- Own printer model to buy? (color 3D printing — research needed)
- Blender automation possible? Or outsource cleanup?
- Shopify metafields for wait time — how to update efficiently?

**Business:**

- Final project name?
- Should premium tier exist at launch or start with base only?
- Fulfillment: self-ship or partner with fulfillment service?
- Should production be outsourced entirely to a print partner?

**Product:**

- Packaging design — box, card, unboxing experience?
- Should customers submit photos via Shopify or via email/WhatsApp first?
- Profession collections — launch with personalized only or include pre-designed?
- Air freshener version — is fragrance integration technically feasible?

---

## DECISIONS LOG

|Date|Decision|Reason|
|---|---|---|
|May 2026|Base price $99 AUD|Covers external production cost + margin. Reduces when own printer acquired.|
|May 2026|Type 3 — Exhibited External|Product lives on Shopify. Pyadra is display layer only.|
|May 2026|QR links to pyadra.io, not Shopify|Figurine is a gateway into the ecosystem, not just a product sale.|
|May 2026|Forming status — not Active|No store, no pipeline, no paying customers yet. Honest state.|

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:** Not yet — because the product doesn't exist at scale yet. But the potential is the strongest of all three projects for the physical world. When someone holds a miniature version of themselves, that object matters. That object is not deleted, not forgotten, not scrolled past. It sits on a desk. It travels in a bag. It creates conversations.

The question will be answered the moment the first customer holds their figurine.

---

## ASSET VALUE

_For potential buyers and participants. Answers: what can they get involved in, how, and what do they receive._

**Maturity level:** Prototype — concept validated, two physical prototypes exist, no commercial operation yet.

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical|AI-to-3D workflow (ChatGPT → Tripo/Meshy → Blender → print), Shopify store structure (once built), QR integration concept, production documentation|
|Brand|{{PENDING — name, logo, visual identity}} + emotional positioning, Pyadra ecosystem integration, QR gateway concept|
|Product|Personalized figurine concept, validated emotional interaction (Uber test), two physical prototypes, product line concepts (profession, World Cup, air freshener)|
|Operational|Production workflow documentation, supplier/printer research, Shopify operational guide (once built)|

**Participation models:** _Pyadra supports different levels of involvement — from customer to operational partner._

|Model|Description|Investment range|Status|
|---|---|---|---|
|Customer|Orders a figurine ($99 AUD). No ownership.|$99 AUD|Planned (once Shopify live)|
|Operational partner|Acquires a % and manages production side — printing, fulfillment, Shopify operations. Eduardo retains creative direction.|TBD — requires legal review|Planned (Phase 2)|
|Partial acquisition|Buys a % of the project. Revenue share proportional to stake.|TBD — requires legal review|Planned (Phase 2)|
|Full acquisition|Buys 100% of the project. Creator retains royalty + advisory role.|TBD — requires legal review|Planned (Phase 2)|
|Hosted ownership|Acquires ownership, Pyadra maintains display and ecosystem integration.|TBD — requires legal review|Planned (Phase 2)|

**How a participant or buyer makes money:**

|Revenue stream|Current state|Potential|
|---|---|---|
|Personalized figurines ($99 AUD)|Not active — no store yet|At 50 figurines/month = $4,950 AUD/month (with own printer)|
|Profession collection (pre-designed)|Concept only|Lower production cost, higher volume potential|
|Event editions (World Cup, etc.)|Concept only|Seasonal spikes, high emotional relevance|
|Wholesale / B2B (events, gifts)|Not explored|Corporate gifts, event merchandise, sports clubs|
|Physical + QR ecosystem referrals|Indirect|Every figurine sold drives traffic to Pyadra|

**Post-participation structure:**

- Participant / buyer receives: agreed % of Shopify revenue + operational ownership
- Original creator retains: perpetual royalty (% TBD), creative direction, Pyadra ecosystem integration rights
- Pyadra receives: ecosystem display fee + transaction fee if acquisition processed through Pyadra (Phase 2)

**What must happen before this project can be sold or partially acquired:**

- [ ] Name finalized and brand created
- [ ] Shopify store live with first sale
- [ ] Own printer acquired (production cost validated)
- [ ] Production pipeline documented and repeatable
- [ ] Legal review completed (ASIC Australia)

---

## ROADMAP

**Now (Q2 2026 — immediate):**

- [ ] Finalize project name
- [ ] Create brand identity (logo, colors, typography)
- [ ] Purchase domain
- [ ] Create Shopify store
- [ ] Acquire professional color 3D printer
- [ ] Refine Blender workflow
- [ ] Build Pyadra Galaxy dashboard card
- [ ] First paying customer

**Next (Q3 2026):**

- [ ] Design packaging (box, card, unboxing experience)
- [ ] Launch profession collection (pre-designed figurines)
- [ ] Optimize production pipeline (target: <$30 AUD cost per figure)
- [ ] First 10 orders fulfilled and reviewed
- [ ] Explore fulfillment partner for scaling

**Future (no fixed date):**

- [ ] World Cup / event edition launches
- [ ] Car air freshener figurine (if technically feasible)
- [ ] B2B / wholesale model (corporate gifts, events)
- [ ] Operational partner or partial acquisition (Phase 2)
- [ ] Physical retail presence (pop-up, market stalls, or permanent)

---

## RELATED LINKS

**Documentation:**

- [[VISION]]
- [[ROADMAP]]

**External:**

- Shopify store: {{PENDING}}
- Domain: {{PENDING}}
- Instagram: {{PENDING}}

**Production tools:**

- [Tripo](https://www.tripo3d.ai/) — AI 3D model generation
- [Meshy](https://www.meshy.ai/) — AI 3D model generation
- Blender — 3D cleanup and print preparation

**Sibling projects in Galaxy:**

- [[ETHERNICAPSULE]] — Time-locked cryptographic messages
- [[ORBIT77]] — Podcast + supporter funding

---

_END · {{PROJECT NAME}} · v1.0_