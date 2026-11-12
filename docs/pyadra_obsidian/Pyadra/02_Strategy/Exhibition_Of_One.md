---
tags: [pyadra, strategy, proposal, house]
created: 2026-11-12
status: open proposal
branch: rethink/exhibition-of-one
---

# The house — an exhibition of one

_Strategy proposal · Pyadra · November 12, 2026_

> [!warning] Open proposal, not an owner decision
> Everything here and on the branch `rethink/exhibition-of-one` is an **Open proposal** (Company_Master §0). The owner asked for a second opinion on how to get value from the projects Pyadra has already built. Every price, share, day count and promise was proposed to make the idea concrete, and none is agreed. Company_Master §10 says the Pyadra/creator split is not to be designed without a real case and legal review: the shares below are a starting point for that conversation, not terms. Nothing merges to `main` until the owners confirm or replace each figure.
>
> The full analysis behind this (the audit of the live products, the numbers and the sources) was delivered privately to the owners and is deliberately not in this public repository.

---

## The idea in one paragraph

Pyadra stops offering its projects to people who would have to pay to run them, and sells **what the projects make**. Three of them become workshops, and what they make hangs together in a small museum room made for one person: **an exhibition of one**. The person receives an admission ticket and walks in. The museum layer Pyadra already built is the wrapping. People who bring it to others, **carriers**, pay nothing to come in and keep a share of every piece. New projects arrive as new workshops. The projects stay with Pyadra, and the numbers are shown in an **open book**.

## What changes

| | Before | On this branch |
|---|---|---|
| What is offered | A project, to acquire or operate | A piece made for one person |
| Who pays | A buyer or operator, after a conversation | The person giving the gift, a small amount, now |
| Way into a project | An upfront price on every door | Carrying it: no price, a share of what you bring |
| The museum | The way projects are presented | The wrapping of the gift |
| New projects | "Bring your idea" | "Open a workshop": bring something that belongs in a room |
| The numbers | In the project documents | On a public page, with their sources |

## Why (the evidence that can be public)

- **Built projects without revenue have almost no market.** They typically sell for US$500–15,000, and what the buyer values is existing users. On Acquire.com the median listing asks about 2.0× trailing revenue.
- **Building is no longer scarce.** About 560,000 new apps reached the App Store in the first half of 2026 while downloads grew about 2%; one analysis counts 0.02% of them reaching high traction.
- **Made-for-one gifts are a large market that AI is making cheap.** Personalised gifts are estimated at US$33–37 billion in 2026. In a 2026 holiday survey, 54% of gift givers named "meaningful or personal" as their first goal. But each single format is already a commodity: AI songs from €3.95, couple pages with a QR code from R$19.90, photo figurines from US$26. What stays valuable is the set, the ceremony of giving it, a person checking it, and trust.
- **These things sell through people.** Florists already sell QR message cards as an add-on. Curated houses of small makers take a share per sale and work at scale (Not On The High Street: 25% and a joining fee; hardtofind in Australia: free to join, commission per sale).
- **Agents help run, not sell.** Documented results are partial automation inside businesses people run. That fits the studio work of the song workshop. It does not find customers.

## The offer (proposal)

Source of every figure and string: `src/app/house/house.ts`.

| Piece | Workshop | Price (AUD) | Time |
|---|---|---|---|
| The letter | EterniCapsule | 9 | Sealed the same day |
| The song | Momentos Eternos | 39 | 48 hours |
| The figurine | Figuitoon | 49 + postage | Three weeks, a few each month |
| Song and letter | | 45 | |
| All three | | 89 | |
| The room | | On the house | |

**The split of each piece:** 55% the workshop that makes it, 20% the carrier who brought it, 25% the house. With no carrier, that share stays with the house and pays for finding people.

**Carrying the other projects:** Kangaroo Cleanup, a Sydney crew takes the jobs with no entry price and keeps 85%. WEMAIT, a share of a coach's plan once plans switch on. URELIT and Byndi, nothing to share yet, and the page says so.

## What is on the branch

| Route | What it is |
|---|---|
| `/` | The house |
| `/for/la-doctora` | The sample room, built from the workshops' own examples and labelled as a sample |
| `/for/<slug>` | A real room, read from `pyadra_exhibitions` (migration `0009`, **not applied**) |
| `/commission` | The commission. It takes no payment: it reaches `pyadra@pyadra.io` and a person answers |
| `/carry` | The carriers, and the door to open a workshop |
| `/ledger` | The open book |
| `/museum` | The earlier Home, kept whole |

Rules the code keeps:

- **A sealed letter's words never leave the server before its day** (`house/exhibition.ts` → `seal`, tested).
- **A real room is never written into this repository.** It is public; a room is private. Rooms are rows written by hand in Supabase.
- A carrier's code travels on the link (`?via=`), is kept for the visit only, with no cookie, and is written on the commission.
- The Privacy page describes what a commission collects (rule #14).

Not built, on purpose: online payment, an admin screen for making rooms, a QR code on the ticket. The first rooms are made by hand.

To drop all of it: `git checkout feat/galaxy-orbit-instrument && git branch -D rethink/exhibition-of-one`.

## To decide before this goes anywhere

1. The prices and the day counts, above all the song at A$39 in 48 hours.
2. The 55 / 20 / 25 split, with Cristian, whose projects carry their own royalty model today.
3. The currency (AUD here; Momentos Eternos charges in USD).
4. Who answers the inbox within one working day.
5. The remake-then-refund promise.
6. Kangaroo Cleanup carried at 85 / 15 with no entry price.
7. Where the song files are kept (the sample plays from the instrument provider's address).

## How to know it works

Cheaply and with a date. By February 14, 2027, after asking at least 40 people directly and with 5 active carriers: fewer than 15 paid rooms means the gift wedge is wrong.

## Copy deck

The visible strings are written in `src/app/house/house.ts` and rendered verbatim: `HOME`, `PIECES`, `SETS`, `ROOM`, `STEPS`, `PLAIN`, `CARRY`, `CARRY_STEPS`, `CARRY_SUITS`, `CARRY_OFFERS`, `WORKSHOP_DOOR`, `LEDGER`, `FAQ`. `house.test.ts` checks them against the house rules: no banned words (#4), no dashes, no claimed reviews or popularity, and a split that adds to one hundred.

Strings that live in the pages:

- Home: `Three workshops, one room.` · `Five minutes from you. The rest is ours.` · `What you should know before you give one.` · `Who would you make one for?`
- The room: `Admit one` · `Sealed until` · `days to go` · `The room will not show these words before that day.` · `This wall has room` · `This room was made by` · `Make one for someone`
- Commission: `Tell us about them.` · `The name on the wall` · `Send it to the house` · `We have it.`
- Carry: `You bring people. The workshops do the rest.` · `Anyone people already listen to.` · `What there is to carry today.` · `Tell us who you would bring it to.`
- Dashboards: `Or carry it, with nothing to pay`
