"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// WebGL Background: Warm Organic Connection
const Scene = dynamic(() => import("./components/Scene"), { ssr: false });

export default function WarmOrganicConnection() {
  const [mounted, setMounted] = useState(false);
  
  // -- FÍSICAS FLUIDAS (Suaves y Humanas) --
  const mouseXRel = useMotionValue(0);
  const mouseYRel = useMotionValue(0);
  
  // Damping alto pero masa baja para sentir menor tensión y más fluidez
  const springConfig = { damping: 40, stiffness: 100, mass: 1.5 };
  
  const cardRotateX = useSpring(useTransform(mouseYRel, [-1, 1], [6.87, -6.87]), springConfig); // ~0.12 radianes igual a Scene.tsx
  const cardRotateY = useSpring(useTransform(mouseXRel, [-1, 1], [-6.87, 6.87]), springConfig);

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
    <div className="min-h-screen bg-[#171211] text-[#F4EFEA] flex flex-col justify-center items-center relative overflow-hidden font-sans">
      
      {/* 1. LAYER WEBGL PROFUNDO: Warm Mahogany, Dawn Lighting, Amber Capsule */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Scene />
      </div>

      {/* 2. Soft Vignette hugging the center */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(23,18,17,0.7)_100%)] pointer-events-none z-0 mix-blend-multiply" />

      {/* HUD ELIMINADO para eliminar la connotación de computadora/SaaS */}

      {/* 3. THE ARTIFACT (Synchronized Elegant Overlay) */}
      <div className="relative z-20 w-full h-full flex justify-center items-center perspective-[1000px] pointer-events-none">
        
        <motion.div 
          style={{ rotateX: cardRotateX, rotateY: cardRotateY }}
          className="relative flex flex-col items-center justify-center p-16 md:p-24 w-full max-w-[600px] h-[800px] pointer-events-auto"
        >
          {/* EL AURA CÁLIDA (Rose Gold Breath) */}
          <motion.div 
            animate={{ opacity: [0.1, 0.35, 0.1], scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#DCA88F] rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen"
          />

          {/* ORIGIN -> Human connection subtitle */}
          <h2 className="relative z-10 text-[9px] md:text-[10px] tracking-[0.4em] uppercase mb-12 font-sans font-light text-[#DCA88F]/80">
            A Living Entity
          </h2>

          {/* PYADRA - Humanist, flowing calligraphy (Serif Italic) */}
          <h1 
            className="relative z-10 text-[6rem] md:text-[8rem] font-serif italic font-light tracking-tight mb-8 text-[#F4EFEA] select-none"
            style={{ 
              textShadow: "0px 10px 40px rgba(220,168,143,0.4)" 
            }}
          >
            Pyadra
          </h1>

          {/* CUERPO (Emocional y conectado) */}
          <p className="relative z-10 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-light leading-relaxed text-center max-w-sm mb-24 text-[#F4EFEA]/60 px-4">
            Growing ventures with human warmth.<br/><span className="mt-2 block">An ecosystem meant to be felt.</span>
          </p>

          <div className="relative z-10 flex flex-col items-center mt-6">
            
            {/* CTA MINIMALISTA Y ELEGANTE (Línea de conexión sutil) */}
            <Link href="/projects" className="group flex flex-col items-center gap-3 transition-opacity duration-700 hover:opacity-80">
               <span className="text-[10px] uppercase tracking-[0.3em] font-sans font-light text-[#DCA88F] group-hover:text-[#F4EFEA] transition-colors duration-500">
                 Step Inside
               </span>
               <div className="w-[1px] h-[40px] bg-gradient-to-b from-[#DCA88F]/80 to-transparent group-hover:h-[60px] group-hover:from-[#F4EFEA] transition-all duration-[800ms] ease-out" />
            </Link>

          </div>
        </motion.div>
      </div>
    </div>
  );
}