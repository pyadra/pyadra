"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

// Project Constellation Data
const nodes = [
  {
    id: "orbit-77",
    name: "Orbit 77",
    x: "50%",
    y: "35%",
    size: 260,
    color: "#39FF14", // Alien Green
    status: "BROADCASTING",
    category: "Podcast & Global Entertainment",
    availability: "Equity (10-100%) • Talent Required • Retail Open",
    delay: 0,
    href: "/projects/orbit"
  },
  {
    id: "project-02",
    name: "EtherniCapsule",
    x: "28%",
    y: "70%",
    size: 160,
    color: "#FFB000", // Amber Catalyst
    status: "ENCRYPTED",
    category: "Digital Memory Vault",
    availability: "A final message left before ascending. A digital memory capsule for the ones you love.",
    delay: 0.5,
    href: "#"
  },
  {
    id: "project-03",
    name: "Figurines",
    x: "72%",
    y: "70%",
    size: 120,
    color: "#ECE0D1", // Pale Champagne
    status: "OFFLINE",
    category: "Physical Artifacts",
    availability: "Personalized 3D-printed avatars. Your physical extension in reality.",
    delay: 0.8,
    href: "#"
  }
];

export default function ProjectsConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    // BRAND PYADRA CORE INTEGRATION: PURE OLED BLACK FOR HDR CONTRAST
    <div className="min-h-screen bg-[#000000] text-[#E3DAC9] overflow-hidden font-sans selection:bg-[#FFB000]/20 selection:text-[#FFB000] relative w-full flex items-center justify-center">
      
      {/* Background Deep Amber Pulse (Shadow Earth Lithic Vibe) */}
      <motion.div 
        animate={{ opacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none z-0 mix-blend-screen opacity-50"
        style={{ 
          background: "radial-gradient(circle at 50% 30%, rgba(255,176,0,0.08) 0%, rgba(45,41,38,0.5) 30%, rgba(0,0,0,1) 80%)" 
        }}
      />
      
      {/* Global Navigation - Champagne Colored */}
      <nav className="absolute top-0 left-0 w-full p-8 md:p-12 z-50 flex justify-between items-start pointer-events-none">
        <Link href="/" className="pointer-events-auto text-[10px] uppercase font-sans font-light tracking-[0.3em] text-[#ECE0D1] hover:text-[#FFB000] transition-colors duration-500 hover:drop-shadow-[0_0_10px_rgba(255,176,0,0.8)]">
          [ Return to Main ]
        </Link>
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#ECE0D1]/60">
           The Ecosystem
        </span>
      </nav>

      {/* HEADER TITLE (Top Left) - Premium Metallic Gradient Typography */}
      <motion.h1 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1.5, ease: "easeOut" }}
         className="absolute top-32 left-8 md:left-12 text-3xl md:text-5xl font-serif italic font-light z-40 pointer-events-none"
      >
        <span className="bg-gradient-to-br from-[#FFFFFF] via-[#ECE0D1] to-[#FFB000]/60 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,176,0,0.15)] leading-tight">
           The Ecosystem
        </span>
      </motion.h1>

      {/* FLOATING CONSTELLATION NODES */}
      <div className="relative w-full h-[100dvh] max-w-[1400px] z-10 pointer-events-none">
         {mounted && nodes.map((node) => (
            <motion.div
               key={node.id}
               className="absolute z-20 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
               style={{ left: node.x, top: node.y }}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1, y: ["-15px", "15px", "-15px"] }}
               transition={{ 
                 opacity: { duration: 1, delay: node.delay },
                 scale: { duration: 1, delay: node.delay },
                 y: { duration: 8 + node.delay * 2, repeat: Infinity, ease: "easeInOut" }
               }}
               onMouseEnter={() => setHoveredNode(node.id)}
               onMouseLeave={() => setHoveredNode(null)}
            >
               <Link href={node.href} className="relative group flex items-center justify-center">
                  
                  {/* The Physical Node Sphere (Polished Obsidian Glass) */}
                  <motion.div 
                     className="rounded-full border border-white/5 flex flex-col items-center justify-center backdrop-blur-xl relative z-10 transition-all duration-700 bg-gradient-to-br from-[#1A1816]/90 to-[#0A0908]/90 shadow-[0_15px_50px_rgba(0,0,0,0.9)]"
                     style={{ 
                        width: node.size, 
                        height: node.size,
                        borderColor: hoveredNode === node.id ? `${node.color}50` : 'rgba(255, 255, 255, 0.08)',
                        boxShadow: hoveredNode === node.id ? `0 0 50px ${node.color}30 inset, 0 20px 50px rgba(0,0,0,0.9)` : `0 0 20px rgba(255,176,0,0.05) inset, 0 20px 50px rgba(0,0,0,0.9)`
                     }}
                  >
                     {/* Node Text - Ultra Luminous Effect */}
                     <span 
                       className="font-serif italic transition-all duration-500 font-light text-center px-4" 
                       style={{ 
                         fontSize: `${node.size * 0.16}px`,
                         lineHeight: 1.1,
                         color: hoveredNode === node.id ? node.color : '#FFFFFF',
                         textShadow: hoveredNode === node.id 
                           ? `0 0 40px ${node.color}80, 0 0 80px ${node.color}40` 
                           : '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,176,0,0.2)'
                       }}
                     >
                       {node.name}
                     </span>
                     
                     {/* Mini Pulse Indicator inside the orb */}
                     <span 
                        className={`w-2.5 h-2.5 rounded-full absolute bottom-[22%] transition-all duration-500 ${node.status !== 'OFFLINE' ? 'animate-[pulse_1.5s_infinite]' : ''}`}
                        style={{ 
                          backgroundColor: hoveredNode === node.id ? node.color : '#FFB000', 
                          boxShadow: `0 0 15px ${hoveredNode === node.id ? node.color : '#FFB000'}`,
                          opacity: hoveredNode === node.id ? 1 : 0.6 
                        }}
                     />
                  </motion.div>

                  {/* Ambient Background Glow (Revealed on Hover) */}
                  <div 
                     className="absolute inset-0 rounded-full blur-[100px] -z-10 transition-opacity duration-1000 opacity-0 group-hover:opacity-40"
                     style={{ backgroundColor: node.color }}
                  />

                  {/* HIGH-END METADATA HUD (Ultra Frosted Glass) */}
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: parseInt(node.y) > 50 ? 20 : -20 }}
                     animate={{ 
                       opacity: hoveredNode === node.id ? 1 : 0, 
                       scale: hoveredNode === node.id ? 1 : 0.95,
                       y: hoveredNode === node.id ? 0 : (parseInt(node.y) > 50 ? 20 : -20),
                     }}
                     transition={{ duration: 0.4, ease: "easeOut" }}
                     style={{
                        ...(parseInt(node.y) > 50 ? { bottom: "110%" } : { top: "110%" })
                     }}
                     className="absolute w-72 md:w-80 bg-[#0A0A0A]/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.95)] pointer-events-none z-50 text-left"
                  >
                     {/* HUD Header */}
                     <div className="flex justify-between items-center mb-5">
                        <span className="text-[9px] font-mono tracking-widest uppercase text-white/50">{node.category}</span>
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold" style={{ color: node.color }}>
                          {node.status}
                        </span>
                     </div>
                     
                     <h4 className="text-3xl font-serif italic mb-5 tracking-tight font-light" style={{ color: node.color, textShadow: `0 0 20px ${node.color}40` }}>
                       {node.name}
                     </h4>
                     
                     <div className="w-full h-[1px] bg-gradient-to-r from-white/20 to-transparent my-5" />
                     
                     {/* Internal Dashboard Data */}
                     <div className="flex flex-col text-[10px] font-mono uppercase tracking-widest text-white/50 space-y-3">
                       <span className="mb-1 text-[8px] text-[#FFB000]/60">Active Resource Parameters:</span>
                       <span className="text-white/90 leading-relaxed font-sans font-light normal-case text-xs tracking-wide">
                          {node.availability}
                       </span>
                     </div>
                     
                     {/* Action Text */}
                     <div className="mt-8 flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.3em]">
                          <span className="transition-colors duration-500" style={{ color: node.color }}>
                            {node.status === 'ENCRYPTED' || node.status === 'OFFLINE' ? 'Access Denied' : 'Enter Node'}
                          </span>
                          <span className="transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" style={{ color: node.color }}>
                            ↗
                          </span>
                     </div>
                  </motion.div>

               </Link>
            </motion.div>
         ))}

      </div>
    </div>
  );
}