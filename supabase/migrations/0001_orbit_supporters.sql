-- Supabase Migration: 0001_orbit_supporters.sql
-- Purpose: Create persistent supporter entities and attach existing/new credentials

CREATE TABLE public.orbit_supporters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Supporter Identity
    email TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL
);

CREATE INDEX idx_orbit_supporters_email ON public.orbit_supporters (email);

-- Link credentials to supporters
ALTER TABLE public.orbit_support_credentials 
ADD COLUMN supporter_id UUID REFERENCES public.orbit_supporters(id) ON DELETE SET NULL;

CREATE INDEX idx_orbit_credentials_supporter_id ON public.orbit_support_credentials (supporter_id);

-- Restrict Row Level Security
ALTER TABLE public.orbit_supporters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view supporters by id" 
    ON public.orbit_supporters 
    FOR SELECT 
    USING (true);
