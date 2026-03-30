import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect old EterniCapsule URLs to new location
  if (request.nextUrl.pathname.startsWith('/ethernicapsule')) {
    const newUrl = request.nextUrl.clone();
    newUrl.pathname = newUrl.pathname.replace('/ethernicapsule', '/projects/ethernicapsule');
    return NextResponse.redirect(newUrl);
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
    `default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://va.vercel-scripts.com https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data: https://images.unsplash.com https://cdn.pixabay.com https://files.stripe.com https://img.youtube.com https://i.ytimg.com; font-src 'self' data:; connect-src * blob: data:; frame-src 'self' https://js.stripe.com https://www.youtube.com;`
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
