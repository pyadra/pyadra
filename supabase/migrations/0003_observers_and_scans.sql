-- Supabase Migration: 0003_observers_and_scans.sql
-- Purpose: Persist observers and their home page scan completions

-- Observers table
CREATE TABLE public.observers (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    first_visit TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Home scan completions table
CREATE TABLE public.home_scans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    observer_id INTEGER NOT NULL REFERENCES public.observers(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Scan stats
    time_elapsed INTEGER NOT NULL,        -- seconds
    pulses_sent INTEGER NOT NULL,
    signals_found INTEGER NOT NULL DEFAULT 6,

    -- Generated signature
    signature TEXT UNIQUE NOT NULL,       -- "#0011-0048-42-060426"

    -- Metadata
    completed_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address TEXT,
    user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_observers_created ON public.observers(created_at DESC);
CREATE INDEX idx_home_scans_observer ON public.home_scans(observer_id);
CREATE INDEX idx_home_scans_created ON public.home_scans(created_at DESC);
CREATE INDEX idx_home_scans_signature ON public.home_scans(signature);

-- Enable RLS (Row Level Security)
ALTER TABLE public.observers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.home_scans ENABLE ROW LEVEL SECURITY;

-- Policies (read-only public access for stats)
CREATE POLICY "Allow public read for stats" ON public.observers FOR SELECT USING (true);
CREATE POLICY "Allow public read for scans" ON public.home_scans FOR SELECT USING (true);
