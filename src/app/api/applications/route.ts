import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, role, work_link, message } = body;

    if (!name || !email || !role || !work_link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: "Database not connected" }, { status: 500 });
    }

    const { error } = await supabase
      .from('orbit_applications')
      .insert({
        name,
        email,
        role,
        work_link,
        message: message || null,
        status: 'pending'
      });

    if (error) {
      console.error("Supabase Application Insert Error:", error);
      return NextResponse.json({ error: "Failed to record application" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Form Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
