-- Migration: Add guardian_token_hash for on-demand key delivery
-- Date: 2026-03-31
-- Reason: Eliminate need for cron jobs - deliver keys on-demand when guardian accesses

-- Add guardian_token_hash column to ethernicapsule_capsules table
ALTER TABLE ethernicapsule_capsules
ADD COLUMN IF NOT EXISTS guardian_token_hash TEXT;

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_guardian_token_hash
ON ethernicapsule_capsules(guardian_token_hash);

-- Add comment
COMMENT ON COLUMN ethernicapsule_capsules.guardian_token_hash IS
'Hashed token for guardian to access capsule on-demand. Used instead of cron-based delivery.';
