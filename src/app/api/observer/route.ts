import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';
import { headers } from 'next/headers';

export async function GET() {
  const supabase = getSupabase();

  if (!supabase) {
    // Fallback to in-memory if DB not available
    return NextResponse.json({ id: Math.floor(Math.random() * 100) + 1 });
  }

  try {
    // Get IP and user agent for tracking
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Create new observer
    const { data, error } = await supabase
      .from('observers')
      .insert({
        ip_address: ip,
        user_agent: userAgent,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating observer:', error);
      return NextResponse.json({ id: Math.floor(Math.random() * 100) + 1 });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error('Observer creation failed:', err);
    return NextResponse.json({ id: Math.floor(Math.random() * 100) + 1 });
  }
}
