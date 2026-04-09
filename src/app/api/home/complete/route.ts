import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';
import { headers } from 'next/headers';

interface CompletionRequest {
  observerId: number;
  timeElapsed: number;
  pulsesSent: number;
  signalsFound: number;
  timestamp: string;
}

export async function POST(request: Request) {
  const supabase = getSupabase();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Database unavailable' },
      { status: 503 }
    );
  }

  try {
    const body: CompletionRequest = await request.json();
    const { observerId, timeElapsed, pulsesSent, signalsFound, timestamp } = body;

    // Validate input
    if (!observerId || timeElapsed === undefined || pulsesSent === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get IP and user agent
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';

    // Generate signature: #0011-0048-42-040626-143027
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    const dateStr = `${month}${day}${year}`;
    const timeStr = `${hours}${minutes}${seconds}`;

    const signature = `#${String(observerId).padStart(4, '0')}-${String(timeElapsed).padStart(4, '0')}-${String(pulsesSent).padStart(2, '0')}-${dateStr}-${timeStr}`;

    // Save to database
    const { data, error } = await supabase
      .from('home_scans')
      .insert({
        observer_id: observerId,
        time_elapsed: timeElapsed,
        pulses_sent: pulsesSent,
        signals_found: signalsFound,
        signature,
        completed_at: timestamp,
        ip_address: ip,
        user_agent: userAgent,
      })
      .select('id, signature')
      .single();

    if (error) {
      console.error('Error saving scan:', error);

      // If duplicate signature, return existing one
      if (error.code === '23505') {
        return NextResponse.json({
          success: true,
          signature,
          message: 'Already recorded'
        });
      }

      return NextResponse.json(
        { error: 'Failed to save completion' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      signature: data.signature,
      scanId: data.id
    });

  } catch (err) {
    console.error('Completion save failed:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
