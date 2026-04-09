import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
        // Mock success if no DB is configured locally
        return NextResponse.json({ observerId: `obs_mock_${Date.now()}` });
    }

    // Capture basic request data for the observer imprint
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Check if table exists/is ready by attempting an insert
    // Note: We'll assume a table "observers" exists. If not, we just return a mock.
    const { data, error } = await supabase
      .from('observers')
      .insert([
        { user_agent: userAgent }
      ])
      .select('id')
      .single();

    if (error) {
        console.warn("Observer Insert warning (table may not exist yet, returning transient ID):", error.message);
        return NextResponse.json({ observerId: `obs_transient_${Date.now()}` });
    }

    return NextResponse.json({ observerId: data.id });
  } catch (error) {
    console.error("Failed to create observer:", error);
    return NextResponse.json({ observerId: `obs_fallback_${Date.now()}` });
  }
}
