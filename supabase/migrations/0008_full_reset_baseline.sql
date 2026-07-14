-- ============================================================
-- Migration: 0008_full_reset_baseline.sql
-- Date: 2026-07-14
-- Purpose: FULL RESET. All existing data is test data (confirmed
--   by owner). Drops every table and recreates the schema clean,
--   matching what the CODE actually uses today:
--     • ethernicapsule gets its real columns (deliver_at,
--       guardian_key_delivered, guardian_token_hash) and the
--       'pending' status the checkout inserts
--     • payment/status columns get CHECK constraints everywhere
--     • updated_at auto-updates via trigger on every table that has it
--     • RLS ENABLED on all tables, with NO public policies —
--       all access is server-side through the service role key
--     • no ip_address storage, no home_scans (legacy, removed)
--     • orbit_applications and figurine_orders REMOVED entirely —
--       the crew form was retired and Figuitoon sells via Shopify
--       (its page here is a showcase only); the teardown below still
--       drops them so the reset clears the old test tables
-- Run once in the Supabase SQL Editor. Replaces migrations 0000–0007.
-- ============================================================

-- ---------- teardown ----------
DROP TABLE IF EXISTS public.home_scans;
DROP TABLE IF EXISTS public.observers;
DROP TABLE IF EXISTS public.pyadra_observers;
DROP TABLE IF EXISTS public.pyadra_settings;
DROP TABLE IF EXISTS public.orbit_support_credentials;
DROP TABLE IF EXISTS public.orbit_supporters;
DROP TABLE IF EXISTS public.orbit_applications;
DROP TABLE IF EXISTS public.ethernicapsule_capsules;
DROP TABLE IF EXISTS public.figurine_orders;
DROP TYPE IF EXISTS capsule_status;

-- ---------- shared: updated_at trigger function ----------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ORBIT 77 (independent project — see supabase/README.md;
-- a single table: each row is one contribution/credential and
-- carries the supporter's identity. The archive page groups a
-- supporter's credentials by supporter_email.)
-- ============================================================

CREATE TABLE public.orbit_support_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Payment & session linkage
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'failed', 'anonymous')),

  -- Supporter identity (archive record)
  supporter_name TEXT,
  supporter_email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,

  -- Financials (whole AUD dollars — Stripe checkout uses fixed
  -- whole-dollar amounts; revisit to cents if that ever changes)
  amount_aud INTEGER NOT NULL CHECK (amount_aud >= 0),
  currency TEXT NOT NULL DEFAULT 'aud',

  -- Emotional / archival
  support_message TEXT,
  credential_code TEXT UNIQUE NOT NULL,
  season_label TEXT DEFAULT 'Season 1',
  project_slug TEXT NOT NULL DEFAULT 'orbit-77',

  -- Email delivery status
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

CREATE INDEX idx_orbit_credentials_session_id ON public.orbit_support_credentials (stripe_checkout_session_id);
CREATE INDEX idx_orbit_credentials_email ON public.orbit_support_credentials (supporter_email);
CREATE INDEX idx_orbit_credentials_code ON public.orbit_support_credentials (credential_code);

CREATE TRIGGER trg_orbit_credentials_updated_at
  BEFORE UPDATE ON public.orbit_support_credentials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ETERNICAPSULE (museum project)
-- ============================================================

-- 'pending' = created pre-payment by /api/ethernicapsule/checkout
CREATE TYPE capsule_status AS ENUM ('pending', 'sealed', 'previewed', 'opened');

CREATE TABLE public.ethernicapsule_capsules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Billing ('pending_<uuid>' placeholder until Stripe session exists)
  stripe_session_id TEXT UNIQUE NOT NULL,

  -- Actors
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  recipient_name TEXT,
  guardian_email TEXT,

  -- Message body
  message TEXT NOT NULL,

  -- Security (only hashes are stored, never raw keys)
  sender_key_hash TEXT NOT NULL,
  capsule_key_hash TEXT NOT NULL,
  guardian_token_hash TEXT,

  -- Time-vault delivery
  deliver_at TIMESTAMPTZ,
  guardian_key_delivered BOOLEAN NOT NULL DEFAULT false,

  -- Lifecycle
  status capsule_status NOT NULL DEFAULT 'pending',
  previewed_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ
);

CREATE INDEX idx_ethernicapsule_sender_hash ON public.ethernicapsule_capsules (sender_key_hash);
CREATE INDEX idx_ethernicapsule_capsule_hash ON public.ethernicapsule_capsules (capsule_key_hash);
CREATE INDEX idx_ethernicapsule_session_id ON public.ethernicapsule_capsules (stripe_session_id);
CREATE INDEX idx_ethernicapsule_guardian_token ON public.ethernicapsule_capsules (guardian_token_hash);

CREATE TRIGGER trg_ethernicapsule_updated_at
  BEFORE UPDATE ON public.ethernicapsule_capsules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- PYADRA (the museum itself)
-- ============================================================

-- The ticket counter for the home page; no IPs stored
CREATE TABLE public.pyadra_observers (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent TEXT,
  first_visit TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Editable site parameters — change a value here and the site picks
-- it up without a code deploy. One row per setting, JSONB value.
-- Examples of future keys: 'orbit.episodes_live', 'store.enabled'.
CREATE TABLE public.pyadra_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_pyadra_settings_updated_at
  BEFORE UPDATE ON public.pyadra_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed the settings the site reads today. To change a value later,
-- edit the row in the Table Editor — the site updates within a minute,
-- no deploy needed. To add a new parameter: insert a row here, then
-- read it in code with getSetting('the.key', fallback).
INSERT INTO public.pyadra_settings (key, value, description) VALUES
  ('orbit.funding_goal_aud', '10000',
   'Orbit 77 Season 2 funding goal in whole AUD. Shown on the Orbit page progress bar.'),
  ('orbit.episodes_live', '10',
   'Number of Orbit 77 episodes live on YouTube. Shown on the Orbit page.');

-- ============================================================
-- SECURITY: RLS on for everything, zero public policies.
-- The backend uses the service role key, which bypasses RLS.
-- ============================================================

ALTER TABLE public.orbit_support_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ethernicapsule_capsules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyadra_observers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyadra_settings ENABLE ROW LEVEL SECURITY;
