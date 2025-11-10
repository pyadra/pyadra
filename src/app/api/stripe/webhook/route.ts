import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripeClient = new Stripe(key);
  return stripeClient;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !whSecret) {
      return NextResponse.json(
        { error: "Missing Stripe env vars on server" },
        { status: 500 }
      );
    }

    const sig = req.headers.get("stripe-signature") || "";
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
    } catch (err: any) {
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err?.message}` },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      // TODO: registra la contribución / emite “shares simbólicos”, etc.
      console.log("✅ checkout.session.completed", session.id);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err?.message || err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}