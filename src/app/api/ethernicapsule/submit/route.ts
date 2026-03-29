import { NextResponse } from "next/server";
import Stripe from "stripe";
import crypto from "crypto";
import { getSupabase } from "@/app/lib/db";
import { sendCreatorEmail, sendGuardianAwarenessEmail, sendGuardianKeyEmail } from "@/app/lib/ethernicapsule-email";
import { sanitizeString } from "@/app/lib/validation";

export const runtime = "nodejs";

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
    const { session_id, sender_name, recipient_name, message, guardian_email } = await req.json();

    if (!session_id || !sender_name || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Verify Stripe session
    let senderEmail = "test@example.com";

    if (session_id !== "local_dev_bypass") {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) throw new Error("Missing STRIPE_SECRET_KEY");
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status !== "paid" || session.metadata?.project_id !== "ethernicapsule") {
        return NextResponse.json({ error: "Invalid or unpaid session" }, { status: 400 });
      }

      senderEmail = session.customer_details?.email || "test@example.com";
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabase() as any;
    if (!supabase) throw new Error("Missing DB connection");

    // Prevent duplicate submissions for the same session, bypass if testing locally
    if (session_id !== "local_dev_bypass") {
      const { data: existing } = await supabase
        .from("ethernicapsule_capsules")
        .select("id")
        .eq("stripe_session_id", session_id)
        .single();

      if (existing) {
        return NextResponse.json({ error: "Capsule already sealed for this session" }, { status: 400 });
      }
    }

    // 2. Generate and hash Keys
    const senderKey = generateKey("ETN-CREATOR");
    const capsuleKey = generateKey("ETN-CAPSULE");
    
    const senderKeyHash = hashKey(senderKey);
    const capsuleKeyHash = hashKey(capsuleKey);

    // 3. Insert record
    const { error: insertError } = await supabase
      .from("ethernicapsule_capsules")
      .insert({
        stripe_session_id: session_id,
        sender_name: sanitizeString(sender_name, 100),
        sender_email: sanitizeString(senderEmail, 150),
        recipient_name: recipient_name ? sanitizeString(recipient_name, 100) : null,
        guardian_email: guardian_email ? sanitizeString(guardian_email, 150) : null,
        message: sanitizeString(message, 15000), // Allowing long deep text
        sender_key_hash: senderKeyHash,
        capsule_key_hash: capsuleKeyHash,
      });

    if (insertError) throw new Error(`DB Insert Error: ${insertError.message}`);

    // 4. Send Emails
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    
    // Email 1 -> Creator
    await sendCreatorEmail({
      to: senderEmail,
      senderKey,
      capsuleKey: guardian_email ? undefined : capsuleKey,
      siteUrl
    });

    // Emails to Guardian if exists
    if (guardian_email) {
      const guardianEmailsRaw = guardian_email.split(',').map((e: string) => e.trim()).filter(Boolean);
      // Validar un poco que sean correos (opcional) pero Resend igual descartará mal formados.
      if (guardianEmailsRaw.length > 0) {
        const splitName = sender_name.split(" ")[0] || "Someone";
        await sendGuardianAwarenessEmail({
          to: guardianEmailsRaw,
          senderFirstName: splitName
        });
        // Delay slightly for ceremony impact
        setTimeout(async () => {
          await sendGuardianKeyEmail({
            to: guardianEmailsRaw,
            capsuleKey,
            siteUrl
          });
        }, 3000);
      }
    }

    return NextResponse.json({ success: true });

  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Capsule Seal Error:", errorMsg);
    return NextResponse.json({ error: "Failed to seal capsule" }, { status: 500 });
  }
}
