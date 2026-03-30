import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';
import { sanitizeString } from '@/app/lib/validation';

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
        name: sanitizeString(name, 100),
        email: sanitizeString(email, 150),
        role: sanitizeString(role, 50),
        work_link: sanitizeString(work_link, 500),
        message: message ? sanitizeString(message, 2000) : null,
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
