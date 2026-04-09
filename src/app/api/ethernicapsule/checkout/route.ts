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

import { getSupabase } from "@/app/lib/db";
import { sanitizeString } from "@/app/lib/validation";
import crypto from "crypto";

function generateKey(prefix: string) {
  const segment1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const segment2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `${prefix}-${segment1}-${segment2}`;
}

function hashKey(key: string) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { sender_name, recipient_name, message, guardian_email, deliver_at } = await req.json();

    if (!sender_name || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) throw new Error("Missing DB connection");

    // Pre-generate keys
    const rawSenderKey = generateKey("ETN-CREATOR");
    const rawCapsuleKey = generateKey("ETN-CAPSULE");
    const rawGuardianToken = crypto.randomBytes(16).toString('hex'); // Unique token for guardian access
    const capsuleId = crypto.randomUUID();

    // 1. Insert as 'pending' prior to Stripe. Data is secured immediately.
    const { data: capsule, error: insertError } = await supabase
      .from("ethernicapsule_capsules")
      .insert({
        id: capsuleId,
        status: "pending" as const,
        stripe_session_id: `pending_${capsuleId}`,
        sender_name: sanitizeString(sender_name, 100),
        sender_email: "pending@checkout", // Placeholder until webhook
        recipient_name: recipient_name ? sanitizeString(recipient_name, 100) : null,
        guardian_email: guardian_email ? sanitizeString(guardian_email, 150) : null,
        deliver_at: deliver_at ? new Date(deliver_at).toISOString() : null,
        message: sanitizeString(message, 15000),
        sender_key_hash: hashKey(rawSenderKey),
        capsule_key_hash: hashKey(rawCapsuleKey),
        guardian_token_hash: guardian_email ? hashKey(rawGuardianToken) : null,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Supabase Insert Error:", insertError);
      return NextResponse.json({ error: "Failed to initialize capsule secure vault." }, { status: 500 });
    }

    const stripe = getStripe();
    if (!stripe) {
      console.warn("No Stripe Key - returning Local Bypass URL");
      await supabase.from("ethernicapsule_capsules").update({ stripe_session_id: "local_dev_bypass" }).eq("id", capsule.id);
      return NextResponse.json({ url: `${req.headers.get("origin") || "http://localhost:3000"}/exhibitions/galaxy/ethernicapsule/sealing?session_id=local_dev_bypass` });
    }

    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://pyadra.io";

    const sessionMetadata = {
      project_id: "ethernicapsule",
      intent: "silent-letter-seal",
      capsule_id: capsule.id.toString(),
      sender_key: rawSenderKey,
      capsule_key: rawCapsuleKey,
      guardian_token: guardian_email ? rawGuardianToken : "",
      sender_name: sanitizeString(sender_name, 100),
      guardian_email: guardian_email ? sanitizeString(guardian_email, 150) : "",
      deliver_at: deliver_at ? new Date(deliver_at).toISOString() : ""
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      currency: "aud",
      client_reference_id: capsule.id.toString(),
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: 900, // $9.00 AUD
            product_data: {
              name: "EterniCapsule — The Silent Letter",
              description: "A permanent sealed letter. Preserved until the time comes.",
              metadata: { project_id: "ethernicapsule" },
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/exhibitions/galaxy/ethernicapsule/sealing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/exhibitions/galaxy/ethernicapsule?cancelled=true`,
      metadata: sessionMetadata,
    });

    // Link intent immediately
    await supabase.from("ethernicapsule_capsules").update({ stripe_session_id: session.id }).eq("id", capsule.id);

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("EterniCapsule Stripe Checkout Initialization Error:", errorMessage);
    return NextResponse.json({ error: "Payment processing failed. Please try again later." }, { status: 500 });
  }
}
