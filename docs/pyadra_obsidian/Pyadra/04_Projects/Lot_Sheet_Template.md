# Lot Sheet — Template

> [!info] What this is
> The **lot sheet** is what a visitor reads about a project **in Galaxy, before opening its dossier** — the panel that opens when they click a sphere. Every project shows the **same fields in the same order**, so visitors can compare them and know what they'd be taking.
> Fill one copy per project and hand it over; it goes into `src/app/exhibitions/galaxy/lots.ts` as written. Leave a field empty if you don't have it yet — the live site hides empty fields, it never invents them.
> Created October 27, 2026 · Galaxy v5 (branch `feat/galaxy-orbit-instrument`). The full project story stays in the project's own Project Standard doc ([[Project_Standard_Template]]).

> [!tip] Three steps, each showing a little more
> **Hover** a sphere → the **hook**: kind, hook line, price, opportunity.
> **Click** → the **dashboard**: name, hook, opportunity, price · format · stage, up to 3 numbers (or 3 included items), ideal for.
> **Open the dossier** → everything: summary, all that's included, handover, proof, risks.
> The note in italics after a field name says where it shows up.

---

## Project: `NAME`

### On the orbit (always visible)

| Field | Fill in | Rules |
|---|---|---|
| **Name** | | As the brand writes it. |
| **Hook** | | **The one line that makes someone want to look closer.** ≤ 80 characters. Shown on hover, said by the guide, first on the dashboard. Until it's written, the subtitle stands in. |
| **Scope** | | `Global` · `Glocal` · `Local` |
| **Kind** | | One or two words — e.g. `Mobile app`, `Physical product`, `Local business`. |
| **Subtitle** | | What it is, one line, ≤ 50 characters. |
| **Opportunity** | | The line under the name — e.g. `Available to acquire`, `Looking for a partner`, `Open for support`. |
| **Way in** | | `acquire` (buy it) · `operate` (run it) · `support` (back it) · `build` (build it with Pyadra) |
| **Stage** | | `ready` (inner ring) · `forming` (outer ring) |

### Key facts (top of the sheet)

| Field | Fill in | Rules |
|---|---|---|
| **Asking price** *(hover · dashboard)* | | As it should read, e.g. `AUD $4,000`. **Leave empty to show "On request".** ⚠ Showing a price in Galaxy is an owner decision — see the note below. |
| **Price note** | | Optional, one short line — e.g. `Negotiable`, `Plus revenue share`. |
| **Formats** *(dashboard)* | | What the buyer gets, as formats — e.g. `Mobile app · Website`. 1–3. |

### The sheet

| Field | Fill in | Rules |
|---|---|---|
| **What it is** *(dossier)* | | Two sentences a stranger understands. ≤ 220 characters. |
| **What's included** *(dashboard, top 3 if no numbers · dossier)* | | What transfers to whoever takes it. **3 to 6 items**, each ≤ 60 characters. |
| **Ideal for** *(dashboard)* | | Who it suits. **2 or 3 profiles**, each ≤ 35 characters — e.g. `A first-time founder`. |
| **In numbers** *(dashboard)* | | **2 or 3 verifiable numbers**: value + label — e.g. `500+` · `jobs done`. Must match the project doc's canonical metrics. |
| **You put in** | | What the person contributes, one line — money, work, skills. |
| **You take away** | | What they receive, one line. |
| **Handover** *(dossier)* | | How the takeover works, one line — e.g. `Two weeks, guided`. |
| **Proof** | | What anyone can verify today, one line. |
| **See it live** | | Link label + URL, if the product is public. |
| **Dossier** | | Its Pyadra page, or its own site. |

### Assets

| Field | Fill in | Rules |
|---|---|---|
| **Logo** | | PNG with transparent background, square. |
| **Sphere colour** | | One colour the brand owns (hex). |

---

> [!warning] Before a price shows in Galaxy
> [[Company_Master]] §7 says spheres never show valuation figures — "value narratives live on the project page only". The lot sheet sits in Galaxy, so a filled **Asking price** changes that rule. Decide it once for all projects; until then, leave it empty and every sheet reads "On request".

> [!tip] Preview before you send
> On the local site, `/exhibitions/galaxy?lot=<id>&sample=1` shows a sheet filled with sample text, so you can see how a finished one looks. Without `sample=1`, empty fields show as marked slots ("To complete · …") — only locally, never on the live site.
