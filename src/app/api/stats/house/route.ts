import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';

/* The open book's one live figure of its own: how many rooms the house
   has made for someone. Counted from `pyadra_exhibitions` (migration
   0009). Until that table exists the count is zero, which is also the
   truth: no room has been made. The sample room lives in code and is
   never counted. */
export const revalidate = 60;

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ rooms: 0 });
  try {
    const { count, error } = await supabase.from('pyadra_exhibitions').select('slug', { count: 'exact', head: true });
    return NextResponse.json({ rooms: error || typeof count !== 'number' ? 0 : count });
  } catch {
    return NextResponse.json({ rooms: 0 });
  }
}
