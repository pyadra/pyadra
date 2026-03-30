# Contributing to Pyadra

> Guidelines for developers working on the Pyadra ecosystem

Thank you for your interest in contributing to Pyadra. This document provides guidelines and best practices for development.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Common Tasks](#common-tasks)

---

## Getting Started

### Prerequisites

- **Node.js**: v20.19+ (earlier 20.x may have compatibility issues with testing dependencies)
- **npm**: v10.2+
- **Git**: Latest stable version
- **Supabase CLI** (optional): For database migrations
- **Stripe CLI** (optional): For testing webhooks locally

### Initial Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/pyadra.git
   cd pyadra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your credentials:
   - **Supabase**: Create a project at [supabase.com](https://supabase.com)
   - **Stripe**: Get test keys from [dashboard.stripe.com](https://dashboard.stripe.com)
   - **Resend**: Get API key from [resend.com](https://resend.com)

4. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

5. **Verify tests pass**
   ```bash
   npm run test
   ```

---

## Development Workflow

### Branch Strategy

- `main` - Production branch (protected)
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### Typical Workflow

```bash
# 1. Create feature branch
git checkout -b feature/new-capsule-type

# 2. Make changes
# ... edit files ...

# 3. Run tests
npm run test

# 4. Check types
npx tsc --noEmit

# 5. Lint code
npm run lint

# 6. Commit changes
git add .
git commit -m "feat: add new capsule type for voice messages"

# 7. Push branch
git push origin feature/new-capsule-type

# 8. Open pull request on GitHub
```

---

## Code Standards

### TypeScript

- **Always use TypeScript** - No plain `.js` files
- **Avoid `any` types** - Use proper types or `unknown` if truly dynamic
- **Use type inference** - Don't over-annotate when TypeScript can infer
- **Export types** - Make types reusable across the codebase

**Good:**
```typescript
interface CapsuleData {
  sender: string;
  message: string;
  deliverAt: Date | null;
}

export function createCapsule(data: CapsuleData) {
  // Implementation
}
```

**Bad:**
```typescript
export function createCapsule(data: any) {
  // Implementation
}
```

### React Components

- **Prefer function components** - No class components (except ErrorBoundary)
- **Use hooks correctly** - Follow Rules of Hooks
- **Client vs Server** - Mark client components with `"use client"`
- **Memoization** - Use `useMemo` and `useCallback` for expensive operations

**Component Structure:**
```typescript
"use client"; // If using hooks/interactivity

import { useState, useEffect } from "react";

interface Props {
  title: string;
  onSubmit: (data: string) => void;
}

export default function MyComponent({ title, onSubmit }: Props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div>
      <h1>{title}</h1>
      {/* JSX */}
    </div>
  );
}
```

### Styling

- **Tailwind CSS** - Use utility classes
- **Custom CSS** - Only when Tailwind isn't sufficient
- **Responsive design** - Mobile-first approach
- **Dark theme** - Pyadra uses a dark aesthetic by default

**Examples:**
```tsx
// Good: Semantic, readable
<button className="px-4 py-2 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-colors">
  Submit
</button>

// Avoid: Inline styles unless absolutely necessary
<button style={{ backgroundColor: "#FFB000" }}>Submit</button>
```

### API Routes

- **Validate input** - Always sanitize and validate
- **Error handling** - Use try/catch and return proper status codes
- **Type safety** - Type request/response bodies
- **Security** - Never trust client input

**Template:**
```typescript
import { NextResponse } from "next/server";
import { sanitizeString } from "@/app/lib/validation";

export async function POST(req: Request) {
  try {
    const { field } = await req.json();

    // Validate
    if (!field) {
      return NextResponse.json(
        { error: "Missing required field" },
        { status: 400 }
      );
    }

    // Sanitize
    const cleanField = sanitizeString(field, 100);

    // Process
    // ...

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### File Naming

- **Components**: `PascalCase.tsx` (e.g., `ComposeForm.tsx`)
- **Utilities**: `camelCase.ts` (e.g., `validation.ts`)
- **API Routes**: `route.ts` (Next.js convention)
- **Tests**: `*.test.ts` or `*.test.tsx`

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

**Utilities** (Pure functions):
```typescript
// validation.test.ts
import { describe, it, expect } from 'vitest';
import { sanitizeString } from '../validation';

describe('sanitizeString', () => {
  it('should remove HTML tags', () => {
    expect(sanitizeString('<script>alert("xss")</script>hello')).toBe('alert("xss")hello');
  });

  it('should trim whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello');
  });
});
```

**API Routes**:
```typescript
// route.test.ts
import { describe, it, expect, vi } from 'vitest';
import { POST } from '../route';

describe('POST /api/example', () => {
  it('should return 400 if field is missing', async () => {
    const request = new Request('http://localhost:3000/api/example', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
```

**When to Write Tests:**
- ✅ Utility functions (validation, formatting, calculations)
- ✅ API routes (especially payment/email flows)
- ✅ Critical business logic
- ❌ Simple presentational components (unless complex state)
- ❌ Third-party library wrappers

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring (no feature/bug change)
- `test` - Adding/updating tests
- `chore` - Maintenance tasks (deps, config)

**Examples:**
```bash
feat(ethernicapsule): add voice message support

Add ability to attach voice recordings to capsules.
Users can record up to 2 minutes of audio.

Closes #123

---

fix(stripe): handle webhook timeout errors

Webhooks were failing silently on timeout.
Now logs error and retries via Stripe dashboard.

---

docs: update ARCHITECTURE.md with cron job details
```

### Commit Best Practices

- **One logical change per commit** - Don't mix unrelated changes
- **Write descriptive messages** - Explain *why*, not just *what*
- **Reference issues** - Use `Closes #123` or `Fixes #456`
- **Keep commits atomic** - Each commit should leave the code in a working state

---

## Pull Request Process

### Before Opening a PR

1. ✅ All tests pass (`npm run test`)
2. ✅ No TypeScript errors (`npx tsc --noEmit`)
3. ✅ No ESLint errors (`npm run lint`)
4. ✅ Code is formatted
5. ✅ Branch is up to date with `main`

### PR Description Template

```markdown
## Description
Brief summary of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested? What should reviewers verify?

## Screenshots (if applicable)
Attach screenshots for UI changes.

## Checklist
- [ ] Tests pass
- [ ] No TypeScript errors
- [ ] Documentation updated
- [ ] Reviewed my own code
```

### Review Process

1. **Self-review** - Review your own PR first
2. **Request review** - Tag relevant reviewers
3. **Address feedback** - Respond to all comments
4. **Merge** - Squash and merge when approved

---

## Project Structure

```
pyadra/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                # API routes
│   │   ├── components/         # Shared components
│   │   ├── ethernicapsule/     # EterniCapsule pages
│   │   ├── projects/           # Projects hub
│   │   ├── lib/                # Utilities
│   │   └── layout.tsx          # Root layout
│   └── middleware.ts           # Request middleware
├── public/                      # Static assets
├── supabase/
│   └── migrations/             # Database migrations
├── vitest.config.ts            # Test configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

**Key Directories:**
- `app/api/` - Backend API routes (server-side only)
- `app/lib/` - Utilities (db, email, validation)
- `app/components/` - Global UI components
- `app/[project]/` - Project-specific pages

---

## Common Tasks

### Adding a New API Route

1. Create file: `src/app/api/my-route/route.ts`
2. Implement handler:
   ```typescript
   export async function POST(req: Request) {
     // Implementation
   }
   ```
3. Add tests: `src/app/api/my-route/__tests__/route.test.ts`
4. Update ARCHITECTURE.md if needed

### Adding a New Page

1. Create file: `src/app/my-page/page.tsx`
2. Implement component
3. Add to navigation if needed
4. Test responsiveness

### Adding a Database Table

1. Create migration:
   ```bash
   cd supabase
   npx supabase migration new add_my_table
   ```
2. Write SQL in generated file
3. Apply locally:
   ```bash
   npx supabase db push
   ```
4. Update `database.types.ts` with new types
5. Deploy to production via Supabase dashboard

### Testing Stripe Webhooks Locally

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```
2. Login:
   ```bash
   stripe login
   ```
3. Forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy webhook secret to `.env.local`
5. Trigger test event:
   ```bash
   stripe trigger checkout.session.completed
   ```

### Debugging Production Issues

1. **Check Vercel logs** - Deployment logs in Vercel dashboard
2. **Check Supabase logs** - Database logs in Supabase dashboard
3. **Check Stripe logs** - Webhook logs in Stripe dashboard
4. **Add console.error** - Temporary debugging (remove before commit)

---

## Design Philosophy

### Ceremonial UX

Pyadra projects emphasize **intentionality and ritual**. When building features:

- ✅ Make actions feel **meaningful** (e.g., "seal" instead of "submit")
- ✅ Use **subtle animations** to create anticipation
- ✅ Prefer **minimal UI** with high contrast
- ✅ Use **432Hz audio** where appropriate
- ❌ Avoid gamification or dopamine-driven patterns
- ❌ Don't rush the user through flows

### Color Palette

- **Primary Gold**: `#FFB000` (actions, highlights)
- **Sacred Green**: `#39FF14` (Orbit 77 accent)
- **Warm Beige**: `#E3DAC9` (body text)
- **Deep Black**: `#000000` (backgrounds)
- **Stone Gray**: `#2D2926` (subtle elements)

### Typography

- **Serif**: Cormorant Garamond (headings, ceremonial text)
- **Mono**: System monospace (codes, technical info)
- **Sans**: System sans-serif (body text, UI)

---

## Getting Help

- **Architecture questions**: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Setup issues**: Check [README.md](./README.md)
- **Bug reports**: Open an issue on GitHub
- **Feature ideas**: Open a discussion on GitHub

---

## Code of Conduct

- **Be respectful** - Treat all contributors with respect
- **Be constructive** - Provide helpful feedback
- **Be patient** - Everyone is learning
- **Be collaborative** - We're building together

---

**Thank you for contributing to Pyadra. Your work helps build artifacts that last.**
