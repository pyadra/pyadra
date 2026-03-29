'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Capsule3D from './Capsule3D';

export default function EterniCapsuleEntry() {
  const [fade, setFade] = useState(false);
  const [particles, setParticles] = useState<Array<{
    width: string, height: string, top: string, left: string, opacity: number, animation: string
  }>>([]);

  useEffect(() => {
    // Basic orchestrator for the entry fade
    setTimeout(() => setFade(true), 500);

    // Generate deterministic particles inside effect to respect React purity
    setParticles([...Array(15)].map(() => ({
      width: `${Math.random() * 2 + 1}px`,
      height: `${Math.random() * 2 + 1}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.4 + 0.1,
      animation: `pulse ${Math.random() * 5 + 3}s infinite alternate`
    })));
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative bg-[#060504] select-none selection:bg-[#C4A882] selection:text-[#060504]">
      
      {/* Subtle Star Particles Base */}
      <div className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-[3000ms] ${fade ? 'opacity-30' : 'opacity-0'}`}>
        {particles.map((p, i) => (
           <div 
             key={i} 
             className="absolute bg-[#C4A882] rounded-full"
             style={p}
           ></div>
        ))}
      </div>

      <div className={`w-full max-w-4xl mx-auto px-6 relative z-10 transition-all duration-[2000ms] ${fade ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'}`}>
        
        {/* HERO SECTION */}
        <div className="min-h-[90vh] flex flex-col items-center justify-center pt-20">
          <div className="flex justify-between w-full items-center mb-12">
            <Link href="/" className="text-[#3A2E22] text-[10px] tracking-[0.3em] uppercase hover:text-[#C4A882] transition-colors duration-500" style={{ fontFamily: 'var(--font-cormorant)' }}>
              [ ← BACK TO PYADRA ]
            </Link>
            <div className="text-[#7A6A55] uppercase tracking-[0.4em] text-[10px]" style={{ fontFamily: 'var(--font-cormorant)' }}>
               [ THE SILENT LETTER ]
            </div>
            <div className="w-[100px]"></div> {/* Spacer for symmetry */}
          </div>
          
          <div className="relative mb-12 flex justify-center w-full">
             <Capsule3D isSealed={false} />
          </div>

          <h1 className="text-4xl md:text-5xl italic text-[#E8D9BB] mt-16 font-normal text-center" style={{ fontFamily: 'var(--font-cormorant)' }}>
            EterniCapsule
          </h1>
          
          <p className="text-[#C4A882] max-w-md text-center text-[13px] tracking-[0.15em] mt-6 leading-loose" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Some artifacts must outlast the moment they were forged.
          </p>

          <div className="flex flex-col items-center mt-8 mb-16 text-center">
            <div className="text-[#C4A882] text-sm tracking-[0.2em] mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>THE SILENT LETTER</div>
            <div className="text-[#C4A882] text-sm tracking-widest mt-1" style={{ fontFamily: 'var(--font-cormorant)' }}>A$9</div>
            <div className="text-[#3A2E22] text-[11px] tracking-[0.15em] italic mt-3" style={{ fontFamily: 'var(--font-eb-garamond)' }}>One letter. Permanent. Yours.</div>
          </div>

          <Link href="#lore">
            <div className="w-[1px] h-16 bg-gradient-to-b from-[#C4A882] to-transparent animate-pulse opacity-50 cursor-pointer"></div>
          </Link>
        </div>

        {/* LORE & DASHBOARD SECTION */}
        <div id="lore" className="min-h-screen py-32 flex flex-col items-center gap-32 border-t border-[rgba(196,168,130,0.1)]">
           
           <div className="max-w-xl text-center">
              <h2 className="text-[#E8D9BB] font-normal italic text-3xl mb-8" style={{ fontFamily: 'var(--font-cormorant)' }}>The Philosophy of Preservation</h2>
              <p className="text-[#AAAAAA] text-[15px] leading-loose mb-6 font-serif">
                Memory is fragile. Digital noise buries our most profound thoughts. EterniCapsule is not messaging; it is architecture for emotion. We forge a monolithic vault that withstands the erosion of time, protecting your words until they are summoned.
              </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full max-w-3xl">
              <div className="flex flex-col items-center text-center">
                 <div className="text-[#C4A882] text-xl font-mono mb-4">01</div>
                 <div className="text-[#E8D9BB] uppercase text-[10px] tracking-widest mb-3" style={{ fontFamily: 'var(--font-cormorant)' }}>Write</div>
                 <div className="text-[#7A6A55] text-sm font-serif leading-relaxed">Empty your mind into the void. Without constraints. Without fear of immediate judgment.</div>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="text-[#C4A882] text-xl font-mono mb-4">02</div>
                 <div className="text-[#E8D9BB] uppercase text-[10px] tracking-widest mb-3" style={{ fontFamily: 'var(--font-cormorant)' }}>Seal</div>
                 <div className="text-[#7A6A55] text-sm font-serif leading-relaxed">The vault locks via an immutable cryptographic threshold. The contents vanish from plain sight.</div>
              </div>
              <div className="flex flex-col items-center text-center">
                 <div className="text-[#C4A882] text-xl font-mono mb-4">03</div>
                 <div className="text-[#E8D9BB] uppercase text-[10px] tracking-widest mb-3" style={{ fontFamily: 'var(--font-cormorant)' }}>Wait</div>
                 <div className="text-[#7A6A55] text-sm font-serif leading-relaxed">You hold the Sender Key. Your designated guardians hold the Capsule Key. Time dictates the rest.</div>
              </div>
           </div>

           <div className="max-w-md w-full border border-[rgba(196,168,130,0.2)] bg-[#0A0806] p-10 mt-16 flex flex-col items-center text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               <h3 className="text-[#E8D9BB] uppercase font-mono tracking-widest text-xs mb-6">The Threshold</h3>
               <p className="text-[#7A6A55] text-[14px] italic leading-relaxed mb-10" style={{ fontFamily: 'var(--font-cormorant)' }}>
                 Once sealed, there is no editing. No retracting. <br/><br/>
                 The creation of the vault requires a $9 AUD toll to guarantee indefinite offline and online storage architecture. You will not be charged until the letter is complete and you are ready.
               </p>
               <Link 
                 href="/ethernicapsule/compose"
                 className="w-full border border-[#C4A882] bg-[#C4A882] px-10 py-[14px] text-[#060504] tracking-[0.3em] text-[11px] uppercase transition-all duration-500 hover:bg-transparent hover:text-[#C4A882] font-semibold"
                 style={{ fontFamily: 'var(--font-cormorant)' }}
               >
                 BEGIN THE RITUAL
               </Link>

               <Link href="/ethernicapsule/unlock" className="mt-8 text-[10px] text-[#7A6A55] hover:text-[#C4A882] uppercase tracking-[0.2em] transition-colors" style={{ fontFamily: 'var(--font-cormorant)' }}>
                 I ALREADY HAVE A KEY
               </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
