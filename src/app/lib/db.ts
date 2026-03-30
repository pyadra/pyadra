import 'server-only';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Strict backend-only initialization. Service Role Key is explicitly required to bypass RLS for trusted writes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Singleton-like pattern for Supabase client
// Using generic SupabaseClient type - schema types can be added later if needed
let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn("Supabase credentials missing. Database operations will fail.");
    return null;
  }

  // Use service role key to bypass RLS since this is a backend-only operation
  supabaseInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false
    }
  });

  return supabaseInstance;
}
