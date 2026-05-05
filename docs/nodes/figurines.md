# Project Node: Figurines (Pyadra)

> **Context for AI Agents**: This document outlines the physical product extension of Pyadra called "Figurines". It serves as the baseline context for modifying the user flow, database records, and 3D scenes.

## The Aesthetic Standard
Figurines follows the **Midnight Obsidian** aesthetic. 
- Colors: `#02040A` (Background), `#C4A882` (Gold accents), `#E8D9BB` (Text).
- Typography: `Cormorant` (Italic, Light) for Headers, `Sans-Serif` for readability, `Mono` for data.
- UI Style: Glassmorphism (`backdrop-blur-md`, `bg-black/20`, subtle borders), high-contrast.
- Vibe: Dark, ritualistic, permanent, cinematic. *We do not use e-commerce terms like "Purchase" or "Cart". We use "Commission", "Forge", "Transmit", "Artifact".*

## Core Components

### 1. Landing Interface (`src/app/exhibitions/galaxy/figurines/page.tsx`)
- Uses a massive 3D WebGL Web Scene (`FigurineCanvas.tsx`) powered by React Three Fiber and Drei.
- The 3D scene renders a stylized doll acting as the "Neural Mesh Simulation" instead of static photos.
- Contains the two tiers:
  - **The Physical Cast (A$150)**
  - **The Cast + Signal (A$200)**: Links to Pyadra presence via Magnetic QR Block.

### 2. Form Forging (`src/app/exhibitions/galaxy/figurines/forge/page.tsx`)
- Triggered after Stripe Payment Checkout.
- Requires user to upload 3 photos (Front, Left, Right) + exact Shipping Coordinates.
- Relies on `framer-motion` for a cinematic multi-step transition.

### 3. API & Stripe Workflow
- `/api/figurines/checkout`: Initiates Stripe Session, logs `pending` state to Supabase. **Throws 'DB_MISSING' error if the table doesn't exist, which triggers a red UI banner.**
- `/api/stripe/webhook`: Uses `project_id: "figurines"` metadata to mark order `paid`.
- `/api/figurines/upload`: Extracts FormData, uploads 3 buffers directly to Supabase Storage (`figurines_sculpts` bucket), generates persistent Presigned URLs, triggers emails.

### 4. Database Schema (Required)
```sql
CREATE TABLE figurine_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_session_id TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  tier TEXT NOT NULL,
  amount_aud INTEGER NOT NULL,
  customer_email TEXT,
  customer_name TEXT,
  shipping_address TEXT,
  photo_urls TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
insert into storage.buckets (id, name, public) values ('figurines_sculpts', 'figurines_sculpts', false);
```

### 5. Resend Protocols (`src/app/lib/figurines-email.ts`)
1. **Customer Receipt**: Highly stylized alert confirming the geometry was received and the forge is active.
2. **Founder Internal Alert**: Direct terminal-style email to `FIGURINES_NOTIFY_EMAIL` containing the 3 Signed URLs for the geometry files + precise shipping info to begin 3D modeling.

## Future AI Iteration Tasks
- The founder still needs to run the SQL snippet in Supabase for payments to work.
- In the future, the `<FigurineCanvas />` could be updated to load a real exported `.glb` of the doll if the Founder decides to host one.
