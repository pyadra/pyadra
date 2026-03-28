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

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripe || !whSecret) {
      return NextResponse.json(
        { error: "Missing Stripe env vars on server" },
        { status: 500 }
      );
    }

    const sig = req.headers.get("stripe-signature") || "";
    const rawBody = await req.text();

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, sig, whSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${errorMessage}` },
        { status: 400 }
      );
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("✅ checkout.session.completed", session.id);

      // Extract metadata safely
      const metadata = session.metadata || {};
      if (metadata.project_id === "orbit-77") {
         try {
           const { getSupabase } = await import('@/app/lib/db');
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           const supabase = getSupabase() as any;
           
           // Generate a unique collectible code deterministically from Stripe session
           // to guarantee perfectly matching UI and email without race conditions
           const suffix = session.id.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-6);
           const credentialCode = `O77-S1-${suffix}`;
           const amountAud = (session.amount_total || 0) / 100;
           
           const supporterName = metadata.supporter_name || 'Anonymous';
           const isAnonymous = metadata.is_anonymous === 'true';
           const displayName = isAnonymous ? 'Anonymous' : supporterName;
           const supporterEmail = metadata.supporter_email || session.customer_details?.email || '';
           
           let emailSent = false;
           let supporterId: string | null = null;
           
           // If we have a DB connection, persist identity and credential
           if (supabase) {
             // 1. Resolve or Create persistent supporter identity
             if (supporterEmail) {
               const { data: existingSupporter } = await supabase
                 .from('orbit_supporters')
                 .select('id')
                 .eq('email', supporterEmail)
                 .single();
                 
               if (existingSupporter) {
                 supporterId = existingSupporter.id;
               } else {
                 const { data: newSupporter, error: supporterError } = await supabase
                   .from('orbit_supporters')
                   .insert({
                     email: supporterEmail,
                     display_name: displayName
                   })
                   .select('id')
                   .single();
                   
                 if (newSupporter) {
                   supporterId = newSupporter.id;
                 } else {
                   console.error("Supabase Error (Supporter Creation):", supporterError);
                 }
               }
             }

             // 2. Insert the credential attached to the supporter
             const { error: dbError } = await supabase
               .from('orbit_support_credentials')
               .insert({
                 stripe_checkout_session_id: session.id,
                 stripe_payment_intent_id: session.payment_intent as string,
                 payment_status: 'paid',
                 supporter_id: supporterId,
                 supporter_name: supporterName,
                 supporter_email: supporterEmail,
                 display_name: displayName,
                 is_anonymous: isAnonymous,
                 amount_aud: amountAud,
                 currency: 'aud',
                 support_message: metadata.support_message || null,
                 credential_code: credentialCode,
                 season_label: metadata.season_label || 'Season 1',
                 project_slug: metadata.project_id,
                 paid_at: new Date().toISOString()
               });
               
               if (dbError) {
                 console.error("Supabase Insertion Error (Webhook):", dbError);
               }
           }
           
           // Trigger Email
           if (supporterEmail) {
             const { sendCredentialEmail } = await import('@/app/lib/email');
             
             // Date string for the email
             const dateStr = new Date().toLocaleDateString("en-AU", {
                day: "numeric", month: "long", year: "numeric",
             });
             
             emailSent = await sendCredentialEmail({
                to: supporterEmail,
                supporterName: displayName,
                supporterId,
                amountAud,
                credentialCode,
                seasonLabel: metadata.season_label || 'Season 1',
                dateStr
             });
             
             // Optionally update DB to mark email as sent
             if (supabase && emailSent) {
                await supabase.from('orbit_support_credentials')
                  .update({ email_sent: true, email_sent_at: new Date().toISOString() })
                  .eq('stripe_checkout_session_id', session.id);
             }
           }
           
         } catch(e) {
           console.error("Failed to process Orbit 77 credential issuance:", e);
           // We do NOT throw here because we don't want Stripe to retry and fail if the 
           // payment was already successfully captured.
         }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Webhook error:", errorMessage);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}