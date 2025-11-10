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
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY (server env)" },
      { status: 500 }
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return NextResponse.json({ session });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to retrieve session", details: err?.message },
      { status: 500 }
    );
  }
}