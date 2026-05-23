"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import GreenDust from "../components/ui/GreenDust";

// Gem Icon from Galaxy
const GemIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#059669] drop-shadow-md">
    <polygon points="50 5, 95 27.5, 95 72.5, 50 95, 5 72.5, 5 27.5" fill="currentColor" opacity="0.8"/>
    <polygon points="50 20, 75 35, 75 65, 50 80, 25 65, 25 35" fill="white" opacity="0.2"/>
    <polygon points="50 5, 95 27.5, 50 50, 5 27.5" fill="white" opacity="0.4"/>
    <polygon points="95 27.5, 95 72.5, 50 50" fill="black" opacity="0.1"/>
    <polygon points="5 27.5, 5 72.5, 50 50" fill="white" opacity="0.1"/>
  </svg>
);

// -----------------------------------------------------------------------------
// MAGNETIC DOOR COMPONENT
// -----------------------------------------------------------------------------
function MagneticDoor({ 
  children,
  onClick,
  disabled
}: { 
  children: React.ReactNode,
  onClick?: () => void,
  disabled?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 100, mass: 0.2 };
  const mouseX = useSpring(x, springConfig);
  const mouseY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Subtle tilt for massive doors
    x.set((e.clientX - centerX) / 8);
    y.set((e.clientY - centerY) / 12);
  };

  const handleMouseLeave = () => {
    if (disabled) return;
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: mouseX, y: mouseY }}
      className={`relative h-[450px] md:h-[600px] w-full rounded-2xl flex flex-col overflow-hidden transition-shadow duration-500 ${disabled ? 'cursor-default' : 'cursor-pointer hover:shadow-2xl hover:z-20'} group`}
    >
      {children}
    </motion.div>
  );
}

