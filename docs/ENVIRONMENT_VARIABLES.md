# Environment Variables

Complete reference for all environment variables used in Pyadra.

---

## 🔑 Required Variables (Development & Production)

### Supabase Configuration

**`NEXT_PUBLIC_SUPABASE_URL`**
- **Purpose**: Supabase project URL
- **Where to get**: Supabase Dashboard → Project Settings → API → Project URL
- **Example**: `https://abc defgh ijklm nopqrst.supabase.co`
- **Used in**: All database operations, authentication

**`NEXT_PUBLIC_SUPABASE_ANON_KEY`**
- **Purpose**: Supabase anonymous/public API key
- **Where to get**: Supabase Dashboard → Project Settings → API → `anon` `public` key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Used in**: Client-side database queries
- **Security**: Safe to expose publicly (RLS policies enforced)

**`SUPABASE_SERVICE_ROLE_KEY`**
- **Purpose**: Supabase service role key (bypass RLS)
- **Where to get**: Supabase Dashboard → Project Settings → API → `service_role` key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Used in**: Server-side API routes, admin operations
- **Security**: ⚠️ **CRITICAL** - Never expose to client, use only in API routes

---

### Stripe Configuration

**`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`**
- **Purpose**: Stripe publishable key for client-side checkout
- **Where to get**: Stripe Dashboard → Developers → API Keys → Publishable key
- **Example (Test)**: `pk_test_51...`
- **Example (Live)**: `pk_live_51...`
- **Used in**: Client-side Stripe.js initialization, checkout UI
- **Security**: Safe to expose publicly

**`STRIPE_SECRET_KEY`**
- **Purpose**: Stripe secret key for server-side operations
- **Where to get**: Stripe Dashboard → Developers → API Keys → Secret key
- **Example (Test)**: `sk_test_51...`
- **Example (Live)**: `sk_live_51...`
- **Used in**: Creating checkout sessions, processing payments
- **Security**: ⚠️ **CRITICAL** - Never expose to client, server-only

**`STRIPE_WEBHOOK_SECRET`**
- **Purpose**: Stripe webhook signing secret for verifying webhooks
- **Where to get**: Stripe Dashboard → Developers → Webhooks → Add endpoint → Signing secret
- **Example**: `whsec_...`
- **Used in**: `/api/stripe/webhook` route for signature verification
- **Security**: Keep secret, validates webhook authenticity
- **Local Testing**: Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

---

### Email Configuration (Resend)

**`RESEND_API_KEY`**
- **Purpose**: Resend API key for sending transactional emails
- **Where to get**: Resend Dashboard → Settings → API Keys → Create API Key
- **Example**: `re_...`
- **Used in**: 
  - Orbit 77 supporter credentials email
  - EterniCapsule delivery emails
  - Figurines order confirmation emails
- **Security**: Keep secret, server-only
- **Fallback**: If not set, emails won't send (dev mode bypasses with console warnings)

---

## 🛠️ Optional Variables

### Analytics & Monitoring

**`NEXT_PUBLIC_VERCEL_ANALYTICS_ID`**
- **Purpose**: Vercel Analytics tracking ID
- **Where to get**: Vercel Dashboard → Project → Analytics
- **Used in**: Page view tracking, Core Web Vitals
- **Default**: Auto-configured by Vercel in production

---

## 🧪 Development vs. Production

### Development (`.env.local`)
```bash
# Use Stripe TEST keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...

# Use Resend API key (same for dev/prod, but consider separate keys)
RESEND_API_KEY=re_...

# Supabase (same keys for dev/prod if using single project)
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Production (Vercel Environment Variables)
```bash
# Use Stripe LIVE keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...
STRIPE_SECRET_KEY=sk_live_51...
STRIPE_WEBHOOK_SECRET=whsec_... # From production webhook endpoint

# Same Resend/Supabase keys (or separate production instances)
RESEND_API_KEY=re_...
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 🔒 Security Best Practices

### Never Commit Secret Keys
- `.env.local` should be in `.gitignore` ✅
- Use `.env.example` for documentation (no real values)
- Rotate keys immediately if accidentally committed

### Prefix Public vs. Private
- `NEXT_PUBLIC_*` → Exposed to client (safe for public keys)
- No prefix → Server-only (secret keys, never exposed)

### Rotate Keys Periodically
- Rotate Stripe secret keys every 6-12 months
- Rotate Supabase service role key if exposed or compromised
- Rotate Resend API key annually or if team member leaves

### Use Separate Keys for Environments
- **Development**: Stripe test mode, Supabase dev project
- **Staging**: Separate Stripe test account, staging Supabase
- **Production**: Stripe live mode, production Supabase

---

## 📝 Setup Checklist

Before deploying to production, ensure:

- [ ] All required variables are set in Vercel/deployment platform
- [ ] Stripe keys are LIVE mode (not test mode)
- [ ] Stripe webhook endpoint is configured for production URL
- [ ] Supabase RLS policies are enabled and tested
- [ ] Resend domain is verified and emails are not in sandbox mode
- [ ] No `.env.local` file committed to Git
- [ ] Team members have access to secret storage (1Password, etc.)

---

## 🆘 Troubleshooting

### "Missing Supabase credentials" error
- Check that all three Supabase vars are set
- Verify keys are correct (no extra spaces, complete strings)
- Ensure service role key is used in API routes, not anon key

### Stripe checkout fails
- Verify publishable key matches secret key environment (test/live)
- Check webhook secret is correct
- Ensure webhook endpoint is publicly accessible

### Emails not sending
- Verify RESEND_API_KEY is set
- Check Resend domain is verified
- Look for email sending errors in API route logs

### Variables not updating
- Restart dev server after changing `.env.local`
- Clear Next.js cache: `rm -rf .next`
- Redeploy on Vercel after updating environment variables

---

## 📚 Related Documentation

- **Deployment Guide** (`/docs/DEPLOYMENT.md`) - How to deploy with correct env vars
- **API Reference** (`/docs/API_REFERENCE.md`) - Which routes use which variables
- **Architecture** (`/ARCHITECTURE.md`) - System design and data flow
