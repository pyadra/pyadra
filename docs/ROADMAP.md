# Pyadra Roadmap & Technical Improvements

> Priority levels: **P0** (Critical), **P1** (High), **P2** (Medium), **P3** (Low)

---

## 🔐 Security & Testing

### P0 - Critical
- [ ] **Security audit/penetration testing** (Est: 16-24h, $2000-3000 USD external audit)
  - Input validation review across all forms
  - SQL injection testing (Supabase queries)
  - XSS vulnerability scan
  - Stripe webhook signature verification audit
  
- [ ] **Rate limiting implementation** (Est: 8-12h, $800-1200 USD)
  - `/api/observer` - 10 req/hour per IP
  - `/api/applications` - 5 req/hour per IP
  - `/api/donate` - 20 req/hour per IP
  - `/api/ethernicapsule/checkout` - 10 req/hour per IP

### P2 - Medium
- [ ] **E2E testing with Playwright** (Est: 24-32h, $2400-3200 USD)
  - Critical user flows: capsule creation, checkout, unlock
  - Cross-browser testing (Chrome, Firefox, Safari)
  - Mobile responsiveness tests

---

## 🏗️ Architecture & Code Quality

### P1 - High
- [ ] **Split Stripe webhook handler by project** (Est: 12-16h, $1200-1600 USD)
  - Currently monolithic `/api/stripe/webhook`
  - Required for project independence/selling
  - Create separate handlers per project

### P2 - Medium
- [ ] **Database migration scripts for multi-tenancy** (Est: 8-12h, $800-1200 USD)
  - Prepare for Phase 2 project extraction
  - Document separation strategy per node

### P3 - Low
- [ ] **Move `/app/lib/` to `/src/lib/`** (Est: 8-12h, $800-1200 USD)
  - Better Next.js convention adherence
  - Low priority - current structure works

- [ ] **Move `/app/components/` to `/src/components/`** (Est: 2-3h, $200-300 USD)
  - Cleaner project structure
  - Low priority - current structure works

---

## 🚀 Phase 2 Preparation

### P1 - High
- [ ] **Project extraction documentation** (Est: 12-16h, $1200-1600 USD)
  - Per-project deployment guides
  - Dependency mapping (shared code → duplicated code)
  - Environment variable templates

- [ ] **Copy-paste deployability architecture** (Est: 36-42h, $3600-4200 USD)
  - Extract EterniCapsule as standalone (12-14h)
  - Extract Orbit 77 as standalone (10-12h)
  - Extract Figurines as standalone (14-16h)
  - See ARCHITECTURE.md project independence analysis

### P2 - Medium
- [ ] **Acquisition transaction flow** (Est: 40-60h, $4000-6000 USD)
  - Smart contract or escrow system for project transfers
  - Ownership verification system
  - Revenue tracking per project post-acquisition

---

## 🎨 UX & Performance

### P1 - High
- [ ] **Mobile experience audit** (Est: 16-24h, $1600-2400 USD)
  - 3D scenes performance on mobile
  - Touch interaction optimization
  - Galaxy grid mobile layout

### P2 - Medium
- [ ] **Lighthouse optimization** (Est: 8-12h, $800-1200 USD)
  - Target: >90 performance score
  - Image optimization (WebP conversion)
  - Bundle size reduction

- [ ] **Accessibility audit (WCAG AA)** (Est: 12-16h, $1200-1600 USD)
  - Keyboard navigation
  - Screen reader compatibility
  - Color contrast improvements

### P3 - Low
- [ ] **Loading states refinement** (Est: 4-6h, $400-600 USD)
  - Skeleton screens
  - Optimistic UI updates
  - Error state designs

---

## 📊 Analytics & Monitoring

### P1 - High
- [ ] **Error tracking system (Sentry)** (Est: 4-6h, $400-600 USD + $26/month)
  - Real-time error monitoring
  - Source map uploads
  - User session replay

### P2 - Medium
- [ ] **Performance monitoring** (Est: 6-8h, $600-800 USD)
  - Core Web Vitals tracking
  - API endpoint latency monitoring
  - Database query performance

- [ ] **User behavior analytics** (Est: 8-12h, $800-1200 USD)
  - Observer journey mapping
  - Conversion funnel analysis
  - Project popularity metrics

---

## 📚 Documentation

### P2 - Medium
- [ ] **API versioning strategy** (Est: 4-6h, $400-600 USD)
  - Document breaking vs non-breaking changes
  - Deprecation policy
  - Changelog automation

---

## 💰 Revenue & Business

### P0 - Critical
- [ ] **Define Phase 2 acquisition model** (Est: Business decision, not dev hours)
  - Finalize acquisition transaction fee (% of sale)
  - Decide on ecosystem retention fee (5%? TBD)
  - Legal review of terms

### P1 - High
- [ ] **Financial reporting dashboard** (Est: 20-24h, $2000-2400 USD)
  - Per-project revenue tracking
  - Stripe transaction history
  - Monthly recurring revenue (MRR) calculator

---

## 🌍 Jungle Exhibition (Q4 2026 / Q1 2027)

### P1 - High
- [ ] **Jungle exhibition concept finalization** (Est: TBD)
  - Theme: Natural growth, organic connections
  - 3D environment design
  - Project lineup definition

---

## 📊 Summary

**Total Estimated Hours**: 240-346 hours  
**Total Estimated Cost**: $24,000-34,600 USD (if outsourced at ~$100/hour)

**Highest Priority Items (P0 + P1):**
1. Security audit (P0) - $2000-3000
2. Rate limiting (P0) - $800-1200
3. Split Stripe webhooks (P1) - $1200-1600
4. Project extraction docs (P1) - $1200-1600
5. Mobile experience audit (P1) - $1600-2400
6. Error tracking (P1) - $400-600
7. Phase 2 acquisition model (P0) - Business decision

**Quick Wins (Low effort, high impact):**
- Error tracking with Sentry (4-6h)
- Rate limiting implementation (8-12h)
- API versioning documentation (4-6h)

---

**Last updated**: May 7, 2026
