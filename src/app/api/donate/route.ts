// src/app/api/donate/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    const currency = (body?.currency || "AUD").toLowerCase();

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    if (!Number.isInteger(amount) || amount < 200) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${origin}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/?canceled=1`,
      currency,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Pyadra — Collective Contribution" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      metadata: {
        intent: body?.intent || "home-cta",
        project_id: body?.project_id || "collective-fund",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Stripe session failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}