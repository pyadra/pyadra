# Ebooks

_Project document · Pyadra_ _Last updated: May 21, 2026_

---

## IDENTITY

**Type:** Type 2 — External Project with Internal Product **Exhibition:** Galaxy **Status:** Forming **Founder / Creator:** Eduardo Díaz **Tagline (1 line):** {{PENDING — define when first book and sales model are confirmed}}

---

## WHAT THE USER SEES BEFORE ENTERING

_This block feeds the public dashboard in Galaxy._ _Maximum 2 lines per field. No technical jargon. Write for the person standing in front of the exhibition._

**What it is (2 lines):**

> Stories born from real encounters, real journeys, and real emotions — transformed into narrative worlds. Not what happened. What it felt like.

**What they receive by participating:**

> {{PENDING — define once sales model is confirmed (PDF download / physical book / exclusive Pyadra edition / early access)}}

**Main product:**

|Field|Public-facing text|Technical reference|
|---|---|---|
|Product name|{{PENDING — first book title}}|{{PENDING}}|
|Price|{{PENDING}}|{{PENDING — digital / physical / both}}|
|What's included|{{PENDING}}|{{PENDING}}|

**Project metrics (all dynamic — never hardcode):**

|What the user sees|Data source|
|---|---|
|{{PENDING}}|{{PENDING}}|

**Access:**

- Internal product on Pyadra: `{{PENDING}}`
- External platform (Amazon / Gumroad / other): `{{PENDING}}`

---

## INTERNAL DESCRIPTION

_For the founder. Does not appear on the dashboard._

**Problem it solves:** Some of the fastest and most emotionally accessible products people can buy are stories. Unlike software or platforms, books let people connect emotionally without needing to understand technology. Ebooks is the lowest-friction entry point into the Pyadra ecosystem — a story requires no onboarding, no setup, no learning curve. Just reading.

**Why it exists on Pyadra:** Ebooks is the narrative soul of Pyadra. While EterniCapsule preserves words, Orbit 77 preserves conversations, and Figurines preserves identity — Ebooks transforms real experiences into mythology. It completes the emotional ecosystem: technology, community, physical artifacts, and now stories.

**Who it speaks to:**

- **Primary:** People who connect emotionally with stories about migration, loneliness, identity, and transformation. Readers who want something real underneath the fiction.
- **Secondary:** Anyone inside the Pyadra ecosystem who discovers that the same person behind the technology is also a storyteller.

**Book concepts (current):**

_Concept 1 — Mythologized Personal Journey:_ A fictionalized fantasy-inspired story loosely based on the creator's real life. A young person from a small country crossing oceans, surviving emotionally, and evolving through difficult journeys. Real experiences transformed into mythological storytelling — not autobiography, but personal mythology.

_Concept 2 — Uber Stories:_ A collection of stories inspired by real encounters while driving Uber in Australia. Unusual people, emotional conversations, strange situations, confessions, and unexpected human moments — transformed into cinematic, psychologically intense narratives. Mystery, urban loneliness, emotional realism. Not a diary. A literary collection.

---

## EXPERIENCE & DESIGN

_How it feels, not just how it works. Required reading before touching any UI component._

**The feeling in one sentence:** {{PENDING — define once first book tone is confirmed}}

