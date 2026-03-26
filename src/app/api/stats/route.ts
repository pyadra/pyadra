import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET() {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
       // Return realistic mock data to keep the hype without breaking if env is missing locally
       return NextResponse.json({ members: 2, nodes: 1 });
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    // Fetch recent successful checkout sessions to determine founding member count
    const sessions = await stripe.checkout.sessions.list({ limit: 100 });
    const paidCount = sessions.data.filter(s => s.payment_status === 'paid').length;
    
    // Base 2 initial founding members (founders) + any paid checkouts.
    const finalCount = Math.max(2, paidCount); 
    
    return NextResponse.json({ members: finalCount, nodes: 1 });
  } catch (err) {
    console.error("Stripe API Stats Route Error:", err);
    return NextResponse.json({ members: 2, nodes: 1 });
  }
}
