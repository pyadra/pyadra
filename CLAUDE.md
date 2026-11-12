# Pyadra — working notes for Claude Code

Read this first, in any session, on any machine. It carries what is not obvious
from the code, so a session that starts cold (terminal, web, phone) can work
without re-deriving it.

## What Pyadra is

Pyadra creates, develops and collaborates to turn ideas into real projects, then
looks for the people who will **acquire, operate, support, work on or carry them
forward**. The museum — exhibitions, rooms, the shop, the Observer ticket — is
the experience layer, not the business definition. Tagline: *Discover. Connect.
Build. Buy.* Founding motto: *Lo que dejas importa*.

Canonical sources, in this order:
1. `docs/pyadra_obsidian/Pyadra/01_Company/Company_Master.md` — operational
   truth: §0 evidence labels, §1 definition, §4 project types, §6 the Project
   Standard, §7 the exhibition system, §15 non-negotiable rules.
2. Each project's document in `docs/pyadra_obsidian/Pyadra/04_Projects/`.
3. `VISION.md` — philosophy and how the idea evolved.

## The map

```
/                          home — radically minimal by owner request:
                           symbol + PYADRA + tagline + "Join". Don't add copy.
/exhibitions               the hall: Galaxy open, Jungle and City sealed
/exhibitions/galaxy        the orbital field — spheres + central gem → /store
/exhibitions/galaxy/<slug> project dashboards (the "acquisition dossier")
/store                     the museum shop (never an exhibition — rule #11)
/team, /team/<who>         the team's digital business cards
/eduardo                   redirects to /team — a printed QR points here.
                           Never delete it.
/manifesto, /legal/*       light museum pages
```

Project pages live at `src/app/exhibitions/galaxy/<slug>/{layout,page}.tsx`.
Old `/projects/*` and `/ethernicapsule` URLs redirect from `src/middleware.ts`.

## Rules that bite in code

From Company_Master §15. These are not style preferences:

- **#2** A project is not exhibited until its Project Standard document exists
  (`04_Projects/Project_Standard_Template.md`).
- **#4** No generic e-commerce language anywhere: no "buy now", "add to cart",
  "checkout", "shop".
- **#13** The page never claims what the code doesn't do. The day a gap is
  found, the copy is corrected the same day. Honest copy is corrected *up* when
  the feature ships, never the other way.
- **#12** Black is not a Pyadra colour. Smoke gray `#EDEFED` is the background;
  emerald `#059669` is the accent. Dark belongs inside a project that chose it.
- **Copy deck first.** Visible strings are written in the project's COPY DECK
  before they are built. Builders copy them verbatim and never improvise copy
  in code. If the deck and the live page disagree, the deck is updated to the
  live string the same day — unless the live string is false, and then the
  page is fixed instead.
- **One canonical number.** A figure lives in one place. The Galaxy sphere
  proof lines live in Galaxy's `PROJECTS` array — the only hardcoded copy,
  since the founder's room moved to `/team` and no longer lists per-project
  numbers. If a number changes, update it there in the same commit, with the
  project document.
- Numbers that change without a deploy belong in the `pyadra_settings` table,
  read with `getSetting(key, fallback)`.
- `pyadra@pyadra.io` is the only real inbox. Never a personal address.
  (Byndi has its own, the one agreed exception.)

## Before you push

```bash
npm run verify      # tsc + vitest + next build + smoke. No lint in it.
```

- **`main` auto-deploys.** Nothing lands on the site any other way.
- New routes must be added to `scripts/smoke.mjs` or they are never checked.
- `src/app/template.tsx` dissolves for ~1.5s on every navigation. Entrance
  choreography must wait for it — that is the `ENTER = 0.75` constant on the
  pages. Animate earlier and the visitor sees nothing.
- `public/images/kangaroo` contains AI mockups with incorrect branding among
  the real photos. They are not evidence and must never be presented as proof.

## Current state — October 20, 2026

**Live:** commit `5b59eb2`, the September audit — the truth corrections
(EterniCapsule's proof line, "key-locked", Orbit as Glocal, Observer numbers no
longer invented, the privacy page) plus the reconciled documentation.

**Open proposal — the house (branch `rethink/exhibition-of-one`, November 12,
2026).** A second opinion the owner asked for: Pyadra sells what its projects
*make*, as "an exhibition of one" (a small museum room made for one person:
a song, a sealed letter, a figurine), and people who bring it to others
("carriers") keep a share with nothing to pay. On that branch `/` is the house,
the earlier Home lives at `/museum`, `/for/<slug>` is a room, and every price,
share and string sits in `src/app/house/house.ts`. None of it is an owner
decision. Migration `0009` is written and **not applied**. A real room is never
committed: this repository is public. The case and the copy deck:
`02_Strategy/Exhibition_Of_One.md`. Do not merge to `main` until the owners
confirm the offer.

**In progress — Galaxy v5, the orbit as an instrument** (branch
`feat/galaxy-orbit-instrument`, local, October 26, 2026). Supersedes the 3 · 2 · 2
grid below: one canvas with four zooms from the Home to the dossier, positions
computed from `galaxy/lots.ts`. What it is and what blocks it: the v5 section of
`03_Exhibitions/Galaxy.md`.

**Type and colour — one voice (October 27, 2026).** New UI composes
`src/app/components/ui/type.ts` (six sizes: names in Fraunces, labels in Plex
Mono uppercase, the rest in DM Sans) and the palette names in `globals.css`
(`text-ink`, `text-ink-soft`, `text-ink-mute`, `bg-paper`, `text-accent`,
`text-accent-deep`). Don't write a new `text-[Npx]` or a raw museum hex.
Motion the same way: curves and springs from `components/ui/motion.ts`;
surfaces that answer the pointer use `.py-spot` / `.py-sheen` / `.py-glass`
(globals.css). Background motion is CSS only — never JS-animated particles.

**Project dashboards — one template (October 27, 2026).** Every project page is `galaxy/[project]` rendering `room/ProjectDashboard.tsx` from `lots.ts` (what Galaxy also shows) and `rooms.ts` (what only the dashboard shows). A new project is a row in each, not a new page. Numbers say where they come from and read live through `live.ts`. Prices in `rooms.ts` are owner estimates until he sends the real ones.

**Earlier — Galaxy with seven projects.** The field grows from four spheres
to seven: rows of 3 · 2 · 2 on desktop, the gem keeping the empty centre of the
middle row; two per row on phones with the seventh centred. Built and
typechecked, not committed. It is blocked on content, not on code: Byndi,
Momentos Inolvidables and the gym app each still need three true strings
(subtitle, proof, opportunity) taken from their own live sites, plus a
destination — their Pyadra page or their own URL. Until then they render with
provisional copy and no link, which must not be deployed. Shipping it also means
updating `/team`'s three `soon-*` rows and Galaxy's copy deck in the same commit.

**Pending:** a critical Next.js advisory (middleware/proxy bypass in App Router)
against the installed 16.2.10, with a fix available — the middleware does the
rate limiting and the redirects. Draft PR #1 from Vercel is stale, based on a
`main` from March; it should be closed rather than merged.

**Note:** this repository is public, and `docs/pyadra_obsidian/` has been
tracked in it since May 2026 — including deal terms, revenue figures and the
due-diligence checklists those documents describe as private.
