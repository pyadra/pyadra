# Pyadra Home Experience

> **Context for AI Agents**: This document defines the home page experience at `/` - the first point of contact with Pyadra. It establishes the ritual of "becoming an Observer" through an interactive signal-detection game, then archives each completion with a unique signature.

## Current State (April 2026)

### The Core Experience

The home page is **NOT a landing page** - it's an initiation ritual. Users must actively participate in a signal-detection game before entering Pyadra.

**Flow:**
1. User arrives → Assigned Observer ID (auto-increment from Supabase `observers` table)
2. Interactive particle field appears (ParticleDecoder component)
3. User taps/clicks to send "pulses" that reveal 6 hidden signals
4. Upon completion → Signature generated + saved to database
5. Completion screen shows signature, global stats, and entry to projects

### Technical Implementation

**Database Schema:**
- `observers` table: SERIAL id, ip_address, user_agent, first_visit timestamp
- `home_scans` table: completion records with unique signatures

**Signature Format:**
```
#0001-0048-42-040626-180626
 ^^^^ ^^^^ ^^ ^^^^^^ ^^^^^^
  |     |   |    |      └─ Time (HHMMSS)
  |     |   |    └──────── Date (MMDDYY)
  |     |   └───────────── Pulses sent
  |     └───────────────── Time elapsed (seconds)
  └─────────────────────── Observer ID
```

**Key Files:**
- `/src/app/page.tsx` - Main home page component
- `/src/app/components/ParticleDecoder.tsx` - Interactive game
- `/src/app/components/AnimatedNumber.tsx` - Count-up number animations
- `/src/app/lib/signature.ts` - Client-side signature generation
- `/src/app/api/observer/route.ts` - Create observer, return ID
- `/src/app/api/home/complete/route.ts` - Save completion signature
- `/src/app/api/home/stats/route.ts` - Global stats (cached 30s)

**Optimistic UI Pattern:**
- Signature generated client-side immediately (no wait)
- Database save happens in background (fire-and-forget)
- User sees instant feedback, zero lag

### Design Philosophy

**Aesthetic:**
- Dark field (`#030304` background)
- Amber/gold accents (`#FFB000`, `#FF8C00`)
- Serif for "PYADRA" title, mono for signatures/IDs
- Minimalist, ceremonial, archaeological

**Animation Principles (In Progress):**
- Subtle floating/breathing animations
- Pulsing glows on key elements
- Smooth transitions with custom easing
- Everything should feel organic, alive

**Copy Tone:**
- "Observer #0001" not "User #1"
- "Entry recorded" not "Registration complete"
- "The archive remembers you now" - mystical, permanent
- "Your discoveries await" - invitation, not instruction

---

## Critical Design Decisions

### ✅ What Works

1. **Observer ID as identity** - Users become part of a numbered archive, not generic users
2. **Signature as artifact** - Completion creates a permanent, unique signature
3. **Optimistic UI** - Instant feedback, database saves in background
4. **Global stats** - Shows collective activity (observers, pulses today)
5. **Mandatory interaction** - Can't skip the game, forces engagement

### ⚠️ Current Issues (April 6, 2026)

1. **Animation feels heavy/slow** - Too many simultaneous animations may cause lag
2. **Title entrance lacks elegance** - PYADRA appearance needs refinement
3. **Doesn't feel "alive" yet** - Needs more visceral, breathing quality
4. **Performance on mobile** - Heavy animations may struggle on lower-end devices

### 🚫 What to Avoid

- **Don't** make it a traditional landing page with hero section + features
- **Don't** add "Skip" or "Enter Site" shortcuts
- **Don't** remove the Observer ID system
- **Don't** use generic web copy ("Sign up", "Get started", etc.)
- **Don't** over-explain - mystery and discovery are core
- **Don't** add too many breathing animations - causes performance issues

---

## Where We're Going

### Immediate Next Steps (Priority Order)

