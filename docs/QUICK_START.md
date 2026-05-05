# Quick Start Guide

**Welcome to Pyadra** — A digital museum for permanent artifacts of human memory.

This guide helps new developers understand the project structure and where to start.

---

## 📖 Reading Order (First 60 Minutes)

Follow this sequence to understand Pyadra from philosophy → architecture → implementation:

### 1. **VISION.md** (15 minutes)
**Location**: `/VISION.md`  
**Purpose**: Understand the philosophical foundation and what Pyadra is

**Read this to learn**:
- Why Pyadra exists (permanent memory, not temporary social media)
- The museum metaphor (exhibitions, not feeds)
- Project philosophy (intentional creation, ritual)
- High-level project structure

**Key Concept**: Pyadra is a museum with themed exhibitions (Galaxy, Jungle, City). Each exhibition contains multiple projects.

---

### 2. **ARCHITECTURE.md** (20 minutes)
**Location**: `/ARCHITECTURE.md`  
**Purpose**: Technical implementation details

**Read this to learn**:
- Tech stack (Next.js 14, React 19, TypeScript, Supabase, Stripe)
- Directory structure (`/src/app/exhibitions/galaxy/[project]`)
- Database schema overview
- API routes organization
- Security model (CSP, middleware)

**Key Concept**: App Router structure, each project is a subdirectory under `/exhibitions/galaxy/`

---

### 3. **Project-Specific Documentation** (10-15 minutes each)
**Location**: `/docs/nodes/`

Choose the project you'll work on:

- **EterniCapsule** (`/docs/nodes/ethernicapsule.md`) - Time-locked messages with cryptographic keys
- **Orbit 77** (`/docs/nodes/orbit-77.md`) - Podcast platform with supporter funding
- **Figurines** (`/docs/nodes/figurines.md`) - Physical 3D-printed figurines from selfies
- **EBOK** (`/docs/nodes/ebook.md`) - Physical book publication system

**Read this to learn**:
- User flow for that specific project
- Technical implementation details
- Database tables used
- Payment/checkout flow
- Email notifications

---

### 4. **CONTRIBUTING.md** (10 minutes)
**Location**: `/CONTRIBUTING.md`  
**Purpose**: Development workflow and guidelines

**Read this to learn**:
- Git workflow
- Code style guidelines
- How to run locally
- How to test
- How to deploy

---

## 🚀 Getting Started (Development Setup)

### Prerequisites
```bash
node >= 18.x
npm >= 9.x
```

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Fill in required API keys:
   - `NEXT_PUBLIC_SUPABASE_URL` - From Supabase dashboard
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase dashboard
   - `SUPABASE_SERVICE_ROLE_KEY` - From Supabase dashboard (API settings)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From Stripe dashboard
   - `STRIPE_SECRET_KEY` - From Stripe dashboard
   - `STRIPE_WEBHOOK_SECRET` - From Stripe webhook settings
   - `RESEND_API_KEY` - From Resend.com dashboard

See `/docs/ENVIRONMENT_VARIABLES.md` for detailed explanations.

