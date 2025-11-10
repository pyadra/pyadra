import Stripe from "stripe";
import { NextResponse } from "next/server";

export const config = { api: { bodyParser: false } } as any;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET || "";
  const raw = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret);
  } catch (err: any) {
    console.error("Webhook signature verify failed:", err.message);
    return new NextResponse("Bad signature", { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const s = event.data.object as Stripe.Checkout.Session;
      // TODO: Persistir en tu DB (project_id, amount_total, currency, customer_email, created)
      // Ejemplo:
      // await db.insertContribution({
      //   projectId: s.metadata?.project_id ?? "collective-fund",
      //   amount: s.amount_total, currency: s.currency,
      //   email: s.customer_details?.email ?? null, sessionId: s.id, createdAt: new Date()
      // });
      console.log("✅ Contribution confirmed:", s.id, s.amount_total, s.currency, s.metadata);
    }
    return new NextResponse("ok", { status: 200 });
  } catch (e: any) {
    console.error("Webhook handler error:", e.message);
    return new NextResponse("server error", { status: 500 });
  }
}