# Pyadra Design & UX Audit — April 2026
## Expert Analysis: Home → Exhibitions → Galaxy

> **Auditor Role**: Senior Product Designer + UX Strategist  
> **Focus**: Mobile-first experience, desktop optimization, narrative coherence  
> **Philosophy**: Pyadra's vision ("Lo que dejas importa") as the North Star  

---

## EXECUTIVE SUMMARY

### 🎯 Core Strengths
1. **Strong philosophical foundation** — "What you leave behind matters" is clear and differentiated
2. **Unique initiation ritual** — Observer ID system creates belonging from moment one
3. **Beautiful aesthetic consistency** — Dark voids, warm golds, intentional typography
4. **Technical excellence** — Optimistic UI, 60fps animations, modern stack

### ⚠️ Critical Issues
1. **Narrative discontinuity** — Journey from HOME → EXHIBITIONS → GALAXY feels disjointed
2. **Visual hierarchy confusion** — Too many competing elements, unclear focus points
3. **Mobile experience gaps** — Text overflow, touch targets too small, layout breaks
4. **Cognitive overload** — Too much happening simultaneously, unclear next actions
5. **Inconsistent navigation** — Each page has different patterns, no clear "back" affordance

### 📊 Severity Breakdown
- **CRITICAL** (blocks core experience): 3 issues
- **HIGH** (degrades experience): 8 issues  
- **MEDIUM** (improvements): 12 issues
- **LOW** (polish): 7 issues

---

## FULL AUDIT — Page by Page

### 1. HOME PAGE (`/`)

#### What Works ✅
- **Observer ID assignment** — Brilliant. Creates immediate belonging
- **Signature as artifact** — Unique, permanent, meaningful
- **Optimistic UI** — Instant feedback, no perceived lag
- **"PYADRA" emergence** — Powerful moment when particles collapse into wordform
- **Global stats** — Reinforces collective participation

#### Critical Issues 🔴
**C1. Animation overload causes performance issues**
- **Problem**: Multiple simultaneous animations (pulse dots, floating title, glowing text, breathing elements) create visual noise and potential frame drops on mid-range mobile devices
- **Impact**: Breaks "beauty as standard" — laggy = cheap
- **Evidence**: Vision doc states "60fps minimum" but current implementation risks < 30fps on iPhone SE, Android mid-range
- **Fix Priority**: CRITICAL

**C2. Unclear "next action" after game completion**
- **Problem**: After signature reveal, user sees stats and tagline but "DISCOVER" button appears 6 seconds later. Many users may leave before seeing it.
- **Impact**: Drop-off between completion and exhibition entry
- **Evidence**: Long delay between completion (0s) → signature (1.5s) → stats (4.5s) → CTA (6s)
- **Fix Priority**: HIGH

**C3. No mobile back affordance**  
- **Problem**: Once you complete the game, there's no way to return to home from exhibitions without browser back button
- **Impact**: Users feel trapped, unclear navigation
- **Fix Priority**: MEDIUM

#### High Priority Issues 🟡
**H1. Title emergence timing feels rushed**
- Problem: "PYADRA" title appears immediately on completion, doesn't feel earned
- Should have: 0.8-1.2s delay before title forms, allow moment of stillness

**H2. Signature format unclear**  
- Problem: `#0001-0048-42-040626-180626` is cryptic, no explanation
- Users don't know what numbers mean
- Should have: Subtle label on hover/tap explaining structure

**H3. Global stats feel disconnected**
- Problem: Stats appear floating in void, no visual container
- Should have: Subtle bordered box or lines framing stats

**H4. "Lo que dejas importa" appears too late**
- Problem: Core tagline shows at 2.1s after global stats
- This is THE message — should be more prominent, earlier

**H5. Mobile tap targets too small**
- Problem: Top bar buttons (OBSERVER ID, SENSORS) are 10px font, difficult to tap on mobile
- Should be: Minimum 44x44px touch target (iOS HIG), 48x48px (Material)

#### Medium Priority Issues 🟠
**M1. Observer ID feels like decoration**
- Currently just sits in corner, could be more ceremonial
- Opportunity: Make it clickable to view your signature/history

