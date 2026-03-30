# Documentation Index

Welcome to the Pyadra project documentation.

---

## 📚 Main Documentation

Start here for project overview:
- **[Project Architecture](../ARCHITECTURE.md)** - Complete system architecture and design
- **[Contributing Guide](../CONTRIBUTING.md)** - How to contribute to the project
- **[Main README](../README.md)** - Project overview and quick start

---

## 🚀 Deployment

Everything you need to deploy to production:

- **[Deployment Summary](deployment/DEPLOYMENT_SUMMARY.md)** - Complete deployment overview (START HERE)
- **[Ready for Production](deployment/READY_FOR_PRODUCTION.md)** - Production readiness checklist
- **[Pre-Production Checklist](deployment/PRE_PRODUCTION_CHECKLIST.md)** - Detailed pre-deploy checklist
- **[Cron Setup](deployment/CRON_SETUP.md)** - ⚠️ DEPRECATED (now using on-demand delivery)

---

## ✨ Features

Documentation for specific features:

- **[On-Demand Delivery System](features/ON_DEMAND_DELIVERY.md)** - Guardian key delivery without cron jobs

---

## 🔐 Security

Security audits and guidelines:

- **[Security Audit](security/SECURITY_AUDIT.md)** - Complete security review and analysis

---

## 🔄 Refactoring History

Historical documentation of major refactorings:

- **[Refactoring Complete](refactoring/REFACTORING_COMPLETE.md)** - Project restructure completion
- **[Refactoring Audit](refactoring/REFACTORING_AUDIT.md)** - Code cleanup audit
- **[Stabilization Summary](refactoring/STABILIZATION_SUMMARY.md)** - Stabilization work summary
- **[Final Verification](refactoring/FINAL_VERIFICATION.md)** - Pre-production verification

---

## 🗄️ Database

Database migrations and schema:

- **[Migrations](migrations/)** - SQL migration files
  - `add_guardian_token.sql` - Add guardian token for on-demand delivery

---

## 📖 Quick Links

### For New Developers
1. Read [CONTRIBUTING.md](../CONTRIBUTING.md)
2. Review [ARCHITECTURE.md](../ARCHITECTURE.md)
3. Check [deployment/DEPLOYMENT_SUMMARY.md](deployment/DEPLOYMENT_SUMMARY.md)

### For Deployment
1. Check [deployment/READY_FOR_PRODUCTION.md](deployment/READY_FOR_PRODUCTION.md)
2. Follow [deployment/PRE_PRODUCTION_CHECKLIST.md](deployment/PRE_PRODUCTION_CHECKLIST.md)
3. Run migrations from [migrations/](migrations/)

### For Features
1. See [features/](features/) for feature documentation
2. On-demand delivery: [features/ON_DEMAND_DELIVERY.md](features/ON_DEMAND_DELIVERY.md)

---

**Last updated**: March 31, 2026
