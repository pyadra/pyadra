# Pyadra Architecture

> System design, data flows, and technical decisions for the Pyadra ecosystem

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Projects](#projects)
  - [EterniCapsule](#ethernicapsule)
  - [Orbit 77](#orbit-77)
  - [Figurines](#figurines)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Authentication & Security](#authentication--security)
- [Payment Processing](#payment-processing)
- [Email Delivery](#email-delivery)
- [3D Rendering](#3d-rendering)
- [Deployment](#deployment)

---

## Overview

Pyadra is a monolithic Next.js application using the App Router architecture. All projects (EterniCapsule, Orbit 77, etc.) share the same codebase, database, and infrastructure while maintaining distinct user experiences.

**Key Architectural Decisions:**
- **Monolith over microservices**: Simplicity and faster iteration for a small team
- **Server-side rendering (SSR) + Client components**: SEO-friendly pages with interactive 3D experiences
- **Supabase for data**: Managed PostgreSQL with Row Level Security (RLS)
- **Stripe for payments**: Industry-standard payment processing
- **Vercel for hosting**: Serverless deployment with edge functions

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   React    │  │   Three.js   │  │  Framer Motion   │   │
│  │ Components │  │  3D Scenes   │  │   Animations     │   │
│  └────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTP/WS
┌─────────────────────────────────────────────────────────────┐
│                   Next.js 16 (App Router)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Pages & Layouts (SSR + Client Components)             │ │
│  ├────────────────────────────────────────────────────────┤ │
│  │  API Routes                                             │ │
│  │  • /api/ethernicapsule/* → Capsule operations          │ │
│  │  • /api/stripe/webhook → Payment confirmation          │ │
│  │  • /api/cron/* → Scheduled jobs                        │ │
│  │  • /api/stats → Analytics                              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐
│    Supabase      │  │     Stripe       │  │    Resend    │
│   PostgreSQL     │  │  Payment Gateway │  │  Email API   │
└──────────────────┘  └──────────────────┘  └──────────────┘
```

---

## Projects

### EterniCapsule

**Purpose**: Time-locked digital message vault. Users write a message, pay $9 AUD, and have it delivered to recipients at a future date.

**User Flow:**
```
1. User visits /exhibitions/galaxy/ethernicapsule
2. User composes message → /exhibitions/galaxy/ethernicapsule/compose
3. User previews → /exhibitions/galaxy/ethernicapsule/preview
4. User clicks "Seal" → Creates Stripe checkout session
5. Payment completes → Webhook updates DB to "sealed"
6. User receives keys via email
7. Cron job checks daily for delivery dates
8. When date arrives → Email sent to recipients
```

**Key Files:**
- [`src/app/exhibitions/galaxy/ethernicapsule/compose/ComposeForm.tsx`](src/app/exhibitions/galaxy/ethernicapsule/compose/ComposeForm.tsx) - Message composition
- [`src/app/api/ethernicapsule/checkout/route.ts`](src/app/api/ethernicapsule/checkout/route.ts) - Stripe session creation
- [`src/app/api/stripe/webhook/route.ts`](src/app/api/stripe/webhook/route.ts) - Payment confirmation
- [`src/app/api/cron/ethernicapsule/route.ts`](src/app/api/cron/ethernicapsule/route.ts) - Daily delivery check
- [`src/app/lib/ethernicapsule-email.ts`](src/app/lib/ethernicapsule-email.ts) - Email templates

**Data Flow:**
```
Compose → Pending (DB) → Stripe Checkout → Webhook → Sealed (DB) → Cron → Delivered (Email)
```

**Security:**
- Messages are hashed with SHA-256 keys
- Keys are generated client-side and stored in metadata
- Service role bypasses RLS for trusted backend writes

---

### Orbit 77

**Purpose**: Podcast platform with supporter funding model. Supporters receive credentials and archive access.

**User Flow:**
```
1. User visits /exhibitions/galaxy/orbit
2. User clicks "Join the Transmission"
3. User enters name + email + donation amount
4. Stripe checkout
5. Webhook confirms payment → Creates supporter record
6. Email sent with credential code
7. User accesses /archive/[id] with supporter ID
```

**Key Files:**
- [`src/app/exhibitions/galaxy/orbit/page.tsx`](src/app/exhibitions/galaxy/orbit/page.tsx) - Landing page
- [`src/app/exhibitions/galaxy/orbit/join/page.tsx`](src/app/exhibitions/galaxy/orbit/join/page.tsx) - Donation form
- [`src/app/api/donate/route.ts`](src/app/api/donate/route.ts) - Stripe session creation
- [`src/app/lib/email.ts`](src/app/lib/email.ts) - Credential email
- [`src/app/archive/[id]/page.tsx`](src/app/archive/[id]/page.tsx) - Supporter archive

**Data Flow:**
```
Join → Stripe Checkout → Webhook → Supporter Record (DB) → Email → Archive Access
```

---

### Figurines

**Purpose**: The first physical bridge to the Pyadra ecosystem. Users commission a custom 3D printed, hand-painted replica of themselves derived from three photographs. The "Signal" tier links this physical artifact back to their Pyadra Archive via a magnetic QR code.

**User Flow:**
```
1. User visits /exhibitions/galaxy/figurines (Cinematic 3D WebGL Neural Scene)
2. User selects Tier ($150 or $200) → /api/figurines/checkout
3. Checkout Session Created (DB check triggers "TABLE MISSING" boundary if uninitialized)
4. Payment completes → Webhook updates DB to "paid"
5. User redirected to /exhibitions/galaxy/figurines/forge
6. User uploads 3 photos (Front, Left, Right) + Shipping Address
7. Data buffered directly to Supabase Storage ('figurines_sculpts' bucket)
8. Email Sent: Customer receives "Forging" receipt, Founder receives Image Links
9. Order moves to "forging" state
```

**Key Files:**
- `src/app/exhibitions/galaxy/figurines/page.tsx` - 3D Landing Page
- `src/app/exhibitions/galaxy/figurines/components/FigurineCanvas.tsx` - WebGL R3F Doll simulation
- `src/app/exhibitions/galaxy/figurines/forge/page.tsx` - 3-Photo Upload Form
- `src/app/api/figurines/checkout/route.ts` - Stripe Session Initialization
- `src/app/api/figurines/upload/route.ts` - Supabase Storage buffered upload + Email trigger
- `src/app/lib/figurines-email.ts` - Resend notification logic

**Data Flow:**
```
Landing → Checkout → Webhook (Paid) → Forge (Upload) → Storage + DB (Forging) → Emails
```

---

## Database Schema

**Tables:**

### `observers`
```sql
CREATE TABLE observers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW()
);
```
Tracks anonymous visitors. Used for "Observer #0001" identity system.

### `orbit_supporters`
```sql
CREATE TABLE orbit_supporters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  stripe_customer_id TEXT,
  stripe_session_id TEXT NOT NULL UNIQUE,
  supporter_name TEXT NOT NULL,
  supporter_email TEXT NOT NULL,
  amount_aud INTEGER NOT NULL,
  season_label TEXT NOT NULL,
  credential_code TEXT NOT NULL UNIQUE
);
```

### `ethernicapsule_capsules`
```sql
CREATE TABLE ethernicapsule_capsules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sealed', 'delivered', 'cancelled')),
  stripe_session_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  recipient_name TEXT,
  guardian_email TEXT,
  deliver_at TIMESTAMP,
  message TEXT NOT NULL,
  sender_key_hash TEXT NOT NULL,
  capsule_key_hash TEXT NOT NULL,
  delivered_at TIMESTAMP
);
```

**Indexes:**
- `stripe_session_id` (for webhook lookups)
- `status` (for cron queries)
- `deliver_at` (for cron queries)

---

## API Routes

### Core Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/stats` | GET | Project stats (members, nodes) | Public |
| `/api/observer` | POST | Create observer ID | Public |
| `/api/session` | POST | Verify Stripe session | Public |

### EterniCapsule Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/ethernicapsule/checkout` | POST | Create Stripe checkout | Public |
| `/api/ethernicapsule/verify` | POST | Verify capsule key | Public |
| `/api/ethernicapsule/edit` | POST | Update pending capsule | Key-based |
| `/api/cron/ethernicapsule` | GET | Daily delivery check | Cron secret |

### Orbit 77 Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/donate` | POST | Create donation checkout | Public |
| `/api/stats/orbit-fund` | GET | Funding progress | Public |

### Figurines Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/figurines/checkout` | POST | Create Stripe checkout | Public |
| `/api/figurines/upload` | POST | Buffer photos to Supabase Storage | Public (requires valid session_id) |

### Webhook Routes

| Route | Method | Purpose | Auth |
|-------|--------|---------|------|
| `/api/stripe/webhook` | POST | Stripe event handler | Webhook signature |

---

## Authentication & Security

**Approach**: No traditional user authentication. Security through:

1. **Cryptographic Keys** (EterniCapsule)
   - Keys generated client-side
   - SHA-256 hashed before storage
   - Keys required for edit/view operations

2. **Stripe Webhook Signatures**
   - All webhook events verified with `stripe.webhooks.constructEvent`
   - Invalid signatures rejected

3. **Row Level Security (RLS)**
   - Supabase RLS policies on all tables
   - Service role key bypasses RLS for trusted operations

4. **Input Sanitization**
   - XSS protection via `sanitizeString()` utility
   - HTML tags stripped from user input
   - Email validation

5. **Rate Limiting**
   - Vercel edge functions have built-in rate limits
   - Additional limits via middleware (future)

---

## Payment Processing

**Flow:**

```
Client → Create Checkout Session → Stripe Hosted Checkout → Payment → Webhook → DB Update → Email
```

**Implementation:**

1. **Checkout Session Creation**
   - Client calls `/api/[project]/checkout`
   - Server creates Stripe session with metadata
   - Client redirected to Stripe Checkout

2. **Webhook Handling**
   - Stripe sends `checkout.session.completed` event
   - Webhook verifies signature
   - Extracts metadata (project_id, capsule_id, etc.)
   - Updates database accordingly
   - Sends confirmation email

3. **Idempotency**
   - All webhook handlers check for existing records
   - Duplicate events are safely ignored

**Error Handling:**
- Failed payments return user to `/[project]?cancelled=true`
- Webhook failures are logged to console
- Database transactions prevent partial updates

---

## Email Delivery

**Provider**: Resend (transactional email API)

**Email Types:**

1. **Orbit 77 Credential Email**
   - Sent after successful donation
   - Contains credential code + archive link
   - Template: [`src/app/lib/email.ts`](src/app/lib/email.ts)

2. **EterniCapsule Sealing Confirmation**
   - Sent after payment
   - Contains sender key + capsule key
   - Template: [`src/app/lib/ethernicapsule-email.ts`](src/app/lib/ethernicapsule-email.ts)

3. **EterniCapsule Delivery Email**
   - Sent on delivery date
   - Contains message + unlock link
   - Template: [`src/app/lib/ethernicapsule-email.ts`](src/app/lib/ethernicapsule-email.ts)

4. **Figurines Transactional Emails**
   - Customer: Ritual receipt of forge initiation
   - Founder: Action required internally (contains geometry URLs and Shipping Address)
   - Template: [`src/app/lib/figurines-email.ts`](src/app/lib/figurines-email.ts)

**Features:**
- Dark mode + light mode HTML templates
- Mobile-responsive
- Branded headers/footers

---

## 3D Rendering

**Stack**: Three.js + React Three Fiber (R3F) + Drei

**Scenes:**

1. **Homepage Scene** ([`src/app/components/Scene.tsx`](src/app/components/Scene.tsx))
   - Floating particles (200)
   - Ambient light + point lights
   - Mouse parallax effect

2. **Projects Archaeological Scene** ([`src/app/projects/page.tsx`](src/app/projects/page.tsx))
   - Lantern cursor (spotlight following mouse)
   - Excavation nodes (artifacts buried at depths)
   - Ground plane with crack lines
   - Dust particles with GLSL shaders

3. **EterniCapsule 3D Monolith** ([`src/app/ethernicapsule/Capsule3D.tsx`](src/app/ethernicapsule/Capsule3D.tsx))
   - Animated monolith with breathing effect
   - State-based rendering (unsealed vs sealed)

**Optimization:**
- Dynamic imports with `ssr: false`
- Error boundaries for graceful degradation
- Mobile fallbacks where appropriate

**Common Pitfalls Solved:**
- Custom raycaster for lantern (not R3F's shared one)
- SpotLight target must be added to scene
- Clipping planes via `material.clippingPlanes`

---

## Deployment

**Platform**: Vercel

**Build Process:**
```bash
npm install
npm run build  # Next.js production build
```

**Environment Variables** (required in Vercel dashboard):
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`

**Cron Jobs**:
- Configured via [Vercel Cron](https://vercel.com/docs/cron-jobs)
- `/api/cron/ethernicapsule` runs daily at 00:00 UTC
- Protected by `CRON_SECRET` header

**Database Migrations**:
- Managed via Supabase dashboard or CLI
- Stored in [`supabase/migrations/`](supabase/migrations/)

**Monitoring**:
- Vercel Analytics (page views, performance)
- Stripe Dashboard (payments)
- Supabase Logs (database queries)

---

## Performance Considerations

1. **Bundle Size**
   - Three.js is ~600KB (unavoidable for 3D)
   - Dynamic imports reduce initial load
   - Tree-shaking enabled

2. **SSR + Client Hydration**
   - Static pages cached at edge
   - Client components hydrate progressively

3. **Database Queries**
   - Indexed columns for fast lookups
   - Select only required fields
   - Connection pooling via Supabase

4. **Image Optimization**
   - Next.js Image component (automatic optimization)
   - WebP format with fallbacks

---

## Future Evolution

### Phase 1: Experiencia (Current - 2026)
**Architecture:** Monolithic Next.js app with direct project sales

**Current state:**
- 4 projects in Galaxy exhibition
- Stripe for payments
- Supabase for data storage
- Direct user → project interaction

**Immediate improvements:**
- [ ] Add Sentry for error tracking
- [ ] Implement Redis for caching
- [ ] Add Lighthouse CI to test performance
- [ ] Generate Supabase types from schema
- [ ] Add E2E tests with Playwright
- [ ] Implement rate limiting middleware
- [ ] Add webhooks for real-time updates

---

### Phase 2: Ecosistema (2027)
**Architecture:** Multi-tenant platform with creator onboarding

**Required additions:**
- **Creator API** - External projects can integrate
- **Project Marketplace** - Acquire full projects or fractional stakes
- **Royalty Engine** - Automatic distribution to original creators
- **Multi-signature Contracts** - Shared ownership agreements

**New tables:**
```sql
CREATE TABLE creators (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE ecosystem_projects (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES creators(id),
  exhibition_id TEXT, -- 'jungle' | 'city'
  status TEXT, -- 'pending' | 'approved' | 'live'
  acquisition_model TEXT -- 'full' | 'fractional'
);

CREATE TABLE project_stakes (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES ecosystem_projects(id),
  owner_id UUID, -- Observer or Creator
  percentage DECIMAL,
  acquired_at TIMESTAMP
);
```

---

### Phase 3: Economía (2028+)
**Architecture:** Tokenized ecosystem with on-chain governance

**Required additions:**
- **Blockchain Integration** - Smart contracts for token
- **Credits System** - Internal currency (bridge to token)
- **Wallet Connect** - MetaMask, Rainbow, etc.
- **Governance Module** - Token-based voting
- **Staking System** - Rewards for long-term participants

**New infrastructure:**
- Solana/Ethereum smart contracts
- Token bridge service
- On-chain event listeners
- Voting snapshot system

---

**Last Updated**: April 2026
