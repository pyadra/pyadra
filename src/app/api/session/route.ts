import Stripe from "stripe"; import { NextResponse } from "next/server";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", { apiVersion: "2024-06-20" });

export async function GET(req: Request) {
  const session_id = new URL(req.url).searchParams.get("session_id");
  if (!session_id) return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  const s = await stripe.checkout.sessions.retrieve(session_id);
  return NextResponse.json({ amount_total: s.amount_total, currency: s.currency });
}