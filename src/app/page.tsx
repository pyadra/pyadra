"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(() => import("./components/Scene"), { ssr: false });

export default function ShadowEarthHome() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false); // Controls the internal amber spark passing dynamically into WebGL
  
  // Heaviest inertia setting to simulate the gravitational weight of the stone artifact
  const mouseXRel = useMotionValue(0);
  const mouseYRel = useMotionValue(0);
  
  const springConfig = { damping: 80, stiffness: 60, mass: 3 };
  const cardRotateX = useSpring(useTransform(mouseYRel, [-1, 1], [4.58, -4.58]), springConfig); // ~0.08 rad tie perfectly to Scene rotation
  const cardRotateY = useSpring(useTransform(mouseXRel, [-1, 1], [-4.58, 4.58]), springConfig);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseXRel.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseYRel.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseXRel, mouseYRel]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#000000] text-[#E3DAC9] flex flex-col justify-center items-center relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Scene hovered={hovered} />
      </div>

      {/* Extreme dark vignette to kill all edge light entirely and frame the central void */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)] pointer-events-none z-0 mix-blend-multiply" />

      {/* STEALTH UI HUD (10% Opacity Ghost Etched into the screen edges as requested) */}
      <div className="absolute top-8 right-8 z-10 pointer-events-none text-right opacity-10">
        <p className="text-[8px] font-mono tracking-[0.4em] text-[#E3DAC9] uppercase mb-1">
          SYSTEM: ACTIVE
        </p>
        <p className="text-[8px] font-mono tracking-[0.3em] text-[#E3DAC9] uppercase">
          NODE: EARTH SHADOW
        </p>
      </div>
      <div className="absolute bottom-8 left-8 z-10 pointer-events-none opacity-10">
        <p className="text-[8px] font-mono tracking-[0.4em] text-[#E3DAC9] uppercase">
          [ ENCRYPTED ]
        </p>
      </div>

      {/* The Artifact Typography Overlay - Embedded logic */}
      <div className="relative z-20 w-full h-full flex justify-center items-center perspective-[1200px] pointer-events-none">
        
        <motion.div 
          style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
          className="relative flex flex-col items-center justify-center p-16 md:p-24 w-full max-w-[600px] h-[800px] pointer-events-auto"
        >
          {/* THE LITHIC PULSE (Very slow 15s Smoky Quartz rhythmic breathing core) */}
          <motion.div 
            animate={{ opacity: [0.05, 0.25, 0.05], scale: [0.95, 1.1, 0.95] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#2D2926] rounded-full blur-[100px] pointer-events-none z-0"
          />

          <h2 className="relative z-10 text-[9px] md:text-[10px] tracking-[0.6em] uppercase mb-14 font-sans font-light text-[#E3DAC9]/40 mix-blend-screen">
            A Living Entity
          </h2>

          {/* PYADRA SCULPT - Physically embedded offset shadows technique mapping the Champagne text gracefully deeply into the stone */}
          <h1 
            className="relative z-10 text-[6rem] md:text-[8rem] font-serif italic font-light tracking-tight mb-8 text-[#E3DAC9] select-none"
            style={{ 
              textShadow: "1px 1px 0px rgba(255,255,255,0.15), -1px -1px 3px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.95)" 
            }}
          >
            Pyadra
          </h1>

          <p className="relative z-10 text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-light leading-relaxed text-center max-w-sm mb-28 text-[#E3DAC9]/40 px-4 mix-blend-screen">
            Growing ventures with heavy inertia.<br/><span className="mt-2 block">An ecosystem etched in stone.</span>
          </p>

          <div className="relative z-10 flex flex-col items-center mt-6">
            
            {/* The Catalyst Hitbox triggers the Amber spark natively in WebGL via hovered boolean hook */}
            <Link 
              href="/projects" 
              onMouseEnter={() => setHovered(true)} 
              onMouseLeave={() => setHovered(false)}
              className="group flex flex-col items-center gap-4 transition-all duration-1000"
            >
               <span className="text-[10px] uppercase tracking-[0.4em] font-sans font-light text-[#E3DAC9]/50 group-hover:text-[#FFB000] transition-colors duration-700">
                 Descend
               </span>
               {/* The connection line illuminates with Amber catalyst warmth on hover */}
               <div className="w-[1px] h-[40px] bg-gradient-to-b from-[#E3DAC9]/20 to-transparent group-hover:h-[60px] group-hover:from-[#FFB000] group-hover:shadow-[0_0_20px_#FFB000] transition-all duration-[1000ms] ease-out" />
            </Link>

          </div>
        </motion.div>
      </div>
    </div>
  );
}