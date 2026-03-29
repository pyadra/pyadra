import { NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabase } from "@/app/lib/db";
import { sanitizeString } from "@/app/lib/validation";

export const runtime = "nodejs";

function hashKey(key: string) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { capsule_id, key, recipient_name, message, guardian_email } = await req.json();

    if (!capsule_id || !key || !message) {
      return NextResponse.json({ error: "Missing identity or message payload." }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabase() as any;
    if (!supabase) throw new Error("Missing DB connection");

    const senderHash = hashKey(key);

    const { data: capsule, error } = await supabase
      .from("ethernicapsule_capsules")
      .select("id, created_at, status")
      .eq("id", capsule_id)
      .eq("sender_key_hash", senderHash)
      .single();

    if (error || !capsule) {
      return NextResponse.json({ error: "Cryptographic denial. Key invalid." }, { status: 403 });
    }

    // Check 24-hour grace period constraint
    const createdDate = new Date(capsule.created_at).getTime();
    const hoursSinceCreation = (Date.now() - createdDate) / (1000 * 60 * 60);

    if (hoursSinceCreation > 24) {
      return NextResponse.json({ error: "The seal has crystallized. It is too late to alter the past." }, { status: 403 });
    }

    // Update capsule
    const { error: updateError } = await supabase
      .from("ethernicapsule_capsules")
      .update({
        recipient_name: recipient_name ? sanitizeString(recipient_name, 100) : null,
        message: sanitizeString(message, 15000),
        guardian_email: guardian_email ? sanitizeString(guardian_email, 150) : null,
        last_edited_at: new Date().toISOString()
      })
      .eq("id", capsule.id);

    if (updateError) {
      throw new Error("DB Update Error: " + updateError.message);
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Grace Period Edit Error:", err);
    return NextResponse.json({ error: "Failed to revise the seal." }, { status: 500 });
  }
}