1. **Fix animation performance**
   - Reduce simultaneous animations
   - Remove heavy effects (excessive glows, overlapping pulses)
   - Test on mobile devices
   - Ensure smooth 60fps experience

2. **Make it feel "alive"**
   - Not through quantity of animations, but quality
   - Subtle heartbeat/pulse on signature after generation
   - Ambient particle drift in background (very subtle)
   - Sound design? (ambient drone, pulse feedback)

3. **Refine PYADRA title entrance**
   - Current: opacity + translateY (functional but bland)
   - Goal: Elegant, mysterious formation
   - Consider: Letter-by-letter reveal, or particle assembly
   - Must be fast (< 2s), not gimmicky

4. **Polish completion sequence timing**
   - Current: Signature (1.5s) → Stats (4.5s) → CTA (6s)
   - Might be too slow - test faster reveals
   - Ensure each element has purpose, remove filler

### Future Enhancements (Post-MVP)

- **Sound design**: Ambient drone, pulse feedback clicks (like EterniCapsule)
- **Observer dots visualization**: Show real-time observers as glowing dots
- **Signature verification page**: Enter any signature → see when it was created
- **Weekly/monthly stats**: "This week: X observers joined the archive"
- **Mobile-specific optimizations**: Haptic feedback on pulse send

### Technical Debt

- [ ] Migration not yet applied to production Supabase
- [ ] No error handling if database is down (shows mock data)
- [ ] Observer ID collision if two users hit `/api/observer` at exact same millisecond (extremely unlikely but possible)
- [ ] No rate limiting on pulse sending (could spam database)

---

## Integration with Pyadra Ecosystem

### Connection to Exhibitions

The home page is the **threshold** to Pyadra's museum concept:
- Home = Entrance ritual (become Observer)
- `/exhibitions` = Exhibition selector (Gallery, Jungle, City)
- `/exhibitions/galaxy` = 3D navigation within Galaxy exhibition
- Each exhibition = Themed experience with multiple projects/nodes

**Navigation:**
- After completion → "DISCOVER" button → `/exhibitions`
- Observer ID persists across entire site (localStorage + top bar)
- Signature is permanent record in archive

### Shared Design System

- Uses same color palette as EterniCapsule (midnight backgrounds, amber accents)
- Observer ID in top bar (consistent across all pages)
- Framer Motion for animations (same library as projects)
- Bottom nav links: Manifesto, Privacy, Terms, Contact (transparent, minimal)

---

## For AI Agents Working on Home Page

**Before making changes:**
1. Read this document fully
2. Check `/src/app/page.tsx` for current implementation
3. Test on both desktop and mobile
4. Measure performance impact of animations

**When user requests improvements:**
1. Clarify: Do they want more drama or more subtlety?
2. Ask: What specific moment feels wrong? (entrance, signature reveal, CTA, etc.)
3. Test: Build incrementally, verify each change works
4. Document: Update this file with decisions made

**Performance checklist:**
- Avoid `filter: blur()` on large elements (CPU-heavy)
- Use `transform` and `opacity` for animations (GPU-accelerated)
- Limit simultaneous animations (< 5 at once)
- Test on real mobile device, not just browser DevTools

**Animation philosophy:**
- Less is more - one elegant animation > many mediocre ones
- Timing matters more than quantity
- Easing curves create emotion (use cubic-bezier, not linear)
- If user doesn't notice it, remove it

---

## Success Metrics

**Engagement:**
- % of visitors who complete the signal game
- Average time to completion
- Repeat visits (check Observer ID in localStorage)

**Technical:**
- Page load time < 2s
- 60fps animation performance
- Zero TypeScript errors
- Mobile-responsive (320px → 2560px)

**Emotional (qualitative):**
- User feels like they unlocked something
- Signature feels like an achievement
- Wants to explore projects after completing
- Remembers the experience (not generic)

---

Last updated: April 6, 2026
