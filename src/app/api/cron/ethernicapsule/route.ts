import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';
import { sendGuardianMasterEmail } from '@/app/lib/ethernicapsule-email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabase() as any;
    if (!supabase) throw new Error("Missing DB connection");

    // Query capsules ready to deliver
    const { data: capsules, error } = await supabase
      .from('ethernicapsule_capsules')
      .select('id, stripe_session_id, sender_name, guardian_email')
      .eq('status', 'sealed')
      .eq('guardian_key_delivered', false)
      .lte('deliver_at', new Date().toISOString())
      .not('guardian_email', 'is', null)
      .not('guardian_email', 'eq', '')
      .not('stripe_session_id', 'is', null);

    if (error) throw new Error(`DB Error: ${error.message}`);
    if (!capsules || capsules.length === 0) return NextResponse.json({ message: "No keys due for delivery" });

    // We rely on Stripe as the ultimate secure vault for the unhashed Master key.
    // Supabase does NOT store unhashed keys, so the Cron job retrieves them safely.
    const Stripe = (await import('stripe')).default;
    const stripeConfig = process.env.STRIPE_SECRET_KEY;
    const stripe = stripeConfig ? new Stripe(stripeConfig) : null;
    if (!stripe) throw new Error("Missing Stripe configuration");

    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pyadra.io";
    let deliveredCount = 0;

    for (const capsule of capsules) {
      if (capsule.stripe_session_id === 'local_dev_bypass') continue;

      try {
        const session = await stripe.checkout.sessions.retrieve(capsule.stripe_session_id);
        const rawCapsuleKey = session.metadata?.capsule_key;

        if (rawCapsuleKey && capsule.guardian_email) {
           const guardianEmailsRaw = capsule.guardian_email.split(',').map((e: string) => e.trim()).filter(Boolean);
           const splitName = capsule.sender_name.split(" ")[0] || "Someone";

           const sent = await sendGuardianMasterEmail({
             to: guardianEmailsRaw,
             senderFirstName: splitName,
             capsuleKey: rawCapsuleKey,
             siteUrl
           });

           if (sent) {
             await supabase.from("ethernicapsule_capsules").update({ guardian_key_delivered: true }).eq("id", capsule.id);
             deliveredCount++;
           }
        }
      } catch (err) {
        console.error(`Failed to process chronos delivery for capsule ${capsule.id}:`, err);
      }
    }

    return NextResponse.json({ success: true, delivered: deliveredCount });
  } catch (err: unknown) {
    console.error("Cron Error:", err);
    return NextResponse.json({ error: "Chronos job failed" }, { status: 500 });
  }
}
