import './globals.css'
import CustomCursor from "./components/interactive/CustomCursor";
// import Preloader from "./components/Preloader"; // removed unused component
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Space_Grotesk, Cormorant_Garamond, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' })
// Brand typography per Company_Master: Cormorant Garamond (serif, emotional,
// titles) + JetBrains Mono (data, labels, metrics)
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata = {
  metadataBase: new URL('https://pyadra.io'),
  title: 'Pyadra — Where ideas find the people who make them real',
  description: 'A museum of living projects, documented and verified. Contribute money, work or skills — and own part of something that matters. Lo que dejas importa.',
  openGraph: {
    title: 'Pyadra — Where ideas find the people who make them real',
    description: 'A museum of living projects, documented and verified. Contribute money, work or skills — and own part of something that matters.',
    url: 'https://pyadra.io',
    siteName: 'Pyadra',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Pyadra — a museum of living projects' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pyadra — Where ideas find the people who make them real',
    description: 'A museum of living projects, documented and verified. Contribute money, work or skills — and own part of something that matters.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${space.variable} ${cormorant.variable} ${jetbrainsMono.variable}`}>
      <body>
         <Providers>
            <CustomCursor />
            {children}
            <Analytics />
         </Providers>
      </body>
    </html>
  )
}
