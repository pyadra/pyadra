import './globals.css'
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', display: 'swap' })

export const metadata = {
  metadataBase: new URL('https://pyadra.io'),
  title: 'Pyadra - The Path of Light',
  description: 'A living network where every action feeds the collective light. A ritual of people helping people.',
  openGraph: {
    title: 'Pyadra - The Path of Light',
    description: 'A ritual of people helping people. Enter the ecosystem.',
    url: 'https://pyadra.io',
    siteName: 'Pyadra',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Pyadra Core Portal' }],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pyadra - The Path of Light',
    description: 'A ritual of people helping people. Enter the ecosystem.',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${space.variable}`}>
      <body>
         <Providers>
            <Preloader />
            <CustomCursor />
            {children}
            <Analytics />
         </Providers>
      </body>
    </html>
  )
}