export default function ExhibitionsPage() {
  const [mounted, setMounted] = useState(false);
  const [visitors, setVisitors] = useState(124);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Cinematic Entry Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const doorVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-[#EDEFED] text-[#1A1C1A] font-sans flex flex-col relative overflow-hidden">

      {/* ----------------------------------------------------------------------
          BACKGROUND TEXTURE & GRID (Visual Richness)
      ---------------------------------------------------------------------- */}
      {/* 1. Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#D4DDD6]/40 to-transparent"></div>
        <div className="absolute top-0 right-0 w-[50vw] h-full bg-gradient-to-l from-[#D4DDD6]/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-[50vw] h-full bg-gradient-to-r from-white/20 to-transparent"></div>
      </div>

      {/* 2. Architectural Blueprint Grid */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.25]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4DDD6 1px, transparent 1px),
            linear-gradient(to bottom, #D4DDD6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* 3. Film Grain / Tactile Noise */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-[0.4]">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
        </svg>
      </div>

      {/* 4. Ambient Green Dust */}
      <GreenDust count={100} />

      {/* ----------------------------------------------------------------------
          HEADER - Fixed at top
      ---------------------------------------------------------------------- */}
      <header className="relative z-10 w-full px-4 md:px-8 py-4 md:py-6 border-b border-[#D4DDD6]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 md:w-8 md:h-8"><GemIcon /></div>
            <div className="font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase text-[#1A1C1A]">PYADRA</div>
          </div>
          <Link href="/" className="font-mono text-[8px] md:text-[9px] uppercase tracking-widest text-[#3A4A3E] hover:text-[#1A1C1A] transition-colors">
            ← Home
          </Link>
        </div>
      </header>

      {/* ----------------------------------------------------------------------
          MAIN CONTENT - Hall of Doors
      ---------------------------------------------------------------------- */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col justify-center">

        {/* Introduction */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-16 md:mb-20"
        >
          <p className="font-serif text-2xl md:text-3xl italic font-light text-[#059669] mb-6">
            You found something.
          </p>
          <p className="font-sans text-base md:text-lg text-[#3A4A3E] leading-relaxed max-w-2xl mx-auto mb-3">
            Pyadra is a place where digital projects live.
          </p>
          <p className="font-sans text-base md:text-lg text-[#3A4A3E] leading-relaxed max-w-2xl mx-auto">
            Each one can be experienced. Each one can be yours.
          </p>
        </motion.div>

        {/* Exhibitions Grid (The Doors) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10 perspective-[2000px]"
        >

          {/* ------------------------------------------------------------------
              DOOR 1: GALAXY (ACTIVE PORTAL)
          ------------------------------------------------------------------ */}
          <motion.div variants={doorVariants} className="h-full">
            <MagneticDoor onClick={() => router.push("/exhibitions/galaxy")}>
              <div className="absolute inset-0 bg-gradient-to-b from-[#ECFDF5] via-white to-[#F0FDF4] border-2 border-[#D4DDD6] rounded-2xl transition-all duration-500 group-hover:border-[#059669]" />
              
              {/* Monolithic Inner Frame */}
              <div className="absolute inset-[6px] border border-[#059669]/30 rounded-xl" />

              {/* Shimmer Effect */}
              <motion.div 
                animate={{ y: ["-200%", "200%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                className="absolute inset-0 z-0 w-full h-[50%] bg-gradient-to-b from-transparent via-white/50 to-transparent skew-y-12 pointer-events-none"
              />

              {/* Top Section */}
              <div className="relative z-10 p-8 pt-10 flex flex-col items-center flex-1">
                {/* Active dot */}
                <div className="absolute top-6 right-6 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse shadow-[0_0_8px_#059669]"></div>
                  <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#059669] font-bold">ACTIVE</span>
                </div>

                {/* Portal Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center text-white text-3xl shadow-xl shadow-[#059669]/40 mb-8 transform transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3">
                  ✦
                </div>

                <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#1A1C1A] mb-4 text-center transition-colors duration-500 group-hover:text-[#059669]">
                  Galaxy
                </h2>

                <p className="text-sm text-[#3A4A3E] text-center leading-relaxed max-w-[240px]">
                  Active projects ready to experience and acquire. From podcasts to time-locked vaults.
                </p>
              </div>

              {/* Bottom Section (Details) */}
              <div className="relative z-10 p-6 border-t border-[#D4DDD6]/50 bg-white/50 backdrop-blur-sm mt-auto transition-colors duration-500 group-hover:bg-white/80">
                <div className="space-y-3">
                  <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-[#6B8070]">
                    <span>Projects</span>
                    <span className="text-[#059669] font-bold">4 Active</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-[#6B8070]">
                    <span>Total Value</span>
                    <span className="text-[#059669] font-bold">$23,000 AUD</span>
                  </div>
                  <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-widest text-[#6B8070]">
                    <span>Visitors</span>
                    <span className="text-[#059669] font-bold">{visitors}</span>
                  </div>
                </div>

                {/* Call to action */}
                <div className="mt-6 flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#059669] text-white font-mono text-[9px] uppercase tracking-widest transition-transform duration-500 group-hover:scale-[1.02] shadow-md shadow-[#059669]/20">
                  <span>Enter Portal</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </MagneticDoor>
          </motion.div>

          {/* ------------------------------------------------------------------
              DOOR 2: JUNGLE (SEALED DOOR)
          ------------------------------------------------------------------ */}
          <motion.div variants={doorVariants} className="h-full">
            <MagneticDoor disabled>
              <div className="absolute inset-0 bg-[#E5E7E5] border-2 border-[#D4DDD6] rounded-2xl opacity-70 transition-all duration-500 group-hover:bg-[#EDEFED] group-hover:opacity-90" />
              
              {/* Heavy Stone Frame */}
              <div className="absolute inset-[6px] border-2 border-[#D4DDD6]/50 rounded-xl" />

              <div className="relative z-10 p-8 pt-10 flex flex-col items-center flex-1 justify-center grayscale opacity-80">
                {/* Coming Soon badge */}
                <div className="absolute top-6 right-6">
                  <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#6B8070]">SEALED</span>
                </div>

                {/* Sealed Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4DDD6] to-[#C4CCC6] flex items-center justify-center text-[#6B8070] text-3xl shadow-inner mb-8 border border-[#B4BCB6]">
                  ◈
                </div>

                <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#6B8070] mb-4 text-center">
                  Jungle
                </h2>

                <p className="text-sm text-[#6B8070] text-center leading-relaxed max-w-[240px]">
                  The Living Network. A space for interconnected systems and organic growth.
                </p>
              </div>

              {/* Bottom Section (Locked) */}
              <div className="relative z-10 p-6 border-t border-[#D4DDD6] bg-[#D4DDD6]/20 mt-auto">
                <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#A8B3AB] text-[#6B8070] font-mono text-[9px] uppercase tracking-widest transition-colors hover:bg-white/50 hover:text-[#3A4A3E]">
                  <span>Notify Me</span>
                  <span className="text-xs">+</span>
                </button>
              </div>
            </MagneticDoor>
          </motion.div>

          {/* ------------------------------------------------------------------
              DOOR 3: CITY (SEALED DOOR)
          ------------------------------------------------------------------ */}
          <motion.div variants={doorVariants} className="h-full">
            <MagneticDoor disabled>
              <div className="absolute inset-0 bg-[#E5E7E5] border-2 border-[#D4DDD6] rounded-2xl opacity-70 transition-all duration-500 group-hover:bg-[#EDEFED] group-hover:opacity-90" />
              
              {/* Heavy Stone Frame */}
              <div className="absolute inset-[6px] border-2 border-[#D4DDD6]/50 rounded-xl" />

              <div className="relative z-10 p-8 pt-10 flex flex-col items-center flex-1 justify-center grayscale opacity-80">
                {/* Coming Soon badge */}
                <div className="absolute top-6 right-6">
                  <span className="font-mono text-[7px] uppercase tracking-[0.3em] text-[#6B8070]">SEALED</span>
                </div>

                {/* Sealed Icon */}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4DDD6] to-[#C4CCC6] flex items-center justify-center text-[#6B8070] text-3xl shadow-inner mb-8 border border-[#B4BCB6]">
                  ▣
                </div>

                <h2 className="font-serif text-3xl md:text-4xl italic font-light text-[#6B8070] mb-4 text-center">
                  City
                </h2>

                <p className="text-sm text-[#6B8070] text-center leading-relaxed max-w-[240px]">
                  Metropolitan Scale. Infrastructure for collaboration and collective creation.
                </p>
              </div>

              {/* Bottom Section (Locked) */}
              <div className="relative z-10 p-6 border-t border-[#D4DDD6] bg-[#D4DDD6]/20 mt-auto">
                <button className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#A8B3AB] text-[#6B8070] font-mono text-[9px] uppercase tracking-widest transition-colors hover:bg-white/50 hover:text-[#3A4A3E]">
                  <span>Notify Me</span>
                  <span className="text-xs">+</span>
                </button>
              </div>
            </MagneticDoor>
          </motion.div>

        </motion.div>

      </main>

      {/* ----------------------------------------------------------------------
          FOOTER
      ---------------------------------------------------------------------- */}
      <footer className="relative z-10 w-full px-4 md:px-8 py-3 md:py-4 border-t border-[#D4DDD6]/30">
        <div className="flex justify-between items-center font-mono text-[7px] md:text-[8px] uppercase tracking-[0.3em] text-[#6B8070]">
          <div>PYADRA EXHIBITIONS</div>
          <div className="hidden md:block">PYADRA.IO</div>
        </div>
      </footer>

    </div>
  );
}
