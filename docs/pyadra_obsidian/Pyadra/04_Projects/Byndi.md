---
tags: [pyadra, project, byndi, mobile-app]
created: 2026-09-19
version: 0.2
status: in-testing
updated: 2026-09-22
---

# Byndi

_Project record · Pyadra · Last updated: September 22, 2026 — v0.2_

> [!important] What this document is — and why it is short
> The first Pyadra-side record of Byndi. It collects what could be **verified** on September 19, 2026 and marks everything else as open. It is **not** a completed Project Standard document (Byndi is not exhibited), and it does not replace the technical docs inside Byndi's own repo. Evidence labels follow [[Company_Master]] §0.
>
> **Owner decision (September 22, 2026): this stays light for now.** There is little documentation beyond what the app does, and writing the full Project Standard can wait. Keep recording what is true; don't fill the gaps with guesses.

---

## IDENTITY

**Name:** Byndi (written BYNDI in owner communications; the app's display name is `Byndi`)
**What it is:** a mobile app for someone in a couple to understand their partner's menstrual cycle — what she is likely feeling each day and concrete ways to help.
**In-app tagline (Implemented):** `Understand her cycle. Care for the relationship.` · Spanish: `Entiende su ciclo. Cuida la relación.`
**Status:** In testing — owner statement, September 19, 2026.
**Contact address:** `byndy@pyadra.io` (owner, September 22, 2026) — Byndi's own inbox, the one agreed exception to Pyadra's single-inbox rule. ⚠ The spelling the owner gave is `byndy`, while the product is `Byndi`; confirm which is correct before it is printed in the app, the stores or the legal pages. Whether the mailbox exists was not verified.
**Developer (per its draft legal pages):** Pyadra. **Founder / person shown publicly:** not defined.
**Type (scope):** not assigned. By the [[Company_Master]] §4 definitions it would be GLOBAL (digital, no physical component) — a proposal, not a decision.
**Pyadra relation:** separate product, not on pyadra.io. **Exhibition:** none — not exhibited.

---

## STATUS AND EVIDENCE

|Claim|Label|Evidence|
|---|---|---|
|App is built; development closed|Implemented|Repo `LAUNCH_PLAN.md`, updated July 29, 2026 ("Estado: desarrollo cerrado"); last commit `260f785` (July 29, 2026)|
|In testing|Owner decision / statement|Eduardo, September 19, 2026|
|Tested on a real device|Unverified|The launch plan says the build still had to be tested on a phone; no later record found|
|Android build prepared again|Unverified|Working copy has an uncommitted `versionCode` bump from 1 to 2 in `app.json`|
|Published on Google Play or the App Store|Unverified|Store listing graphics exist on the owner's machine (icon 512 px, feature graphic); no evidence of submission or of a testing track|
|Paid subscriptions live|No — Implemented as "Coming soon"|Paywall shows prices but the purchase is disabled; "Plus" is a local demo flag (`src/premium.js`)|
|Privacy policy and terms published|Unverified|Drafts dated July 28, 2026 in `legal/`; the public URLs are configured through env vars that were not inspected|
|Crash reporting and analytics active|Implemented, activation unverified|Sentry and PostHog are wired in `src/monitoring.js` and switch off when their keys are empty; keys were not inspected|
|Marketing prepared|Unverified|A content-plan spreadsheet (items 001–050) and a marketing video (August 4, 2026) exist on the owner's machine; publication not checked|

---

## WHAT THE CODE DOES (Implemented — per the repo, not tested on a device in this audit)

- Onboarding with a language choice (English default, Spanish)
- Cycle calendar and current-phase prediction; a guide to the five phases (free)
- SOS mode for six difficult situations (one free, the rest Plus)
- Daily mission and streak; ready-to-send messages; an "idea of the day" with a rotation engine
- Local notifications before each phase change (scheduled on the device)
- Journal (daily note free, full history Plus) and cycle insights (basic free, averages and trends Plus)
- Multiple profiles (first free, more with Plus)
- Backup: export and restore as a file

**Data:** cycle data is stored only on the device (local storage). No own servers receive it. Sentry (error reports) and PostHog (anonymous usage events) receive technical data only, per the draft privacy policy.

---

## PRICING (as shown in the app — not charging)

|Product|Price shown in the paywall|State|
|---|---|---|
|Byndi (base)|Free|Implemented|
|Byndi Plus — monthly|€1.99 / month|Shown; purchase disabled ("Coming soon")|
|Byndi Plus — annual|€14.99 / year|Shown; purchase disabled ("Coming soon")|

The launch plan names RevenueCat as the intended payment layer "when you want real payments". Store commissions (15–30%) would apply. These are the prices in the code; no Pyadra decision about them is recorded beyond that.

---

## TECHNICAL POINTERS

- **Repo:** a local git repository on the owner's machine, folder `APP_Mobile_Couples_Check` (historical folder name), package `byndi`. Five commits, July 3–29, 2026. ⚠ **No git remote is configured** — the code may exist only on that machine.
- **Stack:** Expo SDK 57 / React Native 0.86, EAS builds (account owner `pyadra`), bundle ID `com.pyadra.byndi` (iOS and Android).
- **Docs inside that repo:** `LAUNCH_PLAN.md` (current, Spanish). ⚠ Its `README.md` still describes the app under an earlier name ("LunApp") and says "no servers, no internet", which predates Sentry/PostHog. Not edited in this audit (outside the Pyadra repo).

---

## RELATIONSHIP TO PYADRA

- Pyadra is named as the developer in the draft legal pages and in the app footer (`Byndi by Pyadra · v1.0`).
- Not shown on pyadra.io. The founder's room (`/eduardo`) lists a `Mobile app` as `Coming soon · In documentation` — it is not confirmed whether that row means Byndi.
- No participation option (acquire, operate, support, work on, carry forward) is defined for Byndi.

---

## OPEN QUESTIONS (owner)

- [ ] Is Byndi meant to be exhibited on Pyadra (Galaxy or another exhibition), and when?
- [ ] Is the `/eduardo` "Mobile app" row Byndi? If yes, update it so it doesn't understate the stage (the team business cards are in development anyway).
- [x] Contact address — decided September 22, 2026: `byndy@pyadra.io` (see IDENTITY). Still to do: replace the personal Gmail in `legal/privacy-policy.html` and `legal/terms.html` in the Byndi repo, and confirm the `byndy`/`Byndi` spelling.
- [ ] Where will the privacy policy and terms be hosted?
- [ ] Add a git remote or backup for the repo.
- [ ] Confirm the name "Byndi" (domain and trademark) — listed as pending in the launch plan.
- [ ] The app handles health-related data about a third person. Should its privacy policy and store declarations get a legal review before publishing?
- [ ] What participation, if any, Pyadra offers around Byndi, and who is its founder of record.

---

## PROJECT STANDARD COMPLETENESS

Not yet written: context and history, design system, metrics, assets, proof of work, operation, risks, participation options, due diligence, sale copy, copy deck. Required before Byndi is exhibited ([[Company_Master]] non-negotiable #2). Use [[Project_Standard_Template]].

---

## RELATED LINKS

- [[Company_Master]] — read before working with this project
- [[Project_Standard_Template]] — what a full project document needs
- Sibling projects: [[Orbit77]] · [[EterniCapsule]] · [[Figuitoon]] · [[Kangaroo_Cleanup]]

---

> [!note] Changelog v0.2 (September 22, 2026) — Owner decisions: Byndi's contact address is `byndy@pyadra.io` (spelling to confirm), and this document deliberately stays light until there is more to record.

> [!note] Changelog v0.1 (September 19, 2026) — First record, created during the documentation audit. Built only from the Byndi repo (code, `app.json`, `LAUNCH_PLAN.md`, draft legal pages), file names on the owner's machine, and the owner's statement that Byndi is in testing. Nothing about store status, users, revenue or ownership is asserted.

_END · BYNDI · v0.2_
