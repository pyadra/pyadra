# Project Audit: Pyadra Structure Review

**Date**: April 6, 2026  
**Scope**: Complete project structure, organization, coherence, and gaps  
**Auditor**: Post-migration review

---

## Executive Summary

**Overall Status**: ✅ Good structure with minor gaps  
**Critical Issues**: 🔴 2 missing database migrations  
**Recommendations**: 🟡 Cleanup and reorganization needed

---

## 1. Root Directory Structure

### ✅ GOOD - Well Organized

```
pyadra/
├── src/                    # Application code
├── public/                 # Static assets
├── supabase/              # Database migrations
├── docs/                   # Documentation
├── .github/               # CI/CD configs
├── VISION.md              # Core philosophy ⭐
├── ARCHITECTURE.md        # Technical design
├── README.md              # Getting started
├── CONTRIBUTING.md        # Dev guidelines
├── package.json           # Dependencies
└── *.config.{js,ts}       # Build configs
```

**Strengths:**
- Clear separation of concerns
- Documentation at root level
- Standard Next.js structure

**Issues:**
- `STABILITY_REVIEW.md` at root (should be in docs/)
- `.DS_Store` tracked (should be in .gitignore)
- `tsconfig.tsbuildinfo` tracked (should be in .gitignore)

---

## 2. Source Code Structure (`src/app`)

### ✅ EXCELLENT - Clean Organization

```
src/app/
├── api/                           # API routes (Stripe, Supabase)
│   ├── applications/             # Orbit applications
│   ├── donate/                   # Orbit donations
│   ├── ethernicapsule/          # EterniCapsule APIs
│   ├── figurines/               # Figurines APIs
│   ├── home/                    # Home page APIs
│   ├── observer/                # Observer system
│   ├── observers/               # Observer queries
│   ├── session/                 # Session management
│   ├── stats/                   # Analytics
│   └── stripe/                  # Stripe webhooks
├── exhibitions/                   # Exhibition system ⭐
│   ├── page.tsx                 # Exhibition selector
│   └── galaxy/                  # Galaxy exhibition (MVP1)
│       ├── page.tsx             # 3D navigation scene
│       ├── EcosystemCanvas.tsx  # 3D renderer
│       ├── ethernicapsule/      # Time-locked messages
│       ├── orbit/               # Podcast + funding
│       └── figurines/           # Digital artifacts
├── archive/[id]/                 # Public archive viewer
├── components/                   # Global components
├── legal/                        # Privacy, Terms
│   ├── privacy/
│   └── terms/
├── lib/                          # Utilities
│   ├── __tests__/               # Unit tests
│   ├── db.ts                    # Supabase client
│   ├── ethernicapsule-email.ts  # Email templates
│   └── figurines-email.ts       # Email templates
├── manifesto/                    # Manifesto page
├── transmission-confirmed/       # Donation success
├── page.tsx                      # Home (Observer initiation)
├── layout.tsx                    # Root layout
├── globals.css                   # Global styles
├── providers.tsx                 # Context providers
└── middleware.ts                 # Request middleware
```

**Strengths:**
- Exhibitions structure is coherent
- Clear API organization by feature
- Lib utilities well separated

**Issues:**
- None identified ✓

---

## 3. Documentation Structure (`docs/`)

### 🟡 GOOD - Needs Minor Cleanup

```
docs/
├── README.md                      # Docs index
├── HOME_EXPERIENCE.md             # Home page docs
├── ETERNICAPSULE_NODE.md          # EterniCapsule context
├── ORBIT_NODE.md                  # Orbit context
├── FIGURINES_NODE.md              # Figurines context
├── URL_MIGRATION.md               # April 2026 migration
├── deployment/                    # Deployment guides
│   ├── DEPLOYMENT_SUMMARY.md
│   ├── PRE_PRODUCTION_CHECKLIST.md
│   ├── READY_FOR_PRODUCTION.md
│   └── CRON_SETUP.md
├── features/                      # Feature docs
│   └── ON_DEMAND_DELIVERY.md
├── refactoring/                   # Historical refactors
│   ├── REFACTORING_AUDIT.md
│   ├── REFACTORING_COMPLETE.md
│   ├── FINAL_VERIFICATION.md
│   └── STABILIZATION_SUMMARY.md
├── security/                      # Security audits
│   └── SECURITY_AUDIT.md
└── migrations/                    # ⚠️ OUT OF PLACE
    └── add_guardian_token.sql     # Should be in supabase/
```

