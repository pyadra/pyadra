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
      // Webhook received: checkout completed

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
             // 1. Resolve or Create persistent supporter identity using UPSERT
             if (supporterEmail) {
               const { data: upsertedSupporter, error: supporterError } = await supabase
                 .from('orbit_supporters')
                 .upsert(
                   { email: supporterEmail, display_name: displayName },
                   { onConflict: 'email' }
                 )
                 .select('id')
                 .single();

               if (upsertedSupporter) {
                 supporterId = upsertedSupporter.id;
               } else if (supporterError) {
                 throw new Error(`DB Error (Supporter Upsert): ${supporterError.message}`);
               }
             }

             // 2. Insert the credential attached to the supporter (Idempotent via ON CONFLICT)
             const { error: dbError } = await supabase
               .from('orbit_support_credentials')
               .upsert(
                 {
                   stripe_checkout_session_id: session.id,
                   stripe_payment_intent_id: session.payment_intent as string,
                   payment_status: 'paid',
                   supporter_id: supporterId,
                   supporter_name: supporterName,
                   supporter_email: supporterEmail,
                   display_name: displayName,
                   is_anonymous: isAnonymous,
                   amount_aud: Math.floor(amountAud), // Ensure absolute integer
                   currency: 'aud',
                   support_message: metadata.support_message || null,
                   credential_code: credentialCode,
                   season_label: metadata.season_label || 'Season 1',
                   project_slug: metadata.project_id,
                   paid_at: new Date().toISOString()
                 },
                 { onConflict: 'stripe_checkout_session_id' }
               );
               
               if (dbError) {
                 throw new Error(`DB Error (Credential Upsert): ${dbError.message}`);
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
           // MUST throw to Stripe so it retries the webhook payload later!
           const errorMessage = e instanceof Error ? e.message : String(e);
           return NextResponse.json({ error: "Internal processing failed", details: errorMessage }, { status: 500 });
         }
      } else if (metadata.project_id === "ethernicapsule") {
         try {
           const { getSupabase } = await import('@/app/lib/db');
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           const supabase = getSupabase() as any;
           if (!supabase) throw new Error("Missing DB connection in webhook");

           const capsuleId = metadata.capsule_id;
           const senderKey = metadata.sender_key;
           const capsuleKey = metadata.capsule_key;
           const guardianToken = metadata.guardian_token || "";
           const senderName = metadata.sender_name;
           const guardianEmailStr = metadata.guardian_email || "";
           const deliverAtStr = metadata.deliver_at || null;
           const isTimeVault = deliverAtStr && new Date(deliverAtStr).getTime() > Date.now();
           const senderEmail = session.customer_details?.email || "pending@checkout";
           
           if (!capsuleId || !senderKey || !capsuleKey) throw new Error("Missing metadata keys for capsule processing");

           // 1. Update DB to sealed
           const { error: updateError } = await supabase
             .from("ethernicapsule_capsules")
             .update({ 
               status: "sealed", 
               sender_email: senderEmail 
             })
             .eq("id", capsuleId);
             
           if (updateError) throw new Error(`DB Error (Capsule Update): ${updateError.message}`);

           // 2. Send Emails
           const { sendCreatorEmail, sendGuardianMasterEmail } = await import('@/app/lib/ethernicapsule-email');
           const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://pyadra.io";
           
           // Creator Email
           await sendCreatorEmail({
             to: senderEmail,
             senderKey,
             capsuleKey: guardianEmailStr ? undefined : capsuleKey,
             siteUrl
           });

           // Guardian Email
           if (guardianEmailStr) {
             const guardianEmailsRaw = guardianEmailStr.split(',').map((e: string) => e.trim()).filter(Boolean);
             if (guardianEmailsRaw.length > 0) {
                const splitName = senderName.split(" ")[0] || "Someone";
                
                if (isTimeVault) {
                   const { sendGuardianTimeVaultEmail } = await import('@/app/lib/ethernicapsule-email');
                   const deliverStr = new Date(deliverAtStr as string).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
                   await sendGuardianTimeVaultEmail({
                     to: guardianEmailsRaw,
                     senderFirstName: splitName,
                     deliverAtDateStr: deliverStr,
                     guardianToken,
                     siteUrl
                   });
                } else {
                   const { sendGuardianMasterEmail } = await import('@/app/lib/ethernicapsule-email');
                   await sendGuardianMasterEmail({
                     to: guardianEmailsRaw,
                     senderFirstName: splitName,
                     capsuleKey: capsuleKey,
                     siteUrl
                   });
                   // DB tracking
                   await supabase.from("ethernicapsule_capsules").update({ guardian_key_delivered: true }).eq("id", capsuleId);
                }
             }
           }
         } catch(e) {
           console.error("Failed to process EterniCapsule sealing:", e);
           const errorMessage = e instanceof Error ? e.message : String(e);
           return NextResponse.json({ error: "EterniCapsule processing failed", details: errorMessage }, { status: 500 });
         }
      } else if (metadata.project_id === "figurines") {
         try {
           const { getSupabase } = await import('@/app/lib/db');
           // eslint-disable-next-line @typescript-eslint/no-explicit-any
           const supabase = getSupabase() as any;
           if (!supabase) throw new Error("Missing DB connection in webhook");

           const orderId = metadata.order_id;
           const customerEmail = session.customer_details?.email || "pending@checkout";
           
           if (!orderId) throw new Error("Missing metadata order_id for figurines processing");

           // 1. Update DB to paid
           const { error: updateError } = await supabase
             .from("figurine_orders")
             .update({ 
               status: "paid", 
               customer_email: customerEmail 
             })
             .eq("id", orderId);
             
           if (updateError) throw new Error(`DB Error (Figurines Update): ${updateError.message}`);

           // Note: We do NOT send emails here. The customer still needs to upload photos.
           // Emails will be fired from the /forge step once photos and address are provided.

         } catch(e) {
           console.error("Failed to process Figurines order webhook:", e);
           const errorMessage = e instanceof Error ? e.message : String(e);
           return NextResponse.json({ error: "Figurines processing failed", details: errorMessage }, { status: 500 });
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