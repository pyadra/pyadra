-- Migration: Create orbit_applications table
-- Date: 2026-04-06
-- Purpose: Store crew applications for Orbit 77

CREATE TABLE IF NOT EXISTS public.orbit_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Application data
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  work_link TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending',

  -- Constraints
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT status_values CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected'))
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_orbit_applications_status ON public.orbit_applications(status);
CREATE INDEX IF NOT EXISTS idx_orbit_applications_created_at ON public.orbit_applications(created_at DESC);

-- Row Level Security
ALTER TABLE public.orbit_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can submit applications (insert only)
CREATE POLICY "Anyone can submit applications"
  ON public.orbit_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Only authenticated users can view applications (for admin dashboard)
CREATE POLICY "Authenticated users can view applications"
  ON public.orbit_applications
  FOR SELECT
  TO authenticated
  USING (true);

-- Comments
COMMENT ON TABLE public.orbit_applications IS 'Crew applications for Orbit 77 project';
COMMENT ON COLUMN public.orbit_applications.status IS 'Application status: pending, reviewing, accepted, rejected';
