import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';

export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    // Return mock data if DB unavailable
    return NextResponse.json({
      totalObservers: 47,
      pulsesToday: 1234,
      scansToday: 12
    });
  }

  try {
    // Get total observers count
    const { count: observerCount } = await supabase
      .from('observers')
      .select('*', { count: 'exact', head: true });

    // Get today's scans
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: todayScans } = await supabase
      .from('home_scans')
      .select('pulses_sent')
      .gte('created_at', today.toISOString());

    // Calculate total pulses sent today
    const pulsesToday = todayScans?.reduce((sum, scan) => sum + scan.pulses_sent, 0) || 0;

    return NextResponse.json({
      totalObservers: observerCount || 0,
      pulsesToday,
      scansToday: todayScans?.length || 0
    });

  } catch (err) {
    console.error('Stats fetch failed:', err);
    return NextResponse.json({
      totalObservers: 0,
      pulsesToday: 0,
      scansToday: 0
    });
  }
}

// Cache for 30 seconds
export const revalidate = 30;