**Atmosphere:** {{PENDING — will derive from first book's narrative tone (dark / warm / mysterious / cinematic)}}

**Color palette:** {{PENDING — define when brand identity is created}}

**Typography:** {{PENDING — will likely inherit Pyadra serif direction: Cormorant Garamond for titles}}

**Key interactions:**

- {{PENDING — depends on sales model: download flow / chapter unlock / physical order}}

**Animation principles:** {{PENDING}}

**Copy voice:** Literary, not commercial. Emotional, not descriptive.

- ✅ "A story that stays" / "Enter the world" / "Read the transmission"
- ❌ "Buy now" / "Download ebook" / "Add to cart" / "Get your copy"

**Design rules (project-specific):**

- No generic publishing language on the Pyadra dashboard card
- The external platform (Amazon, Gumroad) can use standard UX — acceptable for Type 2
- Pyadra exclusive product must offer something unavailable anywhere else

**What it must never feel like:**

- A self-published book on Amazon with no identity
- A generic PDF download
- A blog post sold as a book
- Something rushed

---

## ARCHITECTURE

_Type 2 — book lives on external platform. Internal Pyadra product TBD._

**Can it operate independently from Pyadra?** Yes — by design. The book exists on external platforms. Pyadra hosts only the exclusive internal product.

**Stack:**

- **External platform:** {{PENDING — Amazon KDP / Gumroad / own site}}
- **Internal Pyadra product:** {{PENDING — PDF delivery / credential / early access system}}
- **Writing:** {{PENDING — tool TBD}}
- **Design:** {{PENDING — cover design tool TBD}}

**Repository:** No code repository yet. Will depend on chosen sales model.

**Deploy:**

- External: {{PENDING}}
- Pyadra internal product: {{PENDING}}

**Pyadra dependencies:**

- Galaxy dashboard card (display + internal product access)
- {{PENDING — payment and delivery system once sales model defined}}

**What independence requires:** Already independent by design — external platform handles sales and delivery.

---

## FLOWS

**Reader Purchase Flow:**

```
{{PENDING — depends on sales model}}

Possible paths:
A) Pyadra exclusive edition:
   User discovers Ebooks in Galaxy
     ↓
   Buys exclusive edition in Pyadra → receives PDF or physical
     ↓
   Also finds standard edition on Amazon / Gumroad

B) Early access model:
   User pays in Pyadra → receives chapters as published
     ↓
   Receives permanent credential as early supporter
     ↓
   Full book releases on Amazon when complete

C) Collectible edition:
   Standard book on Amazon (free or paid)
     ↓
   Pyadra sells illustrated / annotated / special edition
   with unique digital object or credential attached
```

---

## PRODUCTS AND PRICING

|Product|Price|Status|Notes|
|---|---|---|---|
|{{First book title}} — standard edition|{{PENDING}}|Forming|External platform (Amazon / Gumroad)|
|{{First book title}} — Pyadra exclusive|{{PENDING}}|Forming|Only available on Pyadra — format TBD|
|Uber Stories collection|{{PENDING}}|Concept|Second book concept|
|Physical printed book|{{PENDING}}|Concept|Delivery model TBD|

---

## CURRENT STATE

**What works:**

- ✅ Two strong book concepts defined (Mythologized Journey + Uber Stories)
- ✅ Narrative philosophy clear — real experiences as mythology, not literal autobiography
- ✅ Strategic role in Pyadra confirmed — lowest-friction emotional product
- ✅ Type 2 model defined — external platform + exclusive Pyadra product

**What's missing:**

- ❌ Sales model defined (what exactly is sold on Pyadra vs external)
- ❌ First manuscript started
- ❌ Book title and identity
- ❌ Cover design
- ❌ External platform chosen (Amazon KDP / Gumroad / other)
- ❌ Pyadra internal product defined (what makes the Pyadra version exclusive)
- ❌ Price defined
- ❌ Publishing workflow
- ❌ Galaxy dashboard card built
- ❌ First reader

**Active blockers:**

- 🔴 **Sales model undefined** — blocks everything else. What does Pyadra sell that Amazon doesn't?
- 🔴 **No manuscript** — no product exists yet
- 🟡 **No publishing workflow** — cover, formatting, distribution all TBD

---

## OPEN QUESTIONS

**Technical:**

- External platform: Amazon KDP, Gumroad, own site, or all three?
- How is the Pyadra exclusive product delivered — PDF download, credential, physical shipment?
- If physical book — print-on-demand (Amazon KDP) or self-print and ship?

**Business:**

- What makes the Pyadra version worth buying vs getting it on Amazon?
    - Option A: Pyadra only (Amazon gets excerpt)
    - Option B: Early access on Pyadra, full release on Amazon later
    - Option C: Collectible edition on Pyadra (illustrated, annotated, special)
- Price: digital $9–15 AUD / physical $29–49 AUD?
- Can author rights be protected while selling through Pyadra's Phase 2 acquisition model?

**Product:**

- Which book concept first — Mythologized Journey or Uber Stories?
- Writing timeline — realistic estimate to finish first manuscript?
- Illustrated version — commission artist or AI-assisted?
- Audio narration — future possibility?

---

## DECISIONS LOG

|Date|Decision|Reason|
|---|---|---|
|May 2026|Type 2 — External + Internal Product|Book lives on Amazon/external. Pyadra has exclusive product. Author retains all IP rights.|
|May 2026|Forming status|No manuscript, no sales model, no platform. Honest state.|
|May 2026|Two book concepts prioritized|Mythologized Journey + Uber Stories — strongest emotional concepts so far.|

---

## THE QUESTION THAT DEFINES EVERYTHING

> Does the user feel that what they left behind matters?

**Honest answer today:** Not yet — because nothing exists to read yet. But the potential is clear: a story about migration, loneliness, and transformation is exactly the kind of thing that stays with people. A reader who finishes the Uber Stories collection will feel that those encounters — those real human moments — mattered enough to be preserved. That is the answer, once the writing begins.

---

## ASSET VALUE

_For potential buyers and participants. Answers: what can they get involved in, how, and what do they receive._

**Maturity level:** Idea — two strong concepts, no manuscript, no commercial operation.

**What a participant or buyer acquires:**

|Category|Assets included|
|---|---|
|Technical|{{PENDING — publishing workflow, delivery system, platform accounts}}|
|Brand|{{PENDING — book title, cover, visual identity}} + narrative positioning inside Pyadra ecosystem|
|Product|Two developed book concepts, narrative philosophy, emotional positioning, author's real experiences as source material|
|Operational|{{PENDING — once publishing workflow exists}}|

**Participation models:** _Pyadra supports different levels of involvement — from reader to publishing partner._

**Important:** Author IP rights (copyright) are never transferred in any model. What is acquired is revenue participation and operational rights — not ownership of the stories themselves.

|Model|Description|Investment range|Status|
|---|---|---|---|
|Reader|Buys the book. No ownership.|{{PENDING — book price}}|Planned (once manuscript exists)|
|Early supporter|Pays for early access on Pyadra while book is being written. Receives permanent credential.|{{PENDING}}|Planned|
|Publishing partner|Funds production (editing, design, marketing) in exchange for % of revenue. Author retains full IP.|TBD — requires legal review|Planned (Phase 2)|
|Partial acquisition|Buys % of the publishing operation (not the IP). Revenue share on book sales.|TBD — requires legal review|Planned (Phase 2)|

**How a participant or buyer makes money:**

|Revenue stream|Current state|Potential|
|---|---|---|
|Book sales — digital|Not active|At 100 copies/month × $12 AUD = $1,200 AUD/month|
|Book sales — physical|Not active|Higher price point, lower volume|
|Pyadra exclusive editions|Not active|Premium pricing — illustrated, annotated, collectible|
|Audio narration|Concept only|Expanding audience beyond readers|
|Future book series|Concept only|Recurring revenue per book released|

**Post-participation structure:**

- Participant / buyer receives: agreed % of book revenue (not IP ownership)
- Original creator retains: full copyright and IP of all stories — always, permanently
- Pyadra receives: transaction fee on acquisition + ecosystem display integration

**What must happen before this project can be sold or partially acquired:**

- [ ] Sales model defined (what Pyadra sells vs external platforms)
- [ ] First manuscript completed
- [ ] Publishing workflow operational (cover, formatting, distribution)
- [ ] First reader and first sale confirmed
- [ ] Legal review (ASIC + IP protection structure)

---

## ROADMAP

**Now (Q3 2026):**

- [ ] Define sales model — what makes the Pyadra version exclusive
- [ ] Choose which book to write first (Mythologized Journey or Uber Stories)
- [ ] Begin writing first manuscript
- [ ] Choose external platform (Amazon KDP / Gumroad)

**Next (Q4 2026):**

- [ ] Complete first manuscript
- [ ] Design cover and book identity
- [ ] Publish on external platform
- [ ] Launch Pyadra exclusive edition
- [ ] Build Galaxy dashboard card
- [ ] First sale confirmed

**Future (no fixed date):**

- [ ] Second book (whichever concept wasn't first)
- [ ] Illustrated edition
- [ ] Audio narration
- [ ] Physical printed book (print-on-demand or self-print)
- [ ] Early supporter credential system (like Orbit 77 model)
- [ ] Publishing partner or partial acquisition (Phase 2)

---

## RELATED LINKS

**Documentation:**

- [[VISION]]
- [[ROADMAP]]

**External:**

- External platform: {{PENDING}}
- Book cover design: {{PENDING}}

**Writing tools:**

- {{PENDING}}

**Sibling projects in Galaxy:**

- [[ETHERNICAPSULE]] — Time-locked cryptographic messages
- [[ORBIT77]] — Podcast + supporter funding
- [[Figuitoon]] — Physical collectible figurines

---

_END · EBOOKS · v1.0_