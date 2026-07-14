import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;            // no tirar error en top-level
  stripeClient = new Stripe(key);   // sin apiVersion para evitar TS en build
  return stripeClient;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");
  if (!session_id) {
    return NextResponse.json({ error: "session_id is required" }, { status: 400 });
  }

  const stripe = getStripe();
  if (!stripe) {
    console.error("Session API Failed: Missing STRIPE_SECRET_KEY in environment variables.");
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY (server env)" },
      { status: 500 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Lookup the credential created by the webhook — its id is the archive link id
    let supporter_id = null;
    try {
      const { getOrbitSupabase } = await import('@/app/lib/orbit-db');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const supabase = getOrbitSupabase() as any;
      if (supabase) {
        const { data } = await supabase
          .from('orbit_support_credentials')
          .select('id')
          .eq('stripe_checkout_session_id', session_id)
          .single();
        if (data && data.id) {
          supporter_id = data.id;
        }
      } else {
        console.warn("Session API Warn: Supabase could not be initialized for ID lookup.");
      }
    } catch (dbErr) {
      console.error("Session API Warn: Failed to lookup supporter ID in DB:", dbErr);
    }

    return NextResponse.json({ session, supporter_id });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Failed to retrieve session", details: errorMessage },
      { status: 500 }
    );
  }
}