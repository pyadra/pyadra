import { NextResponse } from 'next/server';
import { getOrbitSupabase } from '@/app/lib/orbit-db';
import { getSetting } from '@/app/lib/settings';

export const revalidate = 60; // Cache for 60 seconds

// Editable in Supabase (pyadra_settings) without a deploy;
// these are the fallbacks if the rows don't exist.
const DEFAULT_GOAL_AUD = 10_000;
const DEFAULT_EPISODES_LIVE = 10;

export async function GET() {
  const [goal, episodesLive] = await Promise.all([
    getSetting<number>('orbit.funding_goal_aud', DEFAULT_GOAL_AUD),
    getSetting<number>('orbit.episodes_live', DEFAULT_EPISODES_LIVE),
  ]);

  try {
    const supabase = getOrbitSupabase();
    if (!supabase) {
      return NextResponse.json({ total: 0, goal, episodes_live: episodesLive });
    }

    const { data, error } = await supabase
      .from('orbit_support_credentials')
      .select('amount_aud')
      .eq('payment_status', 'paid');

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ total: 0, goal, episodes_live: episodesLive });
    }

    let totalFund = 0;
    if (data && data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalFund = data.reduce((acc: number, curr: any) => acc + (curr.amount_aud || 0), 0);
    }

    return NextResponse.json({ total: totalFund, goal, episodes_live: episodesLive });
  } catch (err) {
    console.error("Orbit Fund Stats Error:", err);
    return NextResponse.json({ total: 0, goal, episodes_live: episodesLive });
  }
}
