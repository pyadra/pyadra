-- Supabase Migration: 0000_orbit_support_credentials.sql
-- Purpose: Persist supporter credentials for Orbit 77 without generic SaaS noise.

CREATE TABLE public.orbit_support_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Payment & Session linkage
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, failed, anonymous 
    
    -- Supporter Identity (Archive Record)
    supporter_name TEXT,
    supporter_email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false NOT NULL,
    
    -- Financials 
    amount_aud INTEGER NOT NULL,
    currency TEXT DEFAULT 'aud' NOT NULL,
    
    -- Emotional / Archival
    support_message TEXT,
    credential_code TEXT UNIQUE NOT NULL,
    season_label TEXT DEFAULT 'Season 1',
    project_slug TEXT DEFAULT 'orbit-77' NOT NULL,
    
    -- Email Delivery Status
    email_sent BOOLEAN DEFAULT false NOT NULL,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    paid_at TIMESTAMP WITH TIME ZONE
);

-- Optimize queries for verification and webhooks
CREATE INDEX idx_orbit_credentials_session_id ON public.orbit_support_credentials (stripe_checkout_session_id);
CREATE INDEX idx_orbit_credentials_email ON public.orbit_support_credentials (supporter_email);
CREATE INDEX idx_orbit_credentials_code ON public.orbit_support_credentials (credential_code);

-- Enable RLS (Row Level Security) - Restricted to backend only for now
ALTER TABLE public.orbit_support_credentials ENABLE ROW LEVEL SECURITY;

-- If Supabase Data API is exposed, we might want to allow reading the credential using the code
-- Removed insecure public policy. Data access is handled exclusively via server-side service role key.
