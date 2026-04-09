import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabase } from "@/app/lib/db";
import crypto from "crypto";

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
    const { tier } = await req.json();

    if (tier !== 'figurine_only' && tier !== 'figurine_signal') {
      return NextResponse.json({ error: "Invalid tier selection" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) throw new Error("Missing DB connection");

    const orderId = crypto.randomUUID();
    const amountAud = tier === 'figurine_only' ? 17500 : 20000; // $175 or $200

    // 1. Insert as 'pending' prior to Stripe.
    const { error: insertError } = await supabase
      .from("figurine_orders")
      .insert({
        id: orderId,
        status: "pending",
        stripe_session_id: `pending_${orderId}`,
        tier,
        amount_aud: amountAud / 100,
      });

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return NextResponse.json({ error: "DB_MISSING" }, { status: 500 });
    }

    const stripe = getStripe();
    if (!stripe) {
      console.warn("No Stripe Key - returning Local Bypass URL");
      await supabase.from("figurine_orders").update({ stripe_session_id: "local_dev_bypass" }).eq("id", orderId);
      return NextResponse.json({ url: `${req.headers.get("origin") || "http://localhost:3000"}/exhibitions/galaxy/figurines/forge?session_id=local_dev_bypass` });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://pyadra.io";

    const sessionMetadata = {
      project_id: "figurines",
      order_id: orderId,
      tier: tier
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: "aud",
      client_reference_id: orderId,
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: amountAud,
            product_data: {
              name: tier === 'figurine_signal' ? "Pyadra Figurine + Signal QR" : "Pyadra Figurine",
              description: "A permanent physical cast. AI Modeled, 3D Printed, and Painted.",
              metadata: { project_id: "figurines" },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/exhibitions/galaxy/figurines/forge?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/exhibitions/galaxy/figurines?cancelled=true`,
      metadata: sessionMetadata,
    });

    // Link intent immediately
    await supabase.from("figurine_orders").update({ stripe_session_id: session.id }).eq("id", orderId);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Figurines Stripe Checkout Error:", errorMessage);
    return NextResponse.json({ error: "Payment processing failed. Please try again later." }, { status: 500 });
  }
}
