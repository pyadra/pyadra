import { NextResponse } from "next/server";
import { getSupabase } from "@/app/lib/db";
import { sendFigurineCustomerEmail, sendFigurineFounderEmail } from "@/app/lib/figurines-email";
import { sanitizeString } from "@/app/lib/validation";
import Stripe from "stripe";
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

async function handleInitialUpload(req: Request, formData: FormData, email: string) {
  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: "DB_MISSING" }, { status: 500 });
  }

  // Collect all photo files (photo_0, photo_1, etc.)
  const photoFiles: File[] = [];
  let index = 0;
  while (true) {
    const file = formData.get(`photo_${index}`) as File | null;
    if (!file) break;
    photoFiles.push(file);
    index++;
  }

  // Validate photo count
  if (photoFiles.length < 3 || photoFiles.length > 5) {
    return NextResponse.json({ error: "Please upload 3-5 photos" }, { status: 400 });
  }

  // Validate email
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  // Generate Order ID
  const orderId = crypto.randomUUID();
  const bucketName = 'figurines_sculpts';

  // Upload photos to storage
  const photoUrls: string[] = [];
  for (let i = 0; i < photoFiles.length; i++) {
    const file = photoFiles[i];
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `${orderId}/photo_${i}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true
      });

    if (uploadError) {
      console.error(`Photo Upload Error (${i}):`, uploadError);
      return NextResponse.json({ error: "Failed to upload photos" }, { status: 500 });
    }

    // Create signed URL (1 year)
    const { data: signedUrlData } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(uploadData.path, 60 * 60 * 24 * 365);

    if (signedUrlData && signedUrlData.signedUrl) {
      photoUrls.push(signedUrlData.signedUrl);
    }
  }

  // Create order record with photos_uploaded status
  const amountAud = 17500; // $175 AUD
  const { error: insertError } = await supabase
    .from("figurine_orders")
    .insert({
      id: orderId,
      status: "photos_uploaded",
      stripe_session_id: `pending_${orderId}`,
      tier: 'figurine_only',
      amount_aud: amountAud / 100,
      customer_email: sanitizeString(email, 255),
      photo_urls: photoUrls,
    });

  if (insertError) {
    console.error("Order Insert Error:", insertError);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  // Create Stripe checkout session
  const stripe = getStripe();
  if (!stripe) {
    console.warn("No Stripe Key - returning Local Bypass URL");
    await supabase.from("figurine_orders").update({ stripe_session_id: "local_dev_bypass" }).eq("id", orderId);
    return NextResponse.json({
      checkoutUrl: `${req.headers.get("origin") || "http://localhost:3000"}/exhibitions/galaxy/figurines/forge?session_id=local_dev_bypass`
    });
  }

  const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "https://pyadra.io";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    currency: "aud",
    client_reference_id: orderId,
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: "aud",
          unit_amount: amountAud,
          product_data: {
            name: "Pyadra Figurine",
            description: "Hand-painted chibi figurine created from your photos. AI Modeled, 3D Printed, and Painted.",
            metadata: { project_id: "figurines" },
          },
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/exhibitions/galaxy/figurines/forge?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/exhibitions/galaxy/figurines?cancelled=true`,
    metadata: {
      project_id: "figurines",
      order_id: orderId,
      tier: 'figurine_only'
    },
  });

  // Link Stripe session to order
  await supabase.from("figurine_orders").update({ stripe_session_id: session.id }).eq("id", orderId);

  return NextResponse.json({ checkoutUrl: session.url });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // Check if this is initial upload (before payment) or post-payment upload
    const sessionId = formData.get('session_id') as string | null;
    const email = formData.get('email') as string | null;

    // FLOW 1: Initial upload before payment (email + photos only)
    if (!sessionId && email) {
      return handleInitialUpload(req, formData, email);
    }

    // FLOW 2: Post-payment upload (session_id + name + address + photos)
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const frontFile = formData.get('front') as File;
    const leftFile = formData.get('left') as File;
    const rightFile = formData.get('right') as File;

    if (!sessionId || !name || !address || !frontFile || !leftFile || !rightFile) {
       return NextResponse.json({ error: "Missing required geometry data or fields." }, { status: 400 });
    }

    const supabase = getSupabase();
    if (!supabase) throw new Error("Missing DB connection");

    let finalSessionId = sessionId;
    // Allow bypassing stripe session ID purely for local dev testing
    if (sessionId.startsWith('local_dev_bypass') || sessionId.startsWith('cs_test')) {
      // Fetch the actual record using the order attached to it if available, or fetch latest pending
      const { data: bypassData } = await supabase.from('figurine_orders').select('*').eq('stripe_session_id', 'local_dev_bypass').single();
      if (bypassData) finalSessionId = 'local_dev_bypass';
    }

    // 1. Authenticate Order via Session ID
    const { data: order, error: orderError } = await supabase
       .from('figurine_orders')
       .select('*')
       .eq('stripe_session_id', finalSessionId)
       .single();

    if (orderError || !order) {
       return NextResponse.json({ error: "Order context not found. Unauthorized." }, { status: 403 });
    }

    if (order.status !== 'pending' && order.status !== 'paid') {
       return NextResponse.json({ error: "Order is already being forged." }, { status: 400 });
    }

    // 2. Upload to Storage
    const bucketName = 'figurines_sculpts';
    const urls: string[] = [];
    const files = [
       { file: frontFile, type: 'front' },
       { file: leftFile, type: 'left' },
       { file: rightFile, type: 'right' }
    ];

    for (const item of files) {
       const bytes = await item.file.arrayBuffer();
       const buffer = Buffer.from(bytes);
       const ext = item.file.name.split('.').pop() || 'jpg';
       const filePath = `${order.id}/${item.type}.${ext}`;

       const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, buffer, {
             contentType: item.file.type || 'image/jpeg',
             upsert: true
          });

       if (uploadError) {
          console.error(`Storage Upload Error (${item.type}):`, uploadError);
          return NextResponse.json({ error: "Failed to securely transfer geometry." }, { status: 500 });
       }
       
       // Build signed URL (expires in 1 year for the founder to access easily)
       const { data: signedUrlData } = await supabase.storage
          .from(bucketName)
          .createSignedUrl(uploadData.path, 60 * 60 * 24 * 365);
          
       if (signedUrlData && signedUrlData.signedUrl) {
          urls.push(signedUrlData.signedUrl);
       }
    }

    // 3. Update DB
    const cleanName = sanitizeString(name, 100);
    const cleanAddress = sanitizeString(address, 500);

    const { error: finalUpdateError } = await supabase
       .from('figurine_orders')
       .update({
          customer_name: cleanName,
          shipping_address: cleanAddress,
          photo_urls: urls,
          status: 'forging'
       })
       .eq('id', order.id);

    if (finalUpdateError) {
      console.error("DB Update Error:", finalUpdateError);
      return NextResponse.json({ error: "Data linked, but record closure failed." }, { status: 500 });
    }

    // 4. Trigger Emails
    const emailToUse = order.customer_email || "pending@checkout";
    
    // Only send the receipt if we have an actual email (not local dev dummy)
    if (emailToUse && !emailToUse.includes("pending@checkout")) {
       await sendFigurineCustomerEmail({
          to: emailToUse,
          customerName: cleanName.split(' ')[0]
       });
    }

    await sendFigurineFounderEmail({
       orderId: order.id,
       customerName: cleanName,
       customerEmail: emailToUse,
       address: cleanAddress,
       tier: order.tier,
       photoUrls: urls
    });

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("Figurines Upload Fatal Error:", errorMessage);
    return NextResponse.json({ error: "Internal furnace error." }, { status: 500 });
  }
}
