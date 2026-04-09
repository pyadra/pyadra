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
    <div className="flex flex-col items-center justify-center min-h-screen relative px-4 select-none bg-[#000000] overflow-hidden">
      
      {/* Deep Space Radial Gradient Background and Celebration Aura */}
      <div className="absolute inset-0 pointer-events-none z-0" style={{ background: 'radial-gradient(circle at 50% 50%, #040710 0%, #000000 60%)' }}></div>
      <div className={`absolute inset-0 pointer-events-none z-0 transition-opacity duration-[3000ms] ${showHeartbeat ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle at 50% 40%, rgba(138,107,68,0.15) 0%, transparent 50%)' }}></div>

      <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 2, ease: "easeOut" }}
         className="flex flex-col items-center text-center z-10"
      >
        
        <div className="mb-14 mt-10 relative">
          <Capsule3D isSealed={true} />
          
          {/* The amber heartbeat pulse */}
          <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-[#8A6B44] rounded-full blur-[2px] transition-all duration-[2000ms] ${showHeartbeat ? 'opacity-100 animate-pulse shadow-[0_0_20px_#8A6B44]' : 'opacity-0'}`}></div>
          
          {/* Subtle god rays */}
          <div className={`absolute -inset-20 bg-[radial-gradient(ellipse_at_center,_rgba(138,107,68,0.1)_0%,_transparent_60%)] -z-10 transition-all duration-[3000ms] ${showHeartbeat ? 'opacity-100 scale-150 animate-[spin_20s_linear_infinite]' : 'opacity-0 scale-50'}`}></div>
        </div>

        <h1 className="text-5xl md:text-6xl italic font-[family-name:var(--font-cormorant)] text-[#F5E6CC] mb-6 font-light drop-shadow-[0_0_15px_rgba(245,230,204,0.1)]">
          Your capsule has been sealed.
        </h1>
        
        <p className="text-[#8A6B44] text-[16px] md:text-[18px] mb-4 font-sans font-light tracking-wide">
          It now exists beyond this moment.
        </p>

        <p className="text-[#F5E6CC]/70 bg-gradient-to-r from-transparent via-[#8A6B44]/10 to-transparent px-8 py-4 border border-[#8A6B44]/20 rounded-full font-mono text-[12px] mt-16 tracking-wide drop-shadow-[0_0_10px_rgba(138,107,68,0.2)]">
          Check your email. Your Keys are waiting.
        </p>

        <div className="absolute bottom-12 w-full text-center">
          <Link 
            href="/" 
            className="group inline-flex items-center gap-3 px-6 py-3 bg-[#020308]/60 border border-white/5 rounded-full hover:bg-[#8A6B44]/10 hover:border-[#8A6B44]/40 transition-all duration-500 backdrop-blur-md"
          >
            <span className="text-[#B89968]/80 group-hover:text-[#F5E6CC] text-[9px] tracking-[0.3em] uppercase font-mono transition-colors duration-500">
              RETURN TO PYADRA
            </span>
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
