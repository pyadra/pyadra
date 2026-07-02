import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';

export const revalidate = 60;

const ZERO = { sealed: 0, delivered: 0, awaiting: 0, totalValueAUD: 0 };

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json(ZERO);

    const nowIso = new Date().toISOString();
    const table = () =>
      supabase.from('ethernicapsule_capsules').select('*', { count: 'exact', head: true });

    const [sealedRes, deliveredRes, awaitingRes, nonPendingRes] = await Promise.all([
      table().eq('status', 'sealed'),
      table().eq('status', 'opened'),
      table().eq('status', 'sealed').gt('unlock_date', nowIso),
      table().neq('status', 'pending'),
    ]);

    const firstError =
      sealedRes.error || deliveredRes.error || awaitingRes.error || nonPendingRes.error;
    if (firstError) throw firstError;

    const nonPending = nonPendingRes.count ?? 0;

    return NextResponse.json({
      sealed: sealedRes.count ?? 0,
      delivered: deliveredRes.count ?? 0,
      awaiting: awaitingRes.count ?? 0,
      totalValueAUD: nonPending * 9,
    });
  } catch (err) {
    console.error('[stats/ethernicapsule] failed, returning zeroes', err);
    return NextResponse.json(ZERO);
  }
}
