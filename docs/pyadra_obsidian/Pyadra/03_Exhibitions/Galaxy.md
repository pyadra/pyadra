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

> [!note] EterniCapsule proof line — fixed September 22, 2026 `Hosted on Pyadra` stopped being accurate when the product moved to its own deployment (eternicapsule.com, August 26, 2026; Pyadra's copy retired September 15). The v4.1 changelog below recorded the replacement, but it had only been made in this doc — `page.tsx` kept the old line until September 22, when the code was finally changed. Note the product still uses accounts Pyadra controls, which is why the owner is reviewing what "hosted" means in the deal options ([[EterniCapsule]]). Pending a deploy.

> [!warning] Proof lines carry numbers The `10 episodes` and `500+ jobs · 5.0` figures must match each project's canonical metrics ([[Orbit77]] metrics, [[Kangaroo_Cleanup]] METRICS AND NUMBERS). They are hardcoded in two places — this page and the project rows of the founder's room (`src/app/eduardo/page.tsx`). If a number changes, update both in the same commit.

> [!note] EterniCapsule subtitle says "Encrypted time capsules" Acceptable as shorthand for the key-locked seal, but see the truth correction in [[EterniCapsule]] — no in-browser encryption exists yet. When client-side AES ships this subtitle becomes fully literal.

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

_END · GALAXY · v4.3 · September 22, 2026_
