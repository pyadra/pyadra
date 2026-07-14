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
    // Privacy: we deliberately do NOT store the visitor's IP address.
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Create new observer
    const { data, error } = await supabase
      .from('pyadra_observers')
      .insert({
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
