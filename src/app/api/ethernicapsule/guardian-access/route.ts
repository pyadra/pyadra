import { NextResponse } from 'next/server';
import { getSupabase } from '@/app/lib/db';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function hashKey(key: string) {
  return crypto.createHash('sha256').update(key).digest('hex');
}

export async function POST(req: Request) {
  try {
    const { guardianToken } = await req.json();

    if (!guardianToken) {
      return NextResponse.json({ error: 'Guardian token required' }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabase() as any;
    if (!supabase) throw new Error("Missing DB connection");

    // Hash the guardian token to look up the capsule
    const tokenHash = hashKey(guardianToken);

    const { data: capsule, error } = await supabase
      .from('ethernicapsule_capsules')
      .select('id, stripe_session_id, sender_name, deliver_at, guardian_key_delivered')
      .eq('guardian_token_hash', tokenHash)
      .eq('status', 'sealed')
      .single();

    if (error || !capsule) {
      return NextResponse.json({ error: 'Invalid guardian access token' }, { status: 404 });
    }

    const now = new Date();
    const deliverAt = new Date(capsule.deliver_at);

    // Check if delivery time has passed
    if (now < deliverAt) {
      return NextResponse.json({
        ready: false,
        deliverAt: capsule.deliver_at,
        message: 'The capsule is not ready yet. Check back after the delivery date.'
      });
    }

    // Delivery time has passed - retrieve the key from Stripe
    if (capsule.stripe_session_id === 'local_dev_bypass') {
      return NextResponse.json({
        ready: true,
        capsuleKey: 'DEV-TEST-KEY',
        senderName: capsule.sender_name
      });
    }

    const Stripe = (await import('stripe')).default;
    const stripeConfig = process.env.STRIPE_SECRET_KEY;
    const stripe = stripeConfig ? new Stripe(stripeConfig) : null;
    if (!stripe) throw new Error("Missing Stripe configuration");

    const session = await stripe.checkout.sessions.retrieve(capsule.stripe_session_id);
    const capsuleKey = session.metadata?.capsule_key;

    if (!capsuleKey) {
      return NextResponse.json({ error: 'Capsule key not found' }, { status: 500 });
    }

    // Mark as delivered
    if (!capsule.guardian_key_delivered) {
      await supabase
        .from('ethernicapsule_capsules')
        .update({ guardian_key_delivered: true })
        .eq('id', capsule.id);
    }

    return NextResponse.json({
      ready: true,
      capsuleKey,
      senderName: capsule.sender_name
    });

  } catch (err: unknown) {
    console.error("Guardian access error:", err);
    return NextResponse.json({ error: "Failed to access capsule" }, { status: 500 });
  }
}
