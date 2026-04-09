# Project Node: Orbit 77

> **Context for AI Agents**: This document outlines the "Orbit 77" node inside Pyadra. It is a podcast and archival platform revolving around liminal spaces, deep knowledge, and a supporter-funded identity ecosystem. 

## The Aesthetic Standard
Orbit 77 operates on a high-tension, somewhat brutalist, space-transmission visual language.
- It is heavily textured, invoking a sense of listening to a restricted transmission deep in orbit.
- Colors: Deep void blacks, stark whites, and high-contrast alert tones.
- Typography: Predominantly monospaced fonts (Courier, Jetbrains) simulating terminal output.
- Feel: Secure, encrypted, exclusive access.

## Core Architecture & State

### 1. Supporter Identity (Supabase)
Unlike standard checkout flows, Orbit 77 maps every Stripe donation strictly back to a persistent identity.
- Table: `orbit_supporters` (Holds uniquely generated IDs tied to the Supporter's Email).
- Table: `orbit_support_credentials` (Records the specific Stripe session transaction, amount, and generating an esoteric `O77-S1-XXXXXX` credential code).

### 2. The Archive Access (`/archive/[id]`)
- Users use their persistent Supporter ID to access the archive. By entering their ID, they are granted access to all private podcast episodes and content they have funded.
- This portal intentionally feels like entering a secured military or private research terminal.

### 3. API & Webhook Hardening
- `/api/donate`: Forwards to Stripe with dynamic donation amounts.
- Webhook (`src/app/api/stripe/webhook/route.ts`): Uses `project_id: "orbit-77"` to trigger resilient `upsert` queries to Supabase. This guarantees idempotent, race-condition-free creation of the `orbit_supporters` identity even if the webhook fires simultaneously.

## For Where We Are Going (Future Trajectory)
1. **Deeper Archival Expansion**: Evolving the `/archive/[id]` page from a simple list into an interactive, multi-layered "database" of artifacts.
2. **Audio/Video Integration**: Hosting custom video/audio players built within the codebase that match the terminal aesthetic, refusing to rely on generic YouTube embeds.
3. **Seasons**: Transitioning the DB into Season 2 support, where users accumulate historical credentials ("O77-S2") to level up their Supporter Access tier continuously.
