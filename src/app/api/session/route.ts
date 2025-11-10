import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs"; // ✅ export soportado por Next

const key = process.env.STRIPE_SECRET_KEY || "";
if (!key) throw new Error("Missing STRIPE_SECRET_KEY");

const stripe = new Stripe(key); // ← sin apiVersion

export async function GET(req: Request) {
  const session_id = new URL(req.url).searchParams.get("session_id");
  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["payment_intent"],
    });
    return NextResponse.json({ session }, { status: 200 });
  } catch (err) {
    console.error("Stripe session retrieve error:", err);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}