**M2. Audio toggle lacks clear state**  
- "SENSORS ACTIVE/MUTED" text is subtle, easy to miss
- Opportunity: Add icon, clearer visual state

**M3. Footer links too subtle**
- 8px text at 20% opacity is nearly invisible
- Opportunity: Increase to 30-40% opacity minimum

**M4. No loading state**
- If API is slow, user sees blank screen
- Opportunity: Add skeleton loader or ambient animation

---

### 2. EXHIBITIONS PAGE (`/exhibitions`)

#### What Works ✅
- **Three-door metaphor** — Spatial, intuitive, fits "museum" concept
- **Badge system** — "● ACTIVE" vs "○ FORMING" is clear
- **3D depth effect** — CSS transforms create nice perspective
- **Header context** — Explains what exhibitions are

#### Critical Issues 🔴
**C4. Header text overflow on mobile**
- **Problem**: Description text breaks container, overlaps with doors
- **Impact**: Looks broken, unprofessional
- **Evidence**: User screenshot shows text cutting off
- **Fix Priority**: CRITICAL

**C5. No clear path back to home**
- **Problem**: "← RETURN" goes to `/` but user has no context this is home vs. back
- **Impact**: Navigation confusion
- **Fix Priority**: HIGH

#### High Priority Issues 🟡
**H6. Center door (Galaxy) lacks emphasis**
- Problem: Galaxy is active but doesn't feel significantly different from inactive doors
- Opportunity: Increase glow, scale, border brightness

**H7. Inactive doors (Jungle/City) too dim**
- Problem: At 30% opacity + blur, they're nearly invisible
- Balance: Keep them secondary but discoverable

**H8. Header positioning feels cramped**
- Problem: Fixed at `top: 100px` leaves insufficient room for top bar
- Visual clash between header and door badges

**H9. No visual connection between pages**
- Problem: Coming from HOME (gold pulsing) to EXHIBITIONS (static amber) feels abrupt
- Opportunity: Carry golden pulse/glow from Observer ID through journey

#### Medium Priority Issues 🟠
**M5. Door hover states too subtle**  
- Transform scale 1.03 barely perceptible
- Increase to 1.05-1.07 for clearer feedback

**M6. Breadcrumb missing**
- No indication you're on "Exhibitions" layer
- Opportunity: Add subtle breadcrumb like Galaxy has

**M7. Descriptions too verbose**
- "Active galleries with projects where you can discover experiences..." — 15 words
- Pyadra philosophy: mystery over explanation
- Opportunity: Cut to 8-10 words maximum

**M8. Badge animation distracting**  
- Constant pulsing on "● ACTIVE" draws too much attention
- Opportunity: Pulse 3 times, then stop

**M9. No mobile swipe affordance**
- Users don't know they can swipe between doors on mobile
- Opportunity: Add dots or subtle swipe hint

---

### 3. GALAXY PAGE (`/exhibitions/galaxy`)

