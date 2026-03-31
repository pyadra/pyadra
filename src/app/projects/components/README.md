# Phase 1: Mars Excavation Scene Foundation (Refined)

Dark, cinematic 3D environment for /projects page with archaeological atmosphere.

## Components

### ProjectsScene.tsx
Main Canvas wrapper
- Camera positioned at [0, 8, 12] for angled cinematic view
- Enhanced fog (#140c08, 12-45 units) for depth
- Integrates all atmosphere systems

### LightingRig.tsx
Improved balanced lighting for readability
- Ambient light (0.2 intensity) - dark but clear
- Main fill light (0.3 intensity) - reveals form
- Backlight (0.15 intensity) - silhouette definition
- Main illumination from cursor spotlight (15 intensity)

### MarsGround.tsx
**Terrain with 2 burial zones**
- 50x50 plane with 99x99 segments for detail
- Multi-scale procedural elevation (dunes, ridges, micro-texture)
- **2 burial anomalies**: Subtle mounds at artifact locations
- Left area (Orbit) and right area (Capsule)
- Ultra-matte surface (#8a5235, 0.98 roughness)
- Erosion channels for realism

### LanternPointer.tsx
**Refined cursor spotlight - archaeological scanning feel**
- Warm-white center (#ffe8d6) with environmental warmth on ground
- More focused beam (angle 0.35, penumbra 0.7)
- **Heavier motion**: Slower lerp (0.05) creates weighted, elegant movement
- Positioned 7 units above ground for optimal grazing angle
- Feels like real lantern scanning, not raw mouse cursor

### CameraBreathing.tsx
**NEW: Subtle life in the camera**
- Almost imperceptible breathing motion
- Very slow drift (0.08-0.15 Hz)
- Micro-rotation for scanning feeling
- Creates "alive" presence without distraction

### AtmosphericDepth.tsx
**NEW: Background gradient sphere**
- 70-unit sphere with dark gradient shader
- Near-black top → dark rust-orange horizon
- Prevents flat black void feeling
- Not space, not bright - just depth

### DustField.tsx
Refined atmospheric particles
- 140 particles (slightly increased)
- Lower altitude (0.8-6.8 units) to catch spotlight
- Brighter, warmer (#d4b896) with additive blending
- More visible when crossing light beam
- Slower, more elegant drift

## Cinematic Refinements

1. **Lighting**: Warm-white lantern with focused beam, smooth falloff
2. **Ground**: Better detail under grazing light, subtle burial hints
3. **Atmosphere**: Background gradient + enhanced fog for depth
4. **Camera**: Breathing motion for life
5. **Motion**: Heavier spotlight interpolation feels archaeological
6. **Narrative**: Terrain suggests buried secrets without revealing them

## Result

Archaeological exploration atmosphere:
- Premium, quiet, minimal
- Lantern scanning feels weighted and deliberate
- Terrain hints at buried artifacts through subtle mounds
- Camera feels alive but calm
- Dust catches light realistically
- Not a game, not generic sci-fi - cinematic excavation site

---

## Phase 2: Buried Artifacts (Simplified)

Two main artifacts clearly visible in the excavation site.
Focused on readability and clear discovery experience.

### useArtifactState.ts
Clean state management hook
- States: `buried` → `detected` → `awakened`
- Methods: `detect()`, `undetect()`, `awaken()`
- Avoids random booleans, maintains clear progression

### OrbitArtifact.tsx
**Partially buried sphere - mysterious, alive, premium**

**Placement**: [-6, -1.0, -2] in left area
- Sphere geometry (radius 1.6)
- 60% buried, clearly visible top portion

**Material**:
- Base: Dark neutral `#2a2828` (premium, not green)
- Emissive: Warm brown `#4a3a2a`
- Roughness 0.8, metalness 0.2

**Behavior** (Progressive Discovery):
- **Buried (idle)**: Very subtle emissive (0.08-0.12) - dormant, barely noticeable
- **Detected (hover)**: Clear awakening (0.45-0.65) - responds to presence
- **Awakened (click)**: Full activation (0.85-1.0) - fully alive, lifting oscillation
- Continuous slow rotation (0.08 rad/s)

**Discovery Feel**: Starts dormant, comes alive through interaction

**Emotion**: Mysterious, premium, alive

### CapsuleArtifact.tsx
**Buried time capsule - solemn, sacred, clearly visible**

**Placement**: [6, -1.2, 2] in right area
- Box geometry (0.9 × 3.5 × 0.9) - vertical monolith
- 65% buried, clear silhouette visible

**Material**:
- Base: Lighter metal `#2a2218` (more readable)
- Emissive: Warm brown `#4a3a2a`
- Roughness 0.7, metalness 0.6

**Gold Lines**:
- 4 vertical LineSegments at corners
- Color: `#d4a574`
- Progressive visibility creates discovery

**Behavior** (Progressive Discovery):
- **Buried (idle)**: Almost invisible (gold 0.06-0.08, emissive 0.04-0.06) - dormant
- **Detected (hover)**: Lines appear (gold 0.5-0.65, emissive 0.2-0.3) - awakening
- **Awakened (click)**: Full brightness (gold 0.85-1.0, emissive 0.45-0.6) - activated, emergence
- Subtle imperfect tilt (rotation [0.02, 0.03, -0.01]) - natural burial

**Discovery Feel**: Hidden at rest, reveals through interaction

**Emotion**: Sacred, time-locked, premium

### Interaction Logic (Progressive Discovery)

**3-Stage Awakening System:**

1. **Buried (Idle)** - Dormant state
   - Artifacts barely visible in darkness
   - Orbit: Very subtle warm glow (0.08-0.12)
   - Capsule: Gold lines almost invisible (0.06-0.08)
   - User must scan with lantern to discover

2. **Detected (Hover)** - Recognition & awakening
   - Clear visual response to presence
   - Orbit: Glow increases dramatically (0.45-0.65)
   - Capsule: Gold lines appear and brighten (0.5-0.65)
   - Feels like artifact sensing and responding

3. **Awakened (Click)** - Full activation
   - Maximum brightness and animation
   - Orbit: Full glow (0.85-1.0), lifting motion
   - Capsule: Maximum gold (0.85-1.0), emergence
   - NO navigation yet - just first activation

**Discovery Feel:**
- Not static or "always on"
- Progressive awakening through interaction
- User triggers the experience
- Emotionally distinct artifacts
- Premium, minimal motion

### Spatial Layout (2 Artifacts)

```
     Orbit                                    Capsule
   [-6, -1.0, -2]                           [6, -1.2, 2]
         🪐                                        📦
    Dark sphere                              Gold-lined monolith
```

**Design Principles**:
- Clear separation - left and right areas
- Both in main exploration zone
- Not too deep, not too far
- Easily discoverable with lantern scanning

---

## Phase 3: Activation & Transition System (NEW)

Cinematic activation sequences with smooth camera transitions and navigation.

### useActivationState.tsx
**Global activation state manager** (React Context)
- Prevents multiple artifacts activating simultaneously
- States: `idle` | `detected` | `awakened` | `activating` | `transitioning`
- Methods: `setActivating()`, `setTransitioning()`, `reset()`, `canActivate()`

### OrbitArtifact.tsx (Enhanced)
**Cinematic activation sequence**:
1. Small delay (~0.2s)
2. Emissive intensity → 1.2 (gsap, 0.8s)
3. Levitation: y position -1.0 → -0.6 (1.5s)
4. Rotation speed increases (Math.PI * 2 in 1.5s)
5. Camera moves closer (via CameraTransition)
6. Navigate to `/projects/orbit` after 1.8s

**Duration**: ~2 seconds total

### CapsuleArtifact.tsx (Enhanced)
**Cinematic activation sequence**:
1. Small delay (~0.2s)
2. Gold lines illuminate progressively: opacity → 1.0 (1.2s)
3. Emissive intensity → 0.8 (1.2s)
4. Capsule rises: y position 0 → 0.5 (2s, power3.inOut)
5. Camera lowers and moves forward (via CameraTransition)
6. Navigate to `/projects/ethernicapsule` after 2.2s

**Duration**: ~2-2.5 seconds total

### CameraTransition.tsx
**Smooth camera movements using gsap**:
- **Orbit activation**: Move to [-4, 6, 0], rotate slightly
- **Capsule activation**: Move to [4, 4, 4], lower angle
- Easing: power3.inOut for cinematic feel
- Duration: 1.8-2s synchronized with artifact animation

### EnvironmentResponse.tsx
**Subtle lighting changes during activation**:
- Activating: Ambient light increases 30% (1.5s)
- Transitioning: Ambient dims 20% (0.8s)
- Creates immersive environmental response

### Animation Technology
- **gsap**: All smooth transitions and easings
- **power3.inOut**: Cinematic easing curve
- **Synchronized timing**: Camera + artifact + environment
- **No abrupt jumps**: Everything flows smoothly

### Success Criteria Met
✅ Click feels meaningful and cinematic
✅ ~2 second "wow" moment before navigation
✅ Orbit and Capsule feel emotionally different
✅ Smooth camera movements (no jarring)
✅ Environment responds subtly
✅ Navigation only after animation completes
