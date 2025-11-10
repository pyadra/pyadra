import Stripe from "stripe";
import { NextResponse } from "next/server";

const key = process.env.STRIPE_SECRET_KEY || "";
const stripe = new Stripe(key, { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  try {
    const { amount, project_id, intent } = await req.json();
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

    // amount en CENTAVOS AUD (min $2)
    const cents = Number.isFinite(amount) ? Math.round(amount) : NaN;
    if (!cents || cents < 200) return NextResponse.json({ error: "Min $2 AUD" }, { status: 400 });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: "aud",
      line_items: [{
        price_data: {
          currency: "aud",
          unit_amount: cents,
          product_data: { name: "Invite a Coffee — Pyadra" },
        },
        quantity: 1,
      }],
      metadata: { project_id: project_id || "collective-fund", intent: intent || "home-cta" },
      success_url: `${origin}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    }, { idempotencyKey: crypto.randomUUID() });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    console.error("Stripe checkout error →", e.message);
    return NextResponse.json({ error: e.message || "Stripe session failed" }, { status: 500 });
  }
}