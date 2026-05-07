# Documentation Index

> Central hub for all Pyadra documentation

---

## 🎯 Quick Start

**New to Pyadra?** Read these in order:

1. **[VISION.md](../VISION.md)** ⭐ What Pyadra is and where it's going
2. **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Technical design and structure
3. **[QUICK_START.md](QUICK_START.md)** - Developer onboarding guide
4. **[README.md](../README.md)** - Project setup instructions

---

## 📚 Reference Documentation

### Core Technical Docs
- **[API_REFERENCE.md](API_REFERENCE.md)** - All API endpoints with examples
- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Complete schema with ERD
- **[COMPONENTS.md](COMPONENTS.md)** - UI component library reference
- **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)** - All env vars explained
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide

### User Experience Docs
- **[HOME_EXPERIENCE.md](HOME_EXPERIENCE.md)** - Observer initiation system

---

## 🎭 Project Nodes

Detailed specifications for each Pyadra project:

- **[nodes/ethernicapsule.md](nodes/ethernicapsule.md)** - Time-locked message vault ($9 AUD)
- **[nodes/orbit-77.md](nodes/orbit-77.md)** - Podcast platform with supporter funding
- **[nodes/figurines.md](nodes/figurines.md)** - Physical 3D-printed figurines ($150-200 AUD)
- **[nodes/ebook.md](nodes/ebook.md)** - Physical book publication (in development, Q3 2026)

---

## 📝 Changelog

**All technical changes** are documented chronologically:

- **[changelog/CHANGELOG.md](changelog/CHANGELOG.md)** ⭐ Master index
- **[changelog/](changelog/)** - Individual change documents

**Recent Changes:**
- [2026-05-05: Documentation Reorganization](changelog/2026-05-05_reorganization.md)
- [2026-04-07: Cleanup Summary](changelog/2026-04-07_cleanup-summary.md)
- [2026-04-07: Docs Reorganization](changelog/2026-04-07_docs-reorganization.md)
- [2026-04-06: URL Migration - Galaxy](changelog/2026-04-06_url-migration-galaxy.md)
- [2026-04-06: Project Audit](changelog/2026-04-06_project-audit.md)

---

## 🗄️ Archive

Historical documentation (reference only):

- **[archive/](archive/)** - Completed plans, old checklists, refactoring logs
  - `PRE_DEPLOYMENT_CHECKLIST.md` (April 22, 2026)
  - `DESIGN_AUDIT.md` (April 30, 2026)
  - `ORBIT_77_IMPROVEMENT_PLAN.md` (April 14, 2026)
  - `refactoring/` - March 2026 refactoring logs

---

## 📖 Documentation Structure

```
docs/
├── README.md                      # This file (documentation index)
├── QUICK_START.md                 # Developer onboarding
├── API_REFERENCE.md               # API endpoints
├── DATABASE_SCHEMA.md             # Database schema
├── COMPONENTS.md                  # UI components
├── ENVIRONMENT_VARIABLES.md       # Env vars
├── DEPLOYMENT.md                  # Deployment guide
├── HOME_EXPERIENCE.md             # Home page docs
│
├── nodes/                         # Project specifications
│   ├── ethernicapsule.md
│   ├── orbit-77.md
│   ├── figurines.md
│   └── ebook.md
│
├── changelog/                     # Technical changelog
│   ├── CHANGELOG.md               # Master index
│   ├── README.md                  # How to use
│   └── 2026-*.md                  # Change documents
│
└── archive/                       # Historical/completed
    ├── PRE_DEPLOYMENT_CHECKLIST.md
    ├── DESIGN_AUDIT.md
    ├── ORBIT_77_IMPROVEMENT_PLAN.md
    └── refactoring/               # Old refactoring logs
```

---

## 🎯 Common Tasks

### For New Developers

1. Read **[VISION.md](../VISION.md)** ⭐ (understand philosophy)
2. Read **[ARCHITECTURE.md](../ARCHITECTURE.md)** (understand tech)
3. Read **[QUICK_START.md](QUICK_START.md)** (setup environment)
4. Check **[changelog/CHANGELOG.md](changelog/CHANGELOG.md)** (recent changes)
5. Read relevant project node doc

### For Deployment

1. Review **[DEPLOYMENT.md](DEPLOYMENT.md)**
2. Apply database migrations from `../supabase/migrations/`
3. Configure environment variables (see **[ENVIRONMENT_VARIABLES.md](ENVIRONMENT_VARIABLES.md)**)
4. Set up Stripe webhooks
5. Verify all API routes work

### For Understanding Codebase

1. **[VISION.md](../VISION.md)** - Overall concept
2. **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Technical design
3. **[COMPONENTS.md](COMPONENTS.md)** - UI component library
4. **[API_REFERENCE.md](API_REFERENCE.md)** - Backend APIs
5. **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Data models

### For AI Agents / LLMs

**Required reading order:**
1. **[VISION.md](../VISION.md)** - Core philosophy (mandatory, read first)
2. **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Technical architecture
3. **[QUICK_START.md](QUICK_START.md)** - Project structure
4. Relevant project node doc (e.g., `nodes/ethernicapsule.md`)
5. **[changelog/CHANGELOG.md](changelog/CHANGELOG.md)** - Recent changes

**Important context:**
- Pyadra is a digital museum with exhibitions (not a typical SaaS)
- Current structure: Home → Exhibitions → Galaxy → Projects
- Users are called "Observers" (not users/customers)
- Phase 1 = Museum (2026), Phase 2 = Marketplace (2027), Phase 3 = Economy (2028+)
- See **[VISION.md](../VISION.md)** for Strategic Identity Evolution

---

## 📊 Documentation Stats

**Total Documentation Files**: 18 markdown files  
**Structure**: 
- 7 core reference docs
- 4 project node specs
- 8 changelog entries
- 4 archived docs

**Coverage**: Philosophy, technical architecture, API reference, database schema, deployment, individual projects, historical changes

**Maintenance**:
- Update **[changelog/CHANGELOG.md](changelog/CHANGELOG.md)** when making technical changes
- Keep **[DEPLOYMENT.md](DEPLOYMENT.md)** current with deployment steps
- Archive completed plans/checklists in **[archive/](archive/)**
- Update project node docs when features change

---

## 🔗 External Links

- **Production**: [pyadra.io](https://pyadra.io)
- **Database**: [Supabase Dashboard](https://app.supabase.com)
- **Payments**: [Stripe Dashboard](https://dashboard.stripe.com)
- **Hosting**: [Vercel Dashboard](https://vercel.com)

---

**Last updated**: May 7, 2026  
**Total documentation files**: 18 (reorganized)
