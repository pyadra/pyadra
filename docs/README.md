# Documentation Index

> Central hub for all Pyadra documentation

---

## 🎯 Quick Start

**New to Pyadra?** Read these in order:

1. **[VISION.md](../VISION.md)** ⭐ What Pyadra is and where it's going
2. **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Technical design and structure
3. **[README.md](../README.md)** - Project setup and getting started

---

## 📝 Technical Changelog

**All technical changes** are documented chronologically:

- **[CHANGELOG.md](changelog/CHANGELOG.md)** ⭐ Master index of all changes
- **[changelog/](changelog/)** - Individual change documents

**Recent**:
- [2026-04-07: Cleanup Summary](changelog/2026-04-07_cleanup-summary.md)
- [2026-04-06: URL Migration - Galaxy](changelog/2026-04-06_url-migration-galaxy.md)
- [2026-04-06: Project Audit](changelog/2026-04-06_project-audit.md)
- [2026-03-31: On-Demand Delivery](changelog/2026-03-31_on-demand-delivery.md)

---

## 🎭 Project Documentation

Detailed docs for each Pyadra experience:

- **[Home Experience](HOME_EXPERIENCE.md)** - Observer initiation system
- **[EterniCapsule Node](ETERNICAPSULE_NODE.md)** - Time-locked message vault
- **[Orbit 77 Node](ORBIT_NODE.md)** - Collective funding expedition
- **[Figurines Node](FIGURINES_NODE.md)** - Digital artifact forging

---

## 🚀 Deployment

Production deployment guide:

- **[DEPLOYMENT.md](DEPLOYMENT.md)** ⭐ Complete deployment checklist

**Includes**:
- Pre-deployment checklist
- Environment variables
- Stripe configuration
- Database migrations
- Post-deployment verification
- Rollback procedures

---

## 🗄️ Database

**Migrations**: All SQL migrations are in [`supabase/migrations/`](../supabase/migrations/)

**Current Schema** (7 tables):
```
0000_orbit_support_credentials.sql
0001_orbit_supporters.sql
0002_ethernicapsule_capsules.sql
0003_observers_and_scans.sql
0004_orbit_applications.sql
0005_figurine_orders.sql
0006_guardian_token_hash.sql
```

---

## 🗂️ Archive

Historical documentation (reference only):

- **[archive/refactoring/](archive/refactoring/)** - Pre-changelog refactoring logs (March 2026)

---

## 📖 Documentation Structure

```
docs/
├── README.md                      # This file
├── DEPLOYMENT.md                  # Deployment guide
├── HOME_EXPERIENCE.md            # Home page docs
├── ETERNICAPSULE_NODE.md         # EterniCapsule docs
├── ORBIT_NODE.md                 # Orbit docs
├── FIGURINES_NODE.md             # Figurines docs
├── changelog/                     # Technical changelog
│   ├── CHANGELOG.md              # Master index
│   ├── README.md                 # How to use
│   └── 2026-*.md                # Change documents
└── archive/                       # Historical
    └── refactoring/              # Old refactoring logs
```

---

## 🎯 Common Tasks

### For New Developers

1. Read [VISION.md](../VISION.md) ⭐
2. Read [ARCHITECTURE.md](../ARCHITECTURE.md)
3. Read [README.md](../README.md) for setup
4. Check [CHANGELOG.md](changelog/CHANGELOG.md) for recent changes
5. Read relevant node docs

### For Deployment

1. Review [DEPLOYMENT.md](DEPLOYMENT.md)
2. Apply database migrations from [supabase/migrations/](../supabase/migrations/)
3. Configure environment variables
4. Set up Stripe webhooks

### For Understanding Structure

1. Read [VISION.md](../VISION.md) for overall concept
2. Check [ARCHITECTURE.md](../ARCHITECTURE.md) for technical design
3. See [CHANGELOG.md](changelog/CHANGELOG.md) for evolution

### For AI Agents / LLMs

**Required reading**:
1. [VISION.md](../VISION.md) - Core philosophy (mandatory)
2. [CHANGELOG.md](changelog/CHANGELOG.md) - Recent changes
3. Relevant node docs ([HOME_EXPERIENCE.md](HOME_EXPERIENCE.md), [ETERNICAPSULE_NODE.md](ETERNICAPSULE_NODE.md), etc.)

**Context**:
- Pyadra is a digital museum with exhibitions (not a typical SaaS)
- Current structure: Home → Exhibitions → Galaxy → Projects
- Observatory system (not "users")
- See VISION.md for full context

---

## 📊 Documentation Stats

**Total Files**: 13 markdown files  
**Structure**: 3 folders (root, changelog, archive)  
**Coverage**: Core philosophy, technical changes, deployment, individual projects

**Maintenance**:
- Update [CHANGELOG.md](changelog/CHANGELOG.md) when making technical changes
- Keep [DEPLOYMENT.md](DEPLOYMENT.md) current with deployment steps
- Archive old refactoring logs in [archive/](archive/)

---

## 🔗 External Links

- **Production**: [pyadra.io](https://pyadra.io)
- **Repository**: GitHub (private)
- **Database**: [Supabase Dashboard](https://app.supabase.com)
- **Payments**: [Stripe Dashboard](https://dashboard.stripe.com)
- **Hosting**: [Vercel Dashboard](https://vercel.com)

---

**Last updated**: April 7, 2026  
**Total documentation files**: 13
