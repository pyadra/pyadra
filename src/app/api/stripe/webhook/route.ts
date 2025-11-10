import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ✅ permitido
export const config = { api: { bodyParser: false } } as any;

// ✅ Elimina el apiVersion antiguo o usa el correcto
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
// o si prefieres fijarlo explícitamente:
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2025-10-29.clover" });

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";

  let event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("✅ Payment completed for session:", session.id);
      // Aquí podrías actualizar tu base de datos o enviar un email, etc.
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("Error processing webhook event:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}