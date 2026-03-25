import './globals.css'
import CustomCursor from "./components/CustomCursor";
import Preloader from "./components/Preloader";
import AmbientAudio from "./components/AmbientAudio";
import { Inter, Space_Grotesk } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', weight: ['400','600','700'] as any, display: 'swap' })

export const metadata = {
  title: 'Pyadra - The Path of Light',
  description: 'A living network where every action feeds the collective light',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${space.variable}`}>
      <body>
        <Preloader />
        <CustomCursor />
        {children}
        <AmbientAudio />
      </body>
    </html>
  )
}
