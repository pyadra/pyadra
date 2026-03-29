-- Supabase Migration: 0002_ethernicapsule_capsules.sql
-- Purpose: Persist the digital memory vaults (capsules) securely with RLS bypassed by backend keys.

CREATE TYPE capsule_status AS ENUM ('sealed', 'previewed', 'opened');

CREATE TABLE public.ethernicapsule_capsules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Billing
    stripe_session_id TEXT UNIQUE NOT NULL,

    -- Actors
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    recipient_name TEXT,
    guardian_email TEXT,

    -- Message Body
    message TEXT NOT NULL,

    -- Security
    sender_key_hash TEXT NOT NULL,
    capsule_key_hash TEXT NOT NULL,

    -- Lifecycle
    status capsule_status DEFAULT 'sealed' NOT NULL,
    previewed_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ethernicapsule_sender_hash ON public.ethernicapsule_capsules (sender_key_hash);
CREATE INDEX idx_ethernicapsule_capsule_hash ON public.ethernicapsule_capsules (capsule_key_hash);
CREATE INDEX idx_ethernicapsule_session_id ON public.ethernicapsule_capsules (stripe_session_id);

-- Restrict Row Level Security. 
-- No public read access. Only backend Service Role can read/write.
ALTER TABLE public.ethernicapsule_capsules ENABLE ROW LEVEL SECURITY;
