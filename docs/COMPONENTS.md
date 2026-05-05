# Component Library Reference

Documentation for all reusable UI components in Pyadra.

---

## 📁 Component Organization

Components are organized by category in `/src/app/components/`:

```
components/
├── 3d/          # Three.js 3D components
├── interactive/ # Interactive UI components  
├── audio/       # Audio/sound components
└── util/        # Utility components
```

---

## 🎨 3D Components (`/components/3d/`)

### Scene.tsx
**Purpose**: Three.js canvas wrapper with camera controls

**Usage**:
```typescript
import Scene from "@/app/components/3d/Scene";

<Scene>
  {/* Three.js objects go here */}
</Scene>
```

**Props**: None (wraps children with Three.js context)

**Dependencies**: `@react-three/fiber`, `three`

---

### PyadraStone3D.tsx
**Purpose**: 3D rotating stone monolith with glow effects

**Usage**:
```typescript
import PyadraStone3D from "@/app/components/3d/PyadraStone3D";

<PyadraStone3D />
```

**Features**:
- Floating animation
- Glow/bloom post-processing
- Auto-rotation
- Responsive to mouse movement

**Props**: None (self-contained)

**File Size**: 396 lines

**Dependencies**: `@react-three/fiber`, `@react-three/drei`, `three`

---

## ⚡ Interactive Components (`/components/interactive/`)

### ParticleDecoder.tsx
**Purpose**: Interactive particle system for home page signal decoding game

**Usage**:
```typescript
import ParticleDecoder from "@/app/components/interactive/ParticleDecoder";

<ParticleDecoder 
  onMissionComplete={(stats) => handleComplete(stats)}
/>
```

**Props**:
```typescript
interface ParticleDecoderProps {
  onMissionComplete?: (stats: GameStats) => void;
}

interface GameStats {
  timeElapsed: number;
  pulsesSent: number;
  decodeAttempts: number;
}
```

**Features**:
- WebGL particle system
- Mouse interaction (click to send pulse)
- Audio feedback (optional)
- Stats tracking
- Completion callback

**File Size**: 691 lines (largest component)

**Dependencies**: Canvas API, Web Audio API

---

### PyadraStone.tsx
**Purpose**: 2D animated monolith with particle effects (canvas-based)

**Usage**:
```typescript
import PyadraStone from "@/app/components/interactive/PyadraStone";

<PyadraStone />
```

**Features**:
- Canvas-based 2D rendering
- Particle emanation effects
- Glow/blur effects
- Responsive sizing

**Props**: None

**File Size**: 576 lines

**Alternative**: Use `PyadraStone3D` for WebGL/Three.js version

---

### CustomCursor.tsx
**Purpose**: Custom cursor that follows mouse with subtle animation

**Usage**:
```typescript
import CustomCursor from "@/app/components/interactive/CustomCursor";

// In layout.tsx or page-level component
<CustomCursor />
```

**Features**:
- Smooth follow animation
- Hover state detection
- Blend mode effects
- Auto-hides on touch devices

**Props**: None

**Notes**: Should only be included once per page (typically in `layout.tsx`)

---

### HeroParticles.tsx
**Purpose**: Background particle effect for hero sections

**Usage**:
```typescript
import HeroParticles from "@/app/components/interactive/HeroParticles";

<div className="relative">
  <HeroParticles />
  {/* Hero content */}
</div>
```

**Features**:
- Floating particle animation
- Parallax effect on mouse move
- Configurable particle count
- Performance optimized

**Props**: None (uses default particle config)

**File Size**: 170 lines

---

## 🔊 Audio Components (`/components/audio/`)

### AmbientAudio.tsx
**Purpose**: Background ambient audio player with user-controlled toggle

**Usage**:
```typescript
import AmbientAudio from "@/app/components/audio/AmbientAudio";

<AmbientAudio audioSrc="/ambient-drone.mp3" />
```

**Props**:
```typescript
interface AmbientAudioProps {
  audioSrc: string;  // Path to audio file in /public/
}
```

**Features**:
- Auto-play on user interaction (browser policy compliant)
- Loop playback
- Volume fade in/out
- User toggle control

**Browser Compatibility**: Handles blocked autoplay gracefully

