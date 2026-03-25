"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const projects = [
  {
    id: "01",
    name: "Orbit 77",
    status: "Active Node",
    href: "/projects/orbit",
    pos: { top: "30%", left: "50%" },
    posMd: { top: "40%", left: "30%" },
    color: "#FCA880",
    size: 400,
    delay: 0,
    active: true
  },
  {
    id: "02",
    name: "Eternicapsule",
    status: "Conceptual",
    href: "#",
    pos: { top: "60%", left: "50%" },
    posMd: { top: "30%", left: "70%" },
    color: "#DCA88F",
    size: 250,
    delay: 2,
    active: false
  },
  {
    id: "03",
    name: "Manuscript",
    status: "Dormant",
    href: "#",
    pos: { top: "85%", left: "50%" },
    posMd: { top: "70%", left: "55%" },
    color: "#F4EFEA",
    size: 300,
    delay: 4,
    active: false
  }
];

export default function ProjectsConstellation() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  
  // Parallax interactivo suave (Sensación de flotar en una galaxia/ecosistema)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 100, stiffness: 50 };
  const parallaxX = useSpring(useTransform(mouseX, [-1, 1], [-30, 30]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-1, 1], [-30, 30]), springConfig);

  useEffect(() => {
    setMounted(true);
    setIsDesktop(window.innerWidth > 768);
    
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth) * 2 - 1);
      mouseY.set((e.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#171211] overflow-hidden relative font-sans">
      
      {/* Background Base (Warm Umber Void) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(23,18,17,0.9)_100%)] pointer-events-none z-10 mix-blend-multiply" />
      
      <header className="absolute top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none">
        <Link href="/" className="pointer-events-auto text-[10px] uppercase font-sans font-light tracking-[0.3em] text-[#DCA88F] hover:text-[#F4EFEA] transition-colors duration-500">
          [ Return ]
        </Link>
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#F4EFEA]/30">
          The Ecosystem Constellation
        </span>
      </header>

      {/* Interactive Constellation Layer (All projects float as orbs here) */}
      <motion.div 
        style={{ x: parallaxX, y: parallaxY }}
        className="absolute w-full h-full top-0 left-0"
      >
        {projects.map((p) => (
          <motion.div
            key={p.id}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 8 + p.delay, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
            className="absolute flex flex-col items-center group/node"
            style={{ 
              top: isDesktop ? p.posMd.top : p.pos.top, 
              left: isDesktop ? p.posMd.left : p.pos.left,
              transform: "translate(-50%, -50%)"
            }}
          >
            {/* The Floating Organic Aura behind the node */}
            <motion.div 
              animate={p.active ? { opacity: [0.1, 0.4, 0.1], scale: [0.9, 1.1, 0.9] } : { opacity: 0.05 }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] pointer-events-none mix-blend-screen"
              style={{ 
                width: p.size, 
                height: p.size, 
                backgroundColor: p.color
              }}
            />

            {/* The Interactive Node Container (Glassmorphic Halo) */}
            <Link 
              href={p.href}
              className={`relative z-10 flex flex-col items-center justify-center w-40 h-40 md:w-56 md:h-56 rounded-full border ${p.active ? 'border-[#DCA88F]/20 hover:border-[#DCA88F]/50 bg-[#171211]/30 hover:bg-[#171211]/60' : 'border-white/5 bg-transparent cursor-not-allowed'} backdrop-blur-md transition-all duration-[1500ms] shadow-[0_20px_40px_rgba(0,0,0,0.3)]`}
            >
               {/* Internal Bright Ring for active nodes */}
               {p.active && (
                 <div className="absolute inset-0 rounded-full border border-transparent group-hover/node:border-[#FCA880]/70 group-hover/node:shadow-[0_0_30px_rgba(252,168,128,0.3)] transition-all duration-[1000ms] pointer-events-none scale-[0.9] group-hover/node:scale-100" />
               )}

               <span className="text-[9px] tracking-[0.4em] font-sans text-[#F4EFEA]/30 mb-2 md:mb-4">{p.id}</span>
               
               <h2 className={`text-2xl md:text-3xl font-serif italic text-center ${p.active ? 'text-[#F4EFEA] group-hover/node:text-[#FCA880]' : 'text-white/20'} transition-colors duration-1000`}>
                 {p.name}
               </h2>

               <div className="absolute -bottom-10 md:-bottom-12 opacity-0 group-hover/node:opacity-100 transition-opacity duration-1000 flex flex-col items-center gap-3">
                 <div className={`h-1.5 w-1.5 rounded-full ${p.active ? 'bg-[#FCA880] shadow-[0_0_8px_rgba(252,168,128,0.8)] animate-pulse' : 'bg-white/20'}`} />
                 <span className="text-[8px] uppercase tracking-[0.2em] font-sans text-[#DCA88F]/80 whitespace-nowrap">
                   {p.status}
                 </span>
               </div>
            </Link>

          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}