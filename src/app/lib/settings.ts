import 'server-only';
import { getSupabase } from '@/app/lib/db';

/**
 * Editable site parameters stored in the pyadra_settings table.
 *
 * Change a value in Supabase (Table Editor → pyadra_settings) and the site
 * picks it up without a code deploy. Add new keys by inserting rows — no
 * schema changes needed.
 *
 * Usage:
 *   const episodes = await getSetting<number>('orbit.episodes_live', 10);
 */
export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const supabase = getSupabase();
  if (!supabase) return fallback;

  try {
    const { data, error } = await supabase
      .from('pyadra_settings')
      .select('value')
      .eq('key', key)
      .single();

    if (error || data == null) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}
