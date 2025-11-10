import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// cache opcional
let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null; // ← no throw en top-level
  stripeClient = new Stripe(key);
  return stripeClient;
}

export async function POST(req: Request) {
  try {
    const { amount, intent, project_id } = await req.json();
    if (!amount || isNaN(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY (server env)" },
        { status: 500 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: "aud",
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: Number(amount),
            product_data: {
              name: "Pyadra — Contribution",
              description: "Symbolic shares to support the Pyadra collective fund",
              metadata: { project_id, intent },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
      metadata: { project_id, intent },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err?.message || err);
    return NextResponse.json(
      { error: "Stripe session failed", details: err?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}