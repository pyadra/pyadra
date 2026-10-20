import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';
import { headers } from 'next/headers';

export async function GET() {
  const supabase = getSupabase();

  // No database, no number. A made-up id would be stored by the browser as if
  // it were permanent, and two visitors could end up with the same one —
  // an invented Observer number is worse than none (Company_Master #13).
  if (!supabase) {
    return NextResponse.json({ id: null });
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
      return NextResponse.json({ id: null });
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error('Observer creation failed:', err);
    return NextResponse.json({ id: null });
  }
}
