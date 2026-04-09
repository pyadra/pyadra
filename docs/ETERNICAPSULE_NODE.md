# Project Node: EterniCapsule

> **Context for AI Agents**: This document outlines the physical and digital architecture of "EterniCapsule", a time-locked message vault built to function as a ceremonial digital artifact instead of a standard web app.

## The Aesthetic Standard
EterniCapsule defines the absolute standard for Pyadra's **"Level 10 Ritualistic UX"**. 
- Follows the strict **Midnight Obsidian** aesthetic (`#02040A` backgrounds, glassmorphism UI tiles, gold/amber core elements).
- Typography relies heavily on `Cormorant` italics for emotional weight (Titles), `Sans-Serif` for readability (Body), and `Mono` for system state outputs.
- Contains the `AudioEngine` (`src/app/exhibitions/galaxy/ethernicapsule/lib/audio.ts`) providing crystalline sonic feedback (ticks, chimes, lithic clicks) perfectly synced to DOM states.

## Core Architecture & State

### 1. Narrative Stepper Flow
- The composition is NOT a single vertical form. It utilizes a 4-act sequential setup built on `framer-motion`:
   - *Act I:* The Recipient
   - *Act II:* The Message (Compose)
   - *Act III:* The Timing (Time Vault vs Guardian Keys)
   - *Act IV:* The Seal (Decryption/Checkout)

### 2. The Cryptography (Supabase)
- Table: `ethernicapsule_capsules`
- Operates on strict hashing. When a user creates a message, a unique Sender Key and a Capsule Key are generated locally in the browser. 
- Only the SHA-256 hashes of these keys are uploaded to Supabase. Thus, Pyadra retains zero ability to open the capsules itself (Zero-Knowledge proof).
- Handled reliably via Next.js Hydration-safe State. (Dates and math bounds are strictly deferred to `useEffect` inside `page.tsx` to prevent React Hydration Mismatches between Server and Client rendering).

### 3. Decryption Theatre (`/unlock` & `/letter/[id]`)
- When unlocking, the user inputs the raw key. If the hash matches the DB, the letter is passed.
- The reading mode features a **Cinematic Blur-to-Focus** transition. It forces the reader into a black screen, slowly resolving the text through opacity and blur filters. This establishes the solemn permanence of the message.

## For Where We Are Going (Future Trajectory)
1. **Interactive 3D Heartbeat**: Moving beyond passive WebGL; using `useFrame` inside the `Capsule3D.tsx` to make the amber monolith physically pulse in real-time correlation with the user typing their message. 
2. **Facturas Negras de Lujo (Ultra-Premium HTML Receipts)**: Overhauling the current generic transactional emails via `Resend`. The emails must feel like digital artifacts wrapped in obsidian formatting, matching the front-end identically.
3. **Advanced Time Vaults**: Introducing the capability to lock not just text, but nested WebGL memories or localized soundscapes.
