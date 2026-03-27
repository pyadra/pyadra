import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sanitizeString, validateAmount } from "@/app/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// cache opcional
let stripeClient: Stripe | null = null;
function getStripe(): Stripe | null {
  if (stripeClient) return stripeClient;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null; // ← no throw en top-level
  stripeClient = new Stripe(key);
  return stripeClient;
}

export async function POST(req: Request) {
  try {
    const { amount, intent, project_id, supporter_name, supporter_email, is_anonymous, support_message } = await req.json();
    // ---- Validation ----
    if (!validateAmount(amount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    const safeName = sanitizeString(supporter_name);
    const safeEmail = sanitizeString(supporter_email, 100);
    const safeMessage = sanitizeString(support_message, 120);

    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const sessionMetadata = {
      project_id: project_id || "orbit-77",
      intent: intent || "orbit-support", 
      supporter_name: safeName || "Anonymous",
      supporter_email: safeEmail || "",
      is_anonymous: String(!!is_anonymous),
      support_message: safeMessage || "",
      season_label: "Season 1"
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: safeEmail ? safeEmail : undefined,
      currency: "aud",
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: Number(amount),
            product_data: {
              name: "Orbit 77 — Season Credential",
              description: "Supporting the distribution of Season 1. A permanent archive entry.",
              metadata: sessionMetadata,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/transmission-confirmed?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/projects/orbit`,
      metadata: sessionMetadata,
    });

    // Minimal response – only the URL needed by the client
    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    // Log full error on server, but return generic message to client
    console.error("Stripe error:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}