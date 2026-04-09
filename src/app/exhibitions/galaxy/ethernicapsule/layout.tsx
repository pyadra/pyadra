import { Cormorant_Garamond, EB_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '600', '700'], 
  style: ['normal', 'italic'],
  variable: '--font-cormorant' 
});

const ebGaramond = EB_Garamond({ 
  subsets: ['latin'], 
  weight: ['400', '500'], 
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond' 
});

export const metadata = {
  title: "EterniCapsule · A Pyadra Node",
  description: "A permanent sealed letter. Opened only when the time comes.",
};

export default function EterniCapsuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${cormorant.variable} ${ebGaramond.variable} min-h-screen bg-[#060504] text-[#E8D9BB] font-[family-name:var(--font-eb-garamond)] selection:bg-[#7A5230]/40 overflow-x-hidden`}>
      {children}
    </div>
  );
}
