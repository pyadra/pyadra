import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ total: 0 });
    }

    const { data, error } = await supabase
      .from('orbit_support_credentials')
      .select('amount_aud');

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ total: 0 });
    }

    let totalFund = 0;
    if (data && data.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      totalFund = data.reduce((acc: number, curr: any) => acc + (curr.amount_aud || 0), 0);
    }
    
    return NextResponse.json({ total: totalFund });
  } catch (err) {
    console.error("Orbit Fund Stats Error:", err);
    return NextResponse.json({ total: 0 });
  }
}