### Install & Run
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
open http://localhost:3000
```

### First Changes
1. Navigate to `/src/app/page.tsx` - Home page
2. Navigate to `/src/app/exhibitions/galaxy/page.tsx` - Galaxy exhibition selector
3. Navigate to `/src/app/exhibitions/galaxy/[project]/page.tsx` - Individual projects

---

## 📁 Project Structure Overview

```
pyadra/
├── src/app/
│   ├── api/                    # API routes (17 endpoints)
│   │   ├── ethernicapsule/     # Capsule-specific routes
│   │   ├── figurines/          # Figurines-specific routes
│   │   ├── orbit/              # Orbit-specific routes (stats, applications)
│   │   └── stripe/             # Stripe webhook handler
│   │
│   ├── components/             # Reusable UI components
│   │   ├── 3d/                 # Three.js components (Scene, PyadraStone3D)
│   │   ├── interactive/        # Interactive components (ParticleDecoder, CustomCursor)
│   │   ├── audio/              # Audio components (AmbientAudio)
│   │   └── util/               # Utility components (ErrorBoundary, AnimatedNumber)
│   │
│   ├── exhibitions/            # Exhibition structure
│   │   └── galaxy/             # Galaxy exhibition (MVP1)
│   │       ├── ethernicapsule/ # Time-locked messages project
│   │       ├── orbit/          # Podcast platform project
│   │       ├── figurines/      # 3D figurines project
│   │       ├── components/     # Shared exhibition components
│   │       └── page.tsx        # Exhibition selector (3 doors)
│   │
│   ├── lib/                    # Utilities and helpers
│   │   ├── db.ts               # Database client (Supabase)
│   │   ├── email.ts            # Email utilities (Orbit)
│   │   ├── ethernicapsule-email.ts # Capsule emails
│   │   ├── figurines-email.ts  # Figurines emails
│   │   ├── validation.ts       # Input validation/sanitization
│   │   └── __tests__/          # Unit tests
│   │
│   ├── legal/, manifesto/      # Static informational pages
│   ├── archive/                # Supporter archive page (Orbit)
│   ├── page.tsx                # Home page (Observer system)
│   ├── layout.tsx              # Root layout
│   └── middleware.ts           # Security headers, redirects
│
├── docs/                       # Documentation
│   ├── nodes/                  # Project-specific docs
│   ├── changelog/              # Change history
│   └── archive/                # Historical reference
│
├── supabase/migrations/        # Database migrations
└── public/                     # Static assets
```

---

## 🎯 Common Tasks

### Adding a New API Route
1. Create file: `/src/app/api/[name]/route.ts`
2. Export `POST` or `GET` function
3. Use Supabase client from `lib/db.ts`
4. Return `NextResponse.json()`

Example:
```typescript
import { NextResponse } from "next/server";
import { getSupabase } from "@/app/lib/db";

export async function POST(req: Request) {
  const { data } = await req.json();
  const supabase = getSupabase();
  // ... your logic
  return NextResponse.json({ success: true });
}
```

### Adding a New Component
1. Create file in appropriate category:
   - 3D component → `/src/app/components/3d/MyComponent.tsx`
   - Interactive → `/src/app/components/interactive/MyComponent.tsx`
2. Export as default
3. Import where needed: `import MyComponent from "@/app/components/3d/MyComponent"`

### Adding a New Page
1. Create file: `/src/app/[route]/page.tsx`
2. Export default React component
3. Add metadata export for SEO
4. Use `"use client"` directive if needed

### Running Tests
```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

---

## 📚 Additional Documentation

After reading the core documents above, reference these as needed:

- **API Reference** (`/docs/API_REFERENCE.md`) - All API endpoints with request/response examples
- **Database Schema** (`/docs/DATABASE_SCHEMA.md`) - Complete schema with relationships
- **Components** (`/docs/COMPONENTS.md`) - UI component library reference
- **Deployment** (`/docs/DEPLOYMENT.md`) - Production deployment guide
- **Environment Variables** (`/docs/ENVIRONMENT_VARIABLES.md`) - All env var explanations

---

## 🆘 Getting Help

1. **Check existing docs** - Most questions answered in ARCHITECTURE.md or project-specific docs
2. **Check code comments** - Critical sections have inline documentation
3. **Check tests** - `__tests__/` folders show usage examples
4. **Ask the team** - Reach out in #pyadra-dev channel

---

## ✅ Next Steps

Now that you've read the overview:

1. **Set up your local environment** (see "Getting Started" above)
2. **Pick a project to work on** (EterniCapsule, Orbit, Figurines, or EBOK)
3. **Read that project's documentation** (`/docs/nodes/[project].md`)
4. **Make your first change** - Start with something small (UI text, styling)
5. **Run tests** - Ensure nothing broke
6. **Create a PR** - Follow guidelines in CONTRIBUTING.md

Welcome to Pyadra! 🚀
