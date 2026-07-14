import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Dedicated database client for Orbit 77.
 *
 * Orbit 77 is an independent project that currently rides on Pyadra's shared
 * Supabase instance. ALL access to orbit_* tables (orbit_support_credentials)
 * MUST go through this client —
 * never through the shared getSupabase() in db.ts.
 *
 * Migration path: when Orbit 77 gets its own Supabase project, set
 * ORBIT_SUPABASE_URL and ORBIT_SUPABASE_SERVICE_ROLE_KEY in the environment
 * and everything moves over — no code changes required. Until then it falls
 * back to Pyadra's shared credentials.
 */
const orbitUrl =
  process.env.ORBIT_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const orbitServiceKey =
  process.env.ORBIT_SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  '';

let orbitInstance: SupabaseClient | null = null;

export function getOrbitSupabase(): SupabaseClient | null {
  if (orbitInstance) return orbitInstance;
  if (!orbitUrl || !orbitServiceKey) {
    console.warn('Orbit 77 database credentials missing. Database operations will fail.');
    return null;
  }

  orbitInstance = createClient(orbitUrl, orbitServiceKey, {
    auth: {
      persistSession: false,
    },
  });

  return orbitInstance;
}