**Strengths:**
- Well organized by category
- Clear node documentation
- Migration history preserved

**Issues:**
1. `docs/migrations/add_guardian_token.sql` should be in `supabase/migrations/`
2. Refactoring docs are historical - consider archiving
3. Missing: `GALAXY_EXHIBITION.md` (to match node docs pattern)

**Recommendations:**
- Move SQL migration to supabase/
- Create `docs/archive/` for old refactoring docs
- Add exhibition-level documentation

---

## 4. Database Migrations (`supabase/migrations/`)

### 🔴 CRITICAL GAPS - Missing Tables

**Existing Migrations:**
```
0000_orbit_support_credentials.sql  ✓
0001_orbit_supporters.sql           ✓
0002_ethernicapsule_capsules.sql    ✓
0003_observers_and_scans.sql        ✓
```

**Tables Used in Code:**
1. ✅ `orbit_support_credentials` (migration 0000)
2. ✅ `orbit_supporters` (migration 0001)
3. ✅ `ethernicapsule_capsules` (migration 0002)
4. ✅ `observers` (migration 0003)
5. ✅ `home_scans` (migration 0003)
6. 🔴 `orbit_applications` (NO MIGRATION)
7. 🔴 `figurine_orders` (NO MIGRATION)

**Missing Migrations:**

### 1. `orbit_applications` Table
Referenced in: `src/app/api/applications/route.ts`
```typescript
.from('orbit_applications')
```
**Status**: 🔴 Used in code but no migration exists

### 2. `figurine_orders` Table
Referenced in:
- `src/app/api/figurines/checkout/route.ts`
- `src/app/api/figurines/upload/route.ts`
- `src/app/api/stripe/webhook/route.ts`

**Status**: 🔴 Used in code but no migration exists

### 3. Guardian Token Hash Column
Located: `docs/migrations/add_guardian_token.sql`
```sql
ALTER TABLE ethernicapsule_capsules
ADD COLUMN IF NOT EXISTS guardian_token_hash TEXT;
```
**Status**: 🔴 Migration exists in wrong location

---

## 5. Public Assets (`public/`)

### 🟡 NEEDS CLEANUP

**Current Structure:**
```
public/
├── figurines/              # Figurine assets
├── orbit-logo.png         # Orbit 77 logo
├── file.svg               # ⚠️ Unused Next.js default
├── globe.svg              # ⚠️ Unused Next.js default
├── next.svg               # ⚠️ Unused Next.js default
├── vercel.svg             # ⚠️ Unused Next.js default
└── window.svg             # ⚠️ Unused Next.js default
```

**Recommendations:**
- Delete unused Next.js default SVGs
- Create subfolders for organization:
  ```
  public/
  ├── logos/               # Brand assets
  ├── figurines/          # Figurine images
  └── exhibitions/        # Exhibition-specific assets
  ```

---

## 6. Configuration Files

### ✅ STANDARD - No Issues

```
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── next.config.ts         # Next.js config
├── tailwind.config.js     # Tailwind CSS
├── postcss.config.js      # PostCSS
├── eslint.config.mjs      # ESLint
├── vitest.config.ts       # Vitest testing
└── vitest.setup.ts        # Test setup
```

**Status**: All standard, well configured ✓

---

## 7. Coherence Analysis

### URL Structure
✅ **EXCELLENT** - Post-migration coherence

```
/ → home (Observer initiation)
  ↓
/exhibitions → Exhibition selector
  ↓
/exhibitions/galaxy → 3D navigation
  ↓
/exhibitions/galaxy/{project} → Individual projects
```

