import { NextResponse } from 'next/server';

// Simulated DB counter using Node.js global context.
// In a true serverless Vercel environment, this resets when the lambda spins down. 
// A robust Postgres integration is recommended for persistent memory.
declare global {
  var _observerCount: number | undefined;
}

export async function GET() {
  if (typeof global._observerCount === 'undefined') {
    global._observerCount = Math.floor(Math.random() * 40) + 1; // start slightly seeded so no one feels completely alone
  } else {
    global._observerCount++;
  }
  
  return NextResponse.json({ id: global._observerCount });
}
