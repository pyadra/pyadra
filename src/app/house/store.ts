import 'server-only';
import { getSupabase } from '@/app/lib/db';
import { SAMPLE_SLUG, fromRow, sampleExhibition, seal, type Exhibition, type ExhibitionRow } from './exhibition';

/* ------------------------------------------------------------------ */
/*  PYADRA · The house — where a room is read from.                    */
/*                                                                     */
/*  The sample room lives in code. Real rooms are rows of              */
/*  `pyadra_exhibitions` (migration 0009), written by hand in the      */
/*  Supabase Table Editor while the house makes each one itself, the   */
/*  same way `pyadra_settings` is edited. A real room is never written */
/*  into this repository: the repository is public, a room is private. */
/*                                                                     */
/*  Whatever is read is sealed here, on the server, before it is       */
/*  returned: a letter's words do not travel before their day.         */
/* ------------------------------------------------------------------ */

/** Slugs are lower-case words with an unguessable tail, e.g.
 *  `elena-x7k2p9q4`. Anything else is not looked up. */
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function getExhibition(slug: string, now: Date = new Date()): Promise<Exhibition | null> {
  if (!SLUG.test(slug) || slug.length > 80) return null;
  if (slug === SAMPLE_SLUG) return seal(sampleExhibition(now), now);

  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('pyadra_exhibitions')
      .select('slug, for_name, dedication, from_name, opened_on, number, carried_by, pieces')
      .eq('slug', slug)
      .maybeSingle();
    // No table yet (the migration is not applied) reads the same as no room.
    if (error || !data) return null;
    return seal(fromRow(data as ExhibitionRow), now);
  } catch (err) {
    console.error('[house] could not read the exhibition', err);
    return null;
  }
}
