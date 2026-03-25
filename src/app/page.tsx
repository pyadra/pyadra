"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./components/Scene"), { ssr: false });

export default function ShadowEarthHome() {
  const [hovered, setHovered] = useState(false); // Controls the internal amber spark and sand dust natively inside WebGL

  return (
    <div className="min-h-screen bg-[#000000] text-[#E3DAC9] flex flex-col justify-center items-center relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Scene hovered={hovered} />
      </div>

      {/* Extreme dark vignette to kill all edge light entirely and frame the central void */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)] pointer-events-none z-0 mix-blend-multiply" />

      {/* STEALTH UI HUD (10% Opacity Ghost Etched into the screen edges as requested) */}
      <div className="absolute top-8 right-8 md:top-12 md:right-12 z-10 pointer-events-none text-right opacity-[0.15]">
        <p className="text-[8px] font-mono tracking-[0.4em] text-[#E3DAC9] uppercase mb-1">
          SYSTEM: ACTIVE
        </p>
        <p className="text-[8px] font-mono tracking-[0.3em] text-[#E3DAC9] uppercase">
          NODE: EARTH SHADOW
        </p>
      </div>
      <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-10 pointer-events-none opacity-[0.15]">
        <p className="text-[8px] font-mono tracking-[0.4em] text-[#E3DAC9] uppercase">
          [ ENCRYPTED NETWORK ]
        </p>
      </div>

      {/* 
         The Artifact Typography Overlay 
         (DOM Mouse physics removed completely to free up the UI thread and permanently uncap framerate)
      */}
      <div className="relative z-20 w-full h-full flex justify-center items-center pointer-events-none">
        
        <div className="relative flex flex-col items-center justify-center p-8 md:p-16 w-full max-w-[800px] h-[800px] pointer-events-auto">
          
          {/* THE LITHIC PULSE (Smoky Quartz rhythmic breathing core) */}
          <motion.div 
            animate={{ opacity: [0.05, 0.2, 0.05], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#2D2926] rounded-full blur-[100px] pointer-events-none z-0"
          />

          {/* DEV: EDIT THE PRE-TITLE TEXT BELOW */}
          {/* RITUAL PRE-TITLE */}
          <h2 className="relative z-10 text-[10px] md:text-[11px] tracking-[0.6em] uppercase mb-12 font-sans font-light text-[#FFB000] mix-blend-screen drop-shadow-[0_0_15px_rgba(255,176,0,0.5)]">
            [ The Core ]
          </h2>

          {/* DEV: EDIT THE PYADRA LOGOMARK BRANDING BELOW */}
          {/* PYADRA SCULPT - Pure ORO / Gold Drop (Downscaled for true elegance) */}
          <h1 
            className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-serif italic font-light tracking-widest mb-6 select-none leading-none"
            style={{ 
              textShadow: "1px 1px 0px rgba(255,255,255,0.15), -1px -1px 3px rgba(0,0,0,0.8)" 
            }}
          >
            <span className="bg-gradient-to-br from-[#FFFFFF] via-[#FFB000] to-[#503500] bg-clip-text text-transparent">
              Pyadra
            </span>
          </h1>

          {/* DEV: EDIT THE PRIMARY MANTRA/SLOGAN TEXT BELOW */}
          {/* RITUAL COPYWRITING - 'People helping people' */}
          <p className="relative z-10 text-[10px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-light leading-[3] text-center max-w-2xl mb-24 text-[#E3DAC9]/70 px-4 drop-shadow-md">
            An ecosystem etched in stone.<br/>
            <span className="mt-4 block font-serif italic text-sm text-[#FFB000]/90 tracking-[0.2em] md:tracking-[0.3em] drop-shadow-[0_0_15px_rgba(255,176,0,0.6)]">
              A ritual of people helping people.
            </span>
          </p>

          {/* DEV: EDIT THE MAIN ENTRY BUTTON TEXT BELOW */}
          {/* THE CATALYST TRIGGER HITBOX */}
          <div className="relative z-10 flex flex-col items-center mt-6">
            <Link 
              href="/projects" 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              className="group flex flex-col items-center gap-6 transition-all duration-1000"
            >
               <span className="text-[10px] uppercase tracking-[0.5em] font-sans font-bold text-[#E3DAC9]/70 group-hover:text-[#FFB000] group-hover:drop-shadow-[0_0_20px_rgba(255,176,0,0.8)] transition-all duration-700">
                 Enter The Core
               </span>
               {/* Transmitted Gold Laser Connector */}
               <div className="w-[1px] h-[60px] bg-gradient-to-b from-[#E3DAC9]/20 to-transparent group-hover:h-[80px] group-hover:from-[#FFB000] group-hover:shadow-[0_0_30px_#FFB000] transition-all duration-[1000ms] ease-out" />
            </Link>
          </div>

          {/* DEV: ULTRA-MINIMALIST FOOTER FOR COMPLIANCE & MANIFESTO */}
          <div className="absolute bottom-6 md:bottom-10 left-0 w-full flex justify-center items-center gap-4 md:gap-8 text-[8px] font-mono tracking-widest uppercase opacity-20 hover:opacity-100 transition-opacity duration-1000 z-50 px-6 text-center text-[#E3DAC9]">
             <Link href="/manifesto" className="hover:text-[#FFB000] transition-colors focus:opacity-100">Manifesto</Link>
             <span className="text-[#FFB000]/30 hidden md:inline">|</span>
             <Link href="/legal/terms" className="hover:text-[#FFB000] transition-colors focus:opacity-100">Terms of Protocol</Link>
             <span className="text-[#FFB000]/30 hidden md:inline">|</span>
             <Link href="/legal/privacy" className="hover:text-[#FFB000] transition-colors focus:opacity-100">Privacy Data</Link>
             <span className="text-[#FFB000]/30 hidden md:inline">|</span>
             <a href="mailto:invest@pyadra.com" className="hover:text-[#FFB000] transition-colors focus:opacity-100">Contact Core</a>
          </div>

        </div>
      </div>
    </div>
  );
}