import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const key = process.env.STRIPE_SECRET_KEY || "";
if (!key) throw new Error("Missing STRIPE_SECRET_KEY");

const stripe = new Stripe(key); // ← sin apiVersion

export async function POST(req: Request) {
  try {
    const { amount, currency = "AUD", intent = "home-cta", project_id = "" } =
      await req.json();

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "https://pyadra.io";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: Math.max(200, Number(amount) || 0), // mínimo $2 AUD
            product_data: {
              name: "Pyadra Contribution",
              description:
                "Support the collective fund — symbolic shares (no financial return).",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=1`,
      metadata: { intent, project_id },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe session error:", err);
    return NextResponse.json(
      { error: "Stripe session failed" },
      { status: 500 }
    );
  }
}