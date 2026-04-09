# Deployment Guide

**Last Updated**: April 7, 2026  
**Status**: Production-Ready ✅

---

## Pre-Deployment Checklist

### 1. Database Migrations

Ensure all migrations are applied in Supabase:

```sql
-- Check current migrations in supabase/migrations/:
-- 0000_orbit_support_credentials.sql
-- 0001_orbit_supporters.sql
-- 0002_ethernicapsule_capsules.sql
-- 0003_observers_and_scans.sql
-- 0004_orbit_applications.sql
-- 0005_figurine_orders.sql
-- 0006_guardian_token_hash.sql
```

**How to Apply**:
1. Go to Supabase Dashboard → SQL Editor
2. Copy/paste each migration file
3. Execute in order (0000 → 0006)

---

### 2. Environment Variables

**Required in Vercel/Production**:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhb...

# Email
RESEND_API_KEY=re_...

# Site
NEXT_PUBLIC_APP_URL=https://pyadra.io
```

**NOT Required** (deprecated):
- ❌ `CRON_SECRET` → No longer using cron jobs (on-demand system)

---

### 3. Stripe Configuration

#### Webhook Endpoint

**URL**: `https://pyadra.io/api/stripe/webhook`

**Events to Listen**:
- `checkout.session.completed`

**Steps**:
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter: `https://pyadra.io/api/stripe/webhook`
4. Select event: `checkout.session.completed`
5. Copy webhook signing secret → Add to Vercel as `STRIPE_WEBHOOK_SECRET`

#### Products

Ensure these products exist in Stripe:

| Product | Price | ID Reference |
|---------|-------|--------------|
| EterniCapsule | $9 AUD | metadata: `project_id: "ethernicapsule"` |
| Figurines (Only) | $150 AUD | metadata: `project_id: "figurines"`, `tier: "figurine_only"` |
| Figurines (+ Signal) | $200 AUD | metadata: `project_id: "figurines"`, `tier: "figurine_signal"` |
| Orbit Support | Variable | metadata: `project_id: "orbit"` |

---

### 4. Build Verification

```bash
# Run locally before deploying
npm run build

# Should see:
✓ Compiled successfully
✓ Generating static pages (30/30)
✓ Finalizing page optimization
```

**Common Issues**:
- TypeScript errors → Fix before deploying
- Missing env vars → Check `.env.local`
- Import errors → Check file paths

---

### 5. Test Critical Flows

Before going live, test:

#### EterniCapsule Flow
1. Go to `/exhibitions/galaxy/ethernicapsule`
2. Click "Compose Capsule"
3. Fill form → Checkout
4. Verify Stripe redirect works
5. Check email delivery (sender + guardian)

#### Figurines Flow
1. Go to `/exhibitions/galaxy/figurines`
2. Upload 3 photos
3. Proceed to checkout
4. Verify redirect to forge page

#### Orbit Donation
1. Go to `/exhibitions/galaxy/orbit`
2. Click "Support"
3. Enter amount
4. Complete checkout
5. Verify redirect to confirmation

---

## Deployment Steps (Vercel)

### First-Time Deploy

1. **Connect Repository**
   ```
   Vercel Dashboard → Add New Project → Import Git Repository
   ```

2. **Configure Build**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Add Environment Variables**
   - Copy all variables from section 2 above
   - Set for "Production" environment

4. **Deploy**
   ```
   Click "Deploy" → Wait for build
   ```

5. **Verify Domain**
   ```
   Production URL: https://pyadra.io
   ```

6. **Configure Stripe Webhook**
   - Use production URL from step 5
   - Add webhook secret to Vercel env vars

---

### Subsequent Deploys

```bash
# Vercel auto-deploys on git push to main
git push origin main

# Or manual deploy via CLI:
vercel --prod
```

---

## Post-Deployment Verification

### 1. Health Checks

Visit these URLs and verify they work:

- ✅ `https://pyadra.io/` → Home (Observer initiation)
- ✅ `https://pyadra.io/exhibitions` → Exhibition selector
- ✅ `https://pyadra.io/exhibitions/galaxy` → 3D navigation
- ✅ `https://pyadra.io/exhibitions/galaxy/ethernicapsule` → EterniCapsule
- ✅ `https://pyadra.io/exhibitions/galaxy/orbit` → Orbit 77
- ✅ `https://pyadra.io/exhibitions/galaxy/figurines` → Figurines

### 2. API Endpoints

Test in browser or Postman:

```bash
# Observer creation
POST https://pyadra.io/api/observer

# Home stats (should return JSON)
GET https://pyadra.io/api/home/stats

# Orbit fund stats
GET https://pyadra.io/api/stats/orbit-fund
```

### 3. Redirects (Backward Compatibility)

Verify old URLs redirect correctly:

- `https://pyadra.io/projects/ethernicapsule` → Should 301 redirect to `/exhibitions/galaxy/ethernicapsule`
- `https://pyadra.io/projects/orbit` → Should 301 redirect to `/exhibitions/galaxy/orbit`
- `https://pyadra.io/projects/figurines` → Should 301 redirect to `/exhibitions/galaxy/figurines`

---

## Monitoring

### Vercel Analytics

Monitor:
- Page load times
- Error rates
- Traffic patterns

Access: Vercel Dashboard → Analytics

### Stripe Dashboard

Monitor:
- Successful checkouts
- Webhook delivery
- Failed payments

Access: [Stripe Dashboard](https://dashboard.stripe.com)

### Supabase Logs

Monitor:
- Database queries
- Error logs
- Connection issues

Access: Supabase Dashboard → Logs

---

## Rollback Procedure

If deployment breaks:

### Option 1: Vercel Dashboard Rollback
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

### Option 2: Git Revert
```bash
# Find last working commit
git log --oneline

# Revert to that commit
git revert <commit-hash>

# Push
git push origin main
```

---

## Common Issues

### Issue: Stripe Webhook Failing

**Symptoms**: Payments succeed but DB not updated

**Solution**:
1. Check `STRIPE_WEBHOOK_SECRET` in Vercel
2. Verify webhook endpoint in Stripe dashboard
3. Check Vercel function logs

### Issue: Database Connection Timeout

**Symptoms**: API routes return 500 errors

**Solution**:
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
2. Check Supabase project status
3. Verify no IP restrictions in Supabase

### Issue: Email Not Sending

**Symptoms**: Checkout succeeds but no email

**Solution**:
1. Check `RESEND_API_KEY` in Vercel
2. Verify domain in Resend dashboard
3. Check Resend logs

---

## Security Checklist

Before deploying:

- [ ] All API keys are in environment variables (not hardcoded)
- [ ] `.env.local` is in `.gitignore`
- [ ] Stripe webhook secret is configured
- [ ] CORS headers are set in middleware
- [ ] Rate limiting is active (via Vercel)
- [ ] Database RLS policies are enabled

---

## Performance Checklist

- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] All images optimized
- [ ] 3D assets compressed
- [ ] No console errors in production

---

## Need Help?

- **Deployment Issues**: Check Vercel function logs
- **Payment Issues**: Check Stripe webhook logs
- **Database Issues**: Check Supabase logs
- **Email Issues**: Check Resend logs

---

**Deployment is straightforward - most complexity is one-time setup of environment variables and Stripe webhooks.** ✅
