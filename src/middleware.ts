import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// --- Simple in-memory rate limiter (per server instance) ---
// Not bulletproof across serverless instances, but stops casual abuse:
// script-kiddie flooding of /api/observer, contact spam, checkout hammering.
const RATE_LIMIT = 30; // requests per window per IP
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    // Opportunistic cleanup so the map never grows unbounded
    if (hits.size > 10_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

export function middleware(request: NextRequest) {
  // Redirect old /ethernicapsule URLs to new location
  if (request.nextUrl.pathname.startsWith('/ethernicapsule')) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = newUrl.pathname.replace('/ethernicapsule', '/exhibitions/galaxy/ethernicapsule');
    return NextResponse.redirect(newUrl);
  }

  // Redirect old /projects/* URLs to new /exhibitions/galaxy/* structure
  if (request.nextUrl.pathname.startsWith('/projects/ethernicapsule') ||
      request.nextUrl.pathname.startsWith('/projects/orbit') ||
      request.nextUrl.pathname.startsWith('/projects/figurines')) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = newUrl.pathname.replace('/projects/', '/exhibitions/galaxy/');
    return NextResponse.redirect(newUrl, 301); // 301 = permanent redirect
  }

  // Rate-limit API routes (pages are static/cached and don't need it)
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';
    // Never throttle Stripe's webhook calls
    if (!request.nextUrl.pathname.startsWith('/api/stripe/') && isRateLimited(ip)) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }
  }

  // Create a response object
  const response = NextResponse.next();

  // 1. Set Security Headers (Helmet equivalents for Next.js Edge)
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com https://cdn.pixabay.com https://files.stripe.com https://img.youtube.com https://i.ytimg.com; font-src 'self' data:; connect-src 'self' blob: data: https://va.vercel-scripts.com; frame-src 'self' https://js.stripe.com https://www.youtube.com;`
  );

  // 2. Set CORS Headers for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Determine the trusted origin from environment variables
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const requestOrigin = request.headers.get('origin');
    
    // Only allow CORS if the request comes from our trusted site URL, otherwise default to siteUrl
    const allowedOrigin = (requestOrigin === siteUrl) ? requestOrigin : siteUrl;
    
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: response.headers,
      });
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Apply to all API routes
    '/api/:path*',
    // Apply to page routes except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