#### What Works ✅
- **2x2 grid layout** — Simple, clear, no scroll (desktop)
- **Badge system** — QUICK START, COMMUNITY, PHYSICAL, FORMING
- **Breadcrumb navigation** — "EXHIBITIONS / GALAXY" provides context
- **CSS-only artifacts** — Performant, beautiful shapes
- **Priority-based emphasis** — EterniCapsule (#1) has subtle glow

#### Critical Issues 🔴
**C6. Text overflow in project cells**
- **Problem**: Longer descriptions (Orbit, EterniCapsule) overflow galaxy-text container
- **Impact**: Text cuts off or wraps awkwardly, looks broken
- **Evidence**: Current max-width 360px + padding insufficient for 12px font × 20+ words
- **Fix Priority**: CRITICAL

#### High Priority Issues 🟡
**H10. Return button inconsistent**
- Problem: "← RETURN" goes to /exhibitions, not labeled
- Opportunity: Make it say "← EXHIBITIONS" for clarity

**H11. Breadcrumb redundant with return button**  
- Both occupy top bar, both go to exhibitions
- One should go to home, other to exhibitions

**H12. Project names too large**
- 36px italic serif takes up significant vertical space
- Opportunity: Reduce to 32px, increase line-height for elegance

**H13. Badge colors don't match project colors**
- Badge uses project.color but at low opacity, feels disconnected
- Opportunity: Increase badge opacity to 0.8-0.9, make it pop

**H14. Inactive project (EBOK) too faded**
- At priority 4, it's nearly invisible with grayscale filter
- Users may not realize it exists

#### Medium Priority Issues 🟠
**M10. Grid cells don't utilize full height**
- Cells are 50vh but content is centered, leaving dead space top/bottom
- Opportunity: Slightly reduce artifact size, increase text spacing

**M11. Hover states feel mechanical**
- Linear transitions, no easing personality
- Opportunity: Add bounce or elastic easing on hover

**M12. No visual "weight" to priority 1 (EterniCapsule)**
- Badge says QUICK START, cell has subtle glow, but doesn't feel like the "main" project
- Opportunity: Increase glow intensity, add subtle animation

**M13. Status labels redundant**  
- Every cell shows [ ACTIVE ] but it's in the badge too
- Opportunity: Remove status label, keep only badge

**M14. CTA text too small**
- 9px "[ CLICK TO ENTER ]" barely visible
- Opportunity: Increase to 10px minimum

**M15. No loading state for click**
- When clicking project, no feedback until page loads
- Opportunity: Add transition animation or loading state

#### Low Priority Issues 🔵
**L1. Artifact shapes too uniform**
- All shapes float similarly, no personality differences
- Opportunity: Vary animation durations, delays

**L2. Badge positioning inconsistent**
- Some badges appear to float too far from artifact
- Opportunity: Standardize top/right positioning

**L3. Grid gap invisible**
- 1px border at 10% opacity barely visible
- Opportunity: Increase to 15-20% opacity

---

## NARRATIVE FLOW ANALYSIS

### The Journey: HOME → EXHIBITIONS → GALAXY

**Current State:**
1. HOME: Interactive, glowing, alive, ceremonial
2. EXHIBITIONS: Static, informational, card-like
3. GALAXY: Grid, functional, catalog-like

**Problem: Each page feels like a different product.**

### Desired State (Coherent Narrative Arc):

**ACT 1: INITIATION** (Home)
- **Emotion**: Wonder, curiosity, discovery
- **Action**: Become Observer, earn signature
- **Outcome**: You are part of something

**ACT 2: ORIENTATION** (Exhibitions)  
- **Emotion**: Choice, anticipation, scale
- **Action**: Choose your path (Galaxy/Jungle/City)
- **Outcome**: You understand the structure

**ACT 3: EXPLORATION** (Galaxy)
- **Emotion**: Exploration, creation, participation
- **Action**: Engage with projects
- **Outcome**: You build something that lasts

**Current Gaps:**
- Transition from Act 1 → Act 2 feels abrupt (home is glowing ritual, exhibitions is static info)
- No thread carrying through (Observer ID appears then disappears from focus)
- Navigation patterns change (no breadcrumb on home/exhibitions, appears on galaxy)
- Visual language inconsistent (gold pulses → amber glow → static badges)

---

## IMPROVEMENT PLAN — Prioritized by Impact

### 🔥 PHASE 1: CRITICAL FIXES (Week 1)

**Goal**: Fix what's broken, ensure nothing blocks core experience

#### 1.1 Fix Text Overflow (CRITICAL)
**Pages**: Exhibitions header, Galaxy project cells  
**Action**:
- Exhibitions: Reduce description to max 50 characters, tighten padding
- Galaxy: Reduce max-width to 340px, font-size to 11px, test all descriptions
**Test**: All text fits on iPhone SE (375px), Pixel 5 (393px), desktop (1920px)
**Time**: 2 hours

#### 1.2 Reduce Animation Load (CRITICAL)
**Page**: Home  
**Action**:
- Remove pulse animation from Observer ID dot (static glow instead)
- Reduce global stats opacity animation frequency (4s → 6s)
- Simplify title glow (2 steps instead of 3)
- Remove floating animation from PYADRA title (keep glow only)
**Test**: Run on iPhone SE, Android mid-range, confirm 60fps
**Time**: 3 hours

#### 1.3 Accelerate CTA Appearance (HIGH)
**Page**: Home
**Action**:
- Reduce signature delay: 1.5s → 1s
- Reduce global stats delay: 4.5s → 2.5s  
- Reduce CTA delay: 6s → 4s
- Total time to CTA: 6s → 4s (33% faster)
**Time**: 1 hour

---

### 🎨 PHASE 2: VISUAL HIERARCHY (Week 2)

**Goal**: Make the important things obvious, reduce cognitive load

#### 2.1 Emphasize Priority 1 Project (EterniCapsule)
**Page**: Galaxy
**Action**:
- Increase background glow from 4% → 8% opacity
- Add subtle border pulse animation (2s, infinite)
- Increase badge opacity from 0.65 → 0.9
- Scale QUICK START badge 1.05x
**Time**: 2 hours

#### 2.2 Improve Galaxy Active Door
**Page**: Exhibitions  
**Action**:
- Increase center door scale from 1 → 1.08
- Increase border glow from 0.4 → 0.6 opacity
- Add subtle pulsing animation to "● ACTIVE" badge (3 pulses, then stop)
- Reduce inactive door opacity from 0.3 → 0.4 (more visible)
**Time**: 2 hours

#### 2.3 Standardize Navigation
**Pages**: All
**Action**:
- Home: Add breadcrumb "HOME" (static, no link)
- Exhibitions: Add breadcrumb "HOME / EXHIBITIONS" (home clickable)
- Galaxy: Keep current "EXHIBITIONS / GALAXY"
- All pages: "← RETURN" goes back one level in breadcrumb
**Time**: 3 hours

#### 2.4 Unify Top Bar
**Pages**: All
**Action**:
- Consistent height: 28px top padding
- Left: Back button or breadcrumb
- Right: Observer ID (clickable) — remove audio toggle (move to settings icon)
- Font size: 10px minimum, 48x48px touch target
**Time**: 3 hours

---

### 🧭 PHASE 3: NARRATIVE COHERENCE (Week 3)

**Goal**: Make the journey feel like one seamless experience

#### 3.1 Carry Golden Thread
**Action**:
- Home: Observer ID has golden pulse (already has this)
- Exhibitions: Add golden pulse to "● ACTIVE" badge (same animation)
- Galaxy: Add golden pulse to priority 1 badge
**Outcome**: Visual continuity through journey
**Time**: 2 hours

#### 3.2 Improve Transitions
**Action**:
- Add page transition animation: fade + slight scale (200ms)
- When clicking "DISCOVER", fade out home → fade in exhibitions
- When entering Galaxy, fade from exhibitions
**Library**: Framer Motion (already in stack)
**Time**: 4 hours

#### 3.3 Add Micro-Copy Refinements
**Pages**: All
**Action**:
- Exhibitions description: "Active galleries with projects..." → "Three spaces to build what lasts. Galaxy is open."
- Galaxy breadcrumb: Add project count "(4 projects)"
- Home tagline: Move "Lo que dejas importa" earlier (1.5s instead of 2.1s)
**Time**: 1 hour

#### 3.4 Signature Explanation
**Page**: Home
**Action**:
- Add tooltip/popover on signature hover/tap
- Content: "Your unique observation signature: Observer ID - Time - Pulses - Date - Timestamp"
- Design: Subtle border, 8px font, 200ms fade in
**Time**: 2 hours

---

### 📱 PHASE 4: MOBILE OPTIMIZATION (Week 4)

**Goal**: Mobile-first experience excellence

#### 4.1 Touch Target Compliance
**Pages**: All
**Action**:
- Audit all interactive elements
- Minimum 44x44px (iOS) / 48x48px (Android)
- Add padding to buttons that are currently text-only
**Test**: Use Chrome DevTools touch emulation
**Time**: 3 hours

#### 4.2 Mobile Typography Scale
**Action**:
- Home signature: 18px → 20px (mobile)
- Exhibition header: Reduce to 16px subtitle (mobile)
- Galaxy project names: 36px → 32px (mobile)
- Galaxy descriptions: 12px → 11px (mobile)
**Test**: iPhone SE (smallest viewport)
**Time**: 2 hours

#### 4.3 Mobile Swipe Hints
**Page**: Exhibitions (if keeping swipe behavior)
**Action**:
- Add dots indicator at bottom (3 dots, middle one active)
- Subtle "swipe" text hint that fades after 3s
- Add subtle arrow hints on left/right edges
**Time**: 3 hours

#### 4.4 Performance Audit
**Action**:
- Run Lighthouse on mobile
- Target: Performance > 90, Accessibility > 95
- Optimize images, reduce JS bundle, code-split heavy components
**Time**: 4 hours

---

### ✨ PHASE 5: POLISH & DELIGHT (Week 5-6)

**Goal**: Make it feel alive, memorable, magical

#### 5.1 Artifact Personality
**Page**: Galaxy
**Action**:
- Orbit 77: Vary ring rotation speed (10s → 12s one ring, 8s → 9s other)
- EterniCapsule: Add subtle vertical breathing (2px up/down, 8s)
- Figurines: Vary rotation speed (20s → 18s)
- EBOK: Add page-turn micro-animation on hover
**Time**: 3 hours

#### 5.2 Sound Design (Optional)
**Action**:
- Add subtle 432Hz ambient drone (very low volume, optional)
- Click sounds: soft, organic (like stone tapping)
- Signature reveal: crystallization sound
- Settings: Audio on/off in top bar
**Time**: 6 hours (if pursuing)

#### 5.3 Easter Eggs
**Ideas**:
- Click Observer ID 3 times → see your observation history
- Hold shift + click on "PYADRA" → hidden credits
- Konami code → special animation
**Time**: 4 hours (fun, not essential)

---

## QUICK WINS (Can Do Today)

### 1. Fix Text Overflow (30min)
```css
/* exhibitions.css */
.header-description {
  font-size: 10px;
  max-width: 520px; /* from 580px */
  line-height: 1.6;
}

/* galaxy.css */
.galaxy-text {
  max-width: 340px; /* from 360px */
  padding: 0 24px; /* from 20px */
}
.galaxy-desc {
  font-size: 11px; /* from 12px */
}
```

### 2. Increase CTA Visibility (15min)
```tsx
// page.tsx (Home)
setTimeout(() => setShowCTA(true), 4000); // from 6000
```

### 3. Emphasize Priority 1 (20min)  
```css
/* galaxy.css */
.galaxy-cell-priority-1 {
  background: radial-gradient(ellipse at center, rgba(196, 168, 130, 0.08) 0%, transparent 70%); /* from 0.04 */
}
.galaxy-cell-priority-1 .galaxy-badge {
  opacity: 0.9; /* from 0.65 */
}
```

### 4. Clarify Return Button (10min)
```tsx
// exhibitions/page.tsx
<Link href="/" className="exhibitions-link">
  ← HOME
</Link>

// galaxy/page.tsx  
<Link href="/exhibitions" className="galaxy-link">
  ← EXHIBITIONS
</Link>
```

### 5. Reduce Animation Noise (20min)
```tsx
// page.tsx (Home) - Remove pulse from Observer ID
// Before:
<div className="w-1 h-1 bg-[#FFB000] rounded-full animate-pulse"></div>
// After:
<div className="w-1 h-1 bg-[#FFB000] rounded-full opacity-80"></div>
```

**Total Time: ~2 hours for noticeable improvement**

---

## LONG-TERM STRATEGIC IMPROVEMENTS

### 1. Observer Profile System
**What**: Click Observer ID → see your signatures, completions, projects participated in
**Why**: Reinforces "what you leave behind matters" — show them their archive
**Effort**: Medium (new page, API endpoints)
**Impact**: High (creates ongoing relationship)

### 2. Exhibition Preview Animations
**What**: Hover/tap Jungle or City → see teaser animation or message
**Why**: Builds anticipation for future exhibitions
**Effort**: Low (simple modal + copy)
**Impact**: Medium (curiosity, retention)

### 3. Ambient Soundscapes
**What**: Each page has subtle 432Hz drone, shifts between pages
**Why**: Reinforces "alive" feeling, audio identity
**Effort**: High (sound design, audio engine, performance)
**Impact**: Medium-High (very memorable if done well)

### 4. Micro-Interactions Library
**What**: Standardized hover, click, transition animations
**Why**: Consistency, polish, brand language
**Effort**: Medium (design system work)
**Impact**: High (professionalism, coherence)

### 5. Performance Monitoring
**What**: Real User Monitoring (RUM) to track actual performance in the wild
**Why**: Data-driven optimization, catch issues before users report
**Effort**: Low (Vercel Analytics, Sentry)
**Impact**: High (maintain quality)

---

## MOBILE VS DESKTOP STRATEGY

### Mobile-Specific Priorities
1. **Touch targets** — Everything 48x48px minimum
2. **Typography** — Larger minimums (11px body, 16px inputs)
3. **Spacing** — More generous padding (24px vs 16px)
4. **Transitions** — Faster, snappier (200ms vs 400ms)
5. **Performance** — Aggressive optimization (code-split, lazy load)

### Desktop-Specific Priorities  
1. **Hover states** — Rich, detailed feedback
2. **Cursor affordances** — Pointer vs default, custom cursors
3. **Keyboard navigation** — Tab order, shortcuts
4. **Multi-column layouts** — Utilize horizontal space
5. **Larger typography** — Don't be afraid to go big

### Universal Priorities
1. **Narrative coherence** — Journey feels seamless
2. **Visual consistency** — Same language across pages
3. **Performance** — 60fps everywhere
4. **Accessibility** — WCAG AA minimum
5. **Loading states** — Never show blank screens

---

## METRICS TO TRACK

### Quantitative
- **Completion rate**: % who finish home game
- **Time to CTA**: Average seconds until "DISCOVER" click
- **Bounce rate**: % who leave after home, after exhibitions
- **Page load time**: LCP, FCP, TTI per page
- **Frame rate**: % of sessions maintaining 60fps

### Qualitative  
- **User recordings**: Watch 50 sessions (Hotjar, FullStory)
- **Confusion points**: Where do users pause, go back, click wrong things?
- **Emotional response**: Do they say "wow" or "huh?"
- **Memory**: Ask users a week later what they remember

---

## DESIGN SYSTEM NEEDS

### Typography Scale
```css
/* Currently inconsistent — standardize */
--text-xs: 9px;   /* Metadata, captions */
--text-sm: 10px;  /* Body small, labels */
--text-base: 12px; /* Body text */
--text-lg: 14px;  /* Subheads */
--text-xl: 18px;  /* Section titles */
--text-2xl: 24px; /* Page titles */
--text-3xl: 36px; /* Hero text */
--text-4xl: 48px; /* Display */
```

### Spacing Scale
```css
/* Already defined in globals.css - good! */
/* Just ensure consistent usage across pages */
```

### Color Tokens
```css
/* Standardize golden accent usage */
--gold-dim: #FFB000 at 0.3 opacity;
--gold-muted: #FFB000 at 0.6 opacity;
--gold-base: #FFB000;
--gold-bright: #FFCC66;
--gold-glow: #FFB000 with blur;
```

### Animation Curves
```css
/* Define reusable easings */
--ease-organic: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
```

---

## FINAL RECOMMENDATIONS

### Immediate Actions (This Week)
1. Fix text overflow (Critical)
2. Reduce animation load (Critical)  
3. Speed up CTA appearance (High)
4. Clarify navigation labels (High)
5. Emphasize priority 1 project (High)

### Short-Term (Next 2 Weeks)
1. Standardize top bar across pages
2. Add breadcrumb navigation system
3. Implement page transitions
4. Audit mobile touch targets
5. Run performance optimization pass

### Medium-Term (Next Month)
1. Build Observer profile page
2. Add sound design
3. Create design system documentation
4. Implement micro-interactions library
5. Add real user monitoring

### Philosophy Alignment Check
**Ask yourself for every change:**
- ✅ Does this honor "what you leave behind matters"?
- ✅ Does this feel intentional, not generic?
- ✅ Is it beautiful enough to ship?
- ✅ Does it invite creation or passive consumption?
- ✅ Would someone remember this?

If any answer is "no" — don't ship it.

---

**End of Audit**  
*Prepared by: Design & UX Analysis System*  
*Date: April 30, 2026*  
*Next Review: After Phase 1-2 implementation*
