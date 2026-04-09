-- Migration: Create figurine_orders table
-- Date: 2026-04-06
-- Purpose: Store Figurines orders and photo uploads

CREATE TABLE IF NOT EXISTS public.figurine_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Stripe payment tracking
  stripe_session_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  tier TEXT NOT NULL,
  amount_aud DECIMAL(10,2) NOT NULL,

  -- Customer information (collected after payment)
  customer_email TEXT,
  customer_name TEXT,
  shipping_address TEXT,

  -- Photo upload data (collected after payment)
  photo_urls TEXT[], -- Array of uploaded photo URLs

  -- Constraints
  CONSTRAINT tier_values CHECK (tier IN ('figurine_only', 'figurine_signal')),
  CONSTRAINT status_values CHECK (status IN ('pending', 'paid', 'forging', 'shipped', 'cancelled')),
  CONSTRAINT email_format CHECK (customer_email IS NULL OR customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Indexes for queries
CREATE INDEX IF NOT EXISTS idx_figurine_orders_stripe_session ON public.figurine_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_figurine_orders_status ON public.figurine_orders(status);
CREATE INDEX IF NOT EXISTS idx_figurine_orders_email ON public.figurine_orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_figurine_orders_created_at ON public.figurine_orders(created_at DESC);

-- Row Level Security
ALTER TABLE public.figurine_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Service role has full access (for API routes)
CREATE POLICY "Service role full access"
  ON public.figurine_orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_figurine_orders_updated_at
  BEFORE UPDATE ON public.figurine_orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE public.figurine_orders IS 'Figurines project orders with photo uploads and shipping info';
COMMENT ON COLUMN public.figurine_orders.tier IS 'Tier: figurine_only ($150) or figurine_signal ($200)';
COMMENT ON COLUMN public.figurine_orders.status IS 'Order status: pending → paid → forging → shipped';
COMMENT ON COLUMN public.figurine_orders.photo_urls IS 'Array of uploaded photo URLs (S3/Supabase storage)';