---

## 🛠️ Utility Components (`/components/util/`)

### ErrorBoundary.tsx
**Purpose**: React error boundary to catch and display rendering errors

**Usage**:
```typescript
import ErrorBoundary from "@/app/components/util/ErrorBoundary";

<ErrorBoundary>
  {/* Components that might error */}
</ErrorBoundary>
```

**Features**:
- Catches React rendering errors
- Displays user-friendly error message
- Logs error details to console
- Prevents entire app crash

**Props**: None (wraps children)

**Best Practice**: Wrap page-level components or risky sections

---

### AnimatedNumber.tsx
**Purpose**: Animated number counter with smooth transitions

**Usage**:
```typescript
import AnimatedNumber from "@/app/components/util/AnimatedNumber";

<AnimatedNumber 
  value={1234} 
  duration={1000}
  format={(n) => `$${n.toFixed(2)}`}
/>
```

**Props**:
```typescript
interface AnimatedNumberProps {
  value: number;           // Target number
  duration?: number;       // Animation duration in ms (default: 1000)
  format?: (n: number) => string;  // Optional formatter
}
```

**Use Cases**:
- Donation counters (Orbit 77)
- Stats displays
- Live metrics

---

## 🎯 Component Selection Guide

| Need | Component | Location |
|------|-----------|----------|
| 3D rotating object | `PyadraStone3D` | `/components/3d/` |
| 2D canvas animation | `PyadraStone` | `/components/interactive/` |
| Particle background | `HeroParticles` | `/components/interactive/` |
| Interactive game | `ParticleDecoder` | `/components/interactive/` |
| Custom mouse | `CustomCursor` | `/components/interactive/` |
| Background music | `AmbientAudio` | `/components/audio/` |
| Error handling | `ErrorBoundary` | `/components/util/` |
| Number animation | `AnimatedNumber` | `/components/util/` |

---

## 📝 Creating New Components

### Naming Convention
- PascalCase for file and component names
- Descriptive, noun-based names (`Button`, `Modal`, `ParticleSystem`)
- Suffix with `3D` if Three.js-based

### File Structure
```typescript
// MyComponent.tsx
'use client';  // If uses React hooks/state

import { useState } from 'react';

interface MyComponentProps {
  // Define props
}

export default function MyComponent({ ...props }: MyComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```

### Where to Place
- **3D Components** → `/components/3d/` (uses Three.js, `@react-three/*`)
- **Interactive Components** → `/components/interactive/` (user interaction, animations)
- **Audio Components** → `/components/audio/` (sound, music)
- **Utility Components** → `/components/util/` (helpers, wrappers, no UI)

### Export Pattern
```typescript
// In category folder index.ts (optional)
export { default as MyComponent } from './MyComponent';
export { default as OtherComponent } from './OtherComponent';

// Then import as:
import { MyComponent } from '@/app/components/interactive';
```

---

## 🧪 Testing Components

Components should have tests in adjacent `__tests__/` folder:

```
components/
├── interactive/
│   ├── ParticleDecoder.tsx
│   └── __tests__/
│       └── ParticleDecoder.test.tsx
```

**Test Template**:
```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders without crashing', () => {
    render(<MyComponent />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
});
```

---

## ⚠️ Common Patterns

### Client-Side Only Components
Many components require browser APIs (canvas, audio, Three.js):

```typescript
'use client';  // Required for interactive components

import dynamic from 'next/dynamic';

// Or lazy load:
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  ssr: false  // Disable server-side rendering
});
```

### Cleanup on Unmount
Always clean up resources (timers, listeners, contexts):

```typescript
useEffect(() => {
  const timer = setInterval(() => {}, 1000);
  
  return () => {
    clearInterval(timer);  // Cleanup
  };
}, []);
```

### Performance Optimization
For heavy components (Three.js, particles):

```typescript
import { memo } from 'react';

export default memo(function MyComponent() {
  // Component logic
});
```

---

## 📚 Related Documentation

- **Architecture** (`/ARCHITECTURE.md`) - Overall component strategy
- **Quick Start** (`/docs/QUICK_START.md`) - How to use components
- **API Reference** (`/docs/API_REFERENCE.md`) - Backend integration
