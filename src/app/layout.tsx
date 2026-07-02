import './globals.css'
import CustomCursor from "./components/interactive/CustomCursor";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { Fraunces, DM_Sans, IBM_Plex_Mono } from 'next/font/google'

/* Pyadra design system — three fonts, three roles, ONE place.
   Loaded once via next/font (self-hosted, preloaded, no FOUT).
   Mapped to Tailwind's font-serif/sans/mono via CSS vars in globals.css. */

// DISPLAY — Fraunces (variable serif). Wordmark & ceremonial headlines (D1).
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

// TEXT / UI — DM Sans. Page headlines, body, nav, buttons, descriptions (D2–D5).
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
})

// LABELS / PRICES — IBM Plex Mono. Micro-labels, tags, prices, states (D6).
const ibmMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono',
  display: 'swap',
})

/* og:image / twitter:image come from src/app/opengraph-image.tsx
   (Next file convention) — no hand-written image URLs here. */
export const metadata = {
  metadataBase: new URL('https://pyadra.io'),
  title: {
    default: 'Pyadra — Where ideas find the people who make them real',
    template: '%s — Pyadra',
  },
  description: 'A museum of living projects, documented and verified. Contribute money, work or skills — and own part of something that matters. Discover. Connect. Build. Buy.',
  openGraph: {
    title: 'Pyadra — Where ideas find the people who make them real',
    description: 'A museum of living projects, documented and verified. Contribute money, work or skills — and own part of something that matters.',
    url: 'https://pyadra.io',
    siteName: 'Pyadra',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pyadra — Where ideas find the people who make them real',
    description: 'A museum of living projects, documented and verified. Contribute money, work or skills — and own part of something that matters.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable} ${ibmMono.variable}`}
    >
      <body className="font-sans">
         <Providers>
            <CustomCursor />
            {children}
            <Analytics />
         </Providers>
      </body>
    </html>
  )
}
