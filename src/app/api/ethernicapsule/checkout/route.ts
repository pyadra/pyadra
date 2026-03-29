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
    if (!stripe) {
      console.error("EterniCapsule Checkout Failed: Missing STRIPE_SECRET_KEY.");
      if (process.env.NODE_ENV !== "production") {
         return NextResponse.json({ url: `${req.headers.get("origin") || "http://localhost:3000"}/ethernicapsule/sealing?session_id=local_dev_bypass` });
      }
      return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const sessionMetadata = {
      project_id: "ethernicapsule",
      intent: "silent-letter-seal",
      product: "ethernicapsule",
      type: "silent_letter"
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: "aud",
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: 2000, // $20.00 AUD
            product_data: {
              name: "EterniCapsule — The Silent Letter",
              description: "A permanent sealed letter. Preserved until the time comes.",
              metadata: sessionMetadata,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/ethernicapsule/sealing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/ethernicapsule?cancelled=true`,
      metadata: sessionMetadata,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("EterniCapsule Stripe Checkout Initialization Error:", errorMessage);
    return NextResponse.json({ error: "Payment processing failed. Please try again later." }, { status: 500 });
  }
}