**Strengths:**
- Clear hierarchy
- Semantic URLs
- Scalable structure

### Database Schema
🔴 **INCOMPLETE** - Missing migrations

**Tables exist in code but not in migrations:**
- `orbit_applications`
- `figurine_orders`

**Risk**: Database schema drift between environments

### Documentation Coverage
🟡 **PARTIAL**

**Well documented:**
- ✅ VISION.md (core philosophy)
- ✅ ARCHITECTURE.md (system design)
- ✅ HOME_EXPERIENCE.md (home page)
- ✅ Node docs (EterniCapsule, Orbit, Figurines)
- ✅ URL_MIGRATION.md (recent changes)

**Missing:**
- ❌ GALAXY_EXHIBITION.md (exhibition-level docs)
- ❌ API documentation (endpoints, contracts)
- ❌ Component documentation (3D canvas, forms)
- ❌ Testing documentation (how to write tests)

---

## 8. Missing Pieces

### Critical (Must Fix)
1. 🔴 **Database Migrations**
   - Create `0004_orbit_applications.sql`
   - Create `0005_figurine_orders.sql`
   - Move `add_guardian_token.sql` → `0006_guardian_token_hash.sql`

2. 🔴 **Git Ignores**
   - Add `.DS_Store` to .gitignore
   - Add `tsconfig.tsbuildinfo` to .gitignore

### Important (Should Add)
3. 🟡 **Documentation Gaps**
   - Create `docs/GALAXY_EXHIBITION.md`
   - Create `docs/API.md` (API reference)
   - Create `docs/TESTING.md` (testing guide)

4. 🟡 **Organization**
   - Move `STABILITY_REVIEW.md` to `docs/`
   - Archive old refactoring docs
   - Clean up unused public assets

### Nice to Have
5. 🟢 **Improvements**
   - Create `docs/COMPONENTS.md` (component library)
   - Add TypeScript strict mode
   - Add pre-commit hooks (husky)

---

## 9. Recommendations Priority

### 🔴 PRIORITY 1 (Critical - Do Now)

1. **Create Missing Database Migrations**
   ```bash
   # Create these files:
   supabase/migrations/0004_orbit_applications.sql
   supabase/migrations/0005_figurine_orders.sql
   supabase/migrations/0006_guardian_token_hash.sql
   ```

2. **Update .gitignore**
   ```
   .DS_Store
   *.tsbuildinfo
   ```

3. **Move Misplaced Migration**
   ```bash
   mv docs/migrations/add_guardian_token.sql \
      supabase/migrations/0006_guardian_token_hash.sql
   ```

### 🟡 PRIORITY 2 (Important - This Week)

4. **Clean Documentation Structure**
   - Move `STABILITY_REVIEW.md` to `docs/archive/`
   - Create `docs/archive/` for historical refactoring docs
   - Create `docs/GALAXY_EXHIBITION.md`

5. **Clean Public Assets**
   - Delete unused Next.js default SVGs
   - Organize into subfolders

### 🟢 PRIORITY 3 (Nice to Have - Future)

6. **Expand Documentation**
   - API reference
   - Testing guide
   - Component library

7. **Developer Experience**
   - Pre-commit hooks
   - Stricter TypeScript config
   - Automated tests in CI

---

## 10. Final Assessment

### Strengths ✅
- **Excellent code organization** (exhibitions structure)
- **Clear documentation** (VISION.md, node docs)
- **Well-structured API routes**
- **Clean URL hierarchy**

### Weaknesses 🔴
- **Missing database migrations** (critical gap)
- **Inconsistent migration location** (docs vs supabase)
- **Unused files tracked in git**
- **Documentation gaps** (API, testing, exhibitions)

### Overall Grade: **B+ (Good, needs minor fixes)**

**Recommendation**: Fix Priority 1 items immediately before next deployment. Priority 2 items can be addressed this week. Priority 3 is optional enhancement.

---

Last updated: April 6, 2026  
Next review: After Priority 1 fixes applied
