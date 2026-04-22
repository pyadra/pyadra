'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Capsule3D from '../Capsule3D';
import { motion } from 'framer-motion';

export default function EterniCapsuleSealedPage() {
  const [showHeartbeat, setShowHeartbeat] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowHeartbeat(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 select-none bg-[var(--etn-earth)] overflow-hidden">

      {/* Deep Space Radial Gradient Background and Celebration Aura */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, var(--etn-soil) 0%, var(--etn-earth) 60%)' }}></div>
      <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-[3000ms] ${showHeartbeat ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle at 50% 40%, rgba(156,102,68,0.15) 0%, transparent 50%)' }}></div>

      <motion.div
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 2, ease: "easeOut" }}
         className="flex flex-col items-center text-center z-10"
         suppressHydrationWarning
      >
        
        <div className="mb-8 mt-6 relative scale-90 md:scale-100">
          <Capsule3D isSealed={true} />
          
          {/* The amber heartbeat pulse */}
          <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-[var(--etn-copper)] rounded-full blur-[2px] transition-all duration-[2000ms] ${showHeartbeat ? 'opacity-100 animate-pulse shadow-[0_0_20px_var(--etn-copper)]' : 'opacity-0'}`}></div>
          
          {/* Subtle god rays */}
          <div className={`absolute -inset-20 bg-[radial-gradient(ellipse_at_center,_rgba(138,107,68,0.1)_0%,_transparent_60%)] -z-10 transition-all duration-[3000ms] ${showHeartbeat ? 'opacity-100 scale-150 animate-[spin_20s_linear_infinite]' : 'opacity-0 scale-50'}`}></div>
        </div>

        <h1 className="text-3xl md:text-4xl italic font-serif text-[var(--etn-cream)] mb-4 font-light drop-shadow-[0_0_15px_rgba(245,230,204,0.1)]">
          The metal is forged.
        </h1>

        <p className="text-[var(--etn-bronze-bright)] text-sm md:text-base mb-2 font-sans font-light tracking-wide">
          What you wrote is now eternal.
        </p>

        <p className="text-[var(--etn-ash)]/70 text-xs md:text-sm mb-4 font-sans font-light tracking-wide">
          The fire has done its work. Time cannot touch it now.
        </p>

        <p className="text-[var(--etn-cream)]/70 bg-gradient-to-r from-transparent via-[var(--etn-copper)]/10 to-transparent px-6 py-3 border border-[var(--etn-copper)]/20 rounded-full font-mono text-xs mt-8 tracking-wide drop-shadow-[0_0_10px_rgba(156,102,68,0.2)]">
          Check your email. Your Keys are waiting.
        </p>

        <div className="mt-12 w-full text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-[var(--etn-soil)]/60 border border-white/5 rounded-full hover:bg-[var(--etn-copper)]/10 hover:border-[var(--etn-copper)]/40 transition-all duration-500 backdrop-blur-md"
          >
            <span className="text-[var(--etn-bronze)]/80 group-hover:text-[var(--etn-cream)] text-xs tracking-wide uppercase font-mono transition-colors duration-500">
              RETURN TO PYADRA
            </span>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
