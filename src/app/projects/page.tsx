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
    opacity: 1,
    glowColor: "rgba(57, 255, 20, 0.4)",
    pulseColor: "#39FF14",
    statusText: "", 
    hoverCard: {
       label: "PODCAST & MEDIA",
       badgeText: "LIVE",
       badgeColor: "text-[#39FF14]",
       badgeDot: "bg-[#39FF14] animate-pulse shadow-[0_0_10px_rgba(57,255,20,0.8)]",
       metrics: "10 Episodes  •  Season 1 Complete  •  Now Streaming",
       description: null,
       nodeStatus: [
         { label: "Content", value: "Complete" },
         { label: "Distribution", value: "In Progress" },
         { label: "Crew", value: "Recruiting Now" }
       ],
       buttonLabel: "ENTER NODE →",
       buttonHref: "/projects/orbit",
       buttonSubLabel: null
    },
    delay: 0
  },
  {
    id: "project-02",
    name: "EtherniCapsule",
    x: "28%",
    y: "70%",
    size: 160,
    color: "#FFB000", // Amber Catalyst
    opacity: 0.7,
    glowColor: "rgba(255, 176, 0, 0.2)",
    pulseColor: "#FFB000",
    statusText: "FORMING",
    hoverCard: {
       label: "DIGITAL MEMORY",
       badgeText: "FORMING",
       badgeColor: "text-[#FFB000]",
       badgeDot: "border border-[#FFB000] text-[#FFB000] shadow-[0_0_10px_rgba(255,176,0,0.5)]",
       metrics: null,
       description: "A vault for messages that outlive their sender.\nStore words, memories, and moments —\nto be opened in the future.",
       nodeStatus: [
         { label: "Concept", value: "Defined" },
         { label: "Development", value: "Pending Crew" },
         { label: "Launch", value: "TBD" }
       ],
       buttonLabel: "WATCH THIS NODE →",
       buttonHref: "#",
       buttonSubLabel: "This node is not yet open. Be notified when it launches."
    },
    delay: 0.5
  },
  {
    id: "project-03",
    name: "Figurines",
    x: "72%",
    y: "70%",
    size: 120,
    color: "#FFB000", // Amber Catalyst
    opacity: 0.7,
    glowColor: "rgba(255, 176, 0, 0.2)",
    pulseColor: "#FFB000",
    statusText: "FORMING",
    hoverCard: {
       label: "PHYSICAL + DIGITAL",
       badgeText: "FORMING",
       badgeColor: "text-[#FFB000]",
       badgeDot: "border border-[#FFB000] shadow-[0_0_10px_rgba(255,176,0,0.5)]",
       metrics: null,
       description: "Hyper-personalized 3D figures that bridge\nthe physical and digital world.\nYour identity, made tangible.",
       nodeStatus: [
         { label: "Concept", value: "Defined" },
         { label: "Prototype", value: "In Progress" },
         { label: "Launch", value: "TBD" }
       ],
       buttonLabel: "WATCH THIS NODE →",
       buttonHref: "#",
       buttonSubLabel: "This node is not yet open. Be notified when it launches."
    },
    delay: 0.8
  },
  {
    id: "project-04",
    name: "UNKNOWN NODE",
    x: "88%",
    y: "85%",
    size: 50,
    color: "#FFFFFF",
    opacity: 0.3,
    glowColor: "rgba(255, 255, 255, 0.05)",
    pulseColor: "rgba(255, 255, 255, 0.2)",
    statusText: "",
    isMystery: true,
    hoverCard: {
       isMystery: true,
       label: "",
       badgeText: "",
       badgeColor: "",
       badgeDot: "",
       metrics: null,
       description: "A new node is forming.\nNot ready to be named yet.",
       nodeStatus: [],
       buttonLabel: "",
       buttonHref: "#",
       buttonSubLabel: null
    },
    delay: 1.2
  }
];

export default function ProjectsConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <motion.div 
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 1.5, ease: "easeOut" }}
         className="absolute top-28 md:top-32 left-8 md:left-12 z-40 pointer-events-none"
      >
        <h1 className="text-3xl md:text-5xl font-serif italic font-light leading-tight mb-3">
           <span className="bg-gradient-to-br from-[#FFFFFF] via-[#ECE0D1] to-[#FFB000]/60 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,176,0,0.15)]">
              The Ecosystem
           </span>
        </h1>
        <p className="text-[10px] md:text-[11px] font-mono text-[#ECE0D1]/50 uppercase tracking-[0.2em] leading-relaxed max-w-sm font-light">
           Each node is a project. Each project is an opportunity.<br className="hidden md:block"/>Orbit 77 is live. More nodes are forming.
        </p>
      </motion.div>

      {/* FLOATING CONSTELLATION NODES */}
      <div className="relative w-full h-[100dvh] max-w-[1400px] z-10 pointer-events-none">
         {mounted && nodes.map((node) => (
            <motion.div
               key={node.id}
               className="absolute z-20 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
               style={{ left: node.x, top: node.y }}
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: node.opacity, scale: 1, y: ["-15px", "15px", "-15px"] }}
               transition={{ 
                 opacity: { duration: 1, delay: node.delay },
                 scale: { duration: 1, delay: node.delay },
                 y: { duration: 8 + node.delay * 2, repeat: Infinity, ease: "easeInOut" }
               }}
               onMouseEnter={() => setHoveredNode(node.id)}
               onMouseLeave={() => setHoveredNode(null)}
            >
               <Link href={node.hoverCard?.buttonHref || "#"} className={`relative group flex flex-col items-center justify-center ${node.isMystery ? 'cursor-default' : ''}`} tabIndex={node.isMystery ? -1 : 0}>
                  
                  {/* The Physical Node Sphere (Polished Obsidian Glass) */}
                  <motion.div 
                     className="rounded-full flex flex-col items-center justify-center backdrop-blur-xl relative z-10 transition-all duration-700 bg-gradient-to-br from-[#1A1816]/90 to-[#0A0908]/90 shadow-[0_15px_50px_rgba(0,0,0,0.9)]"
                     style={{ 
                        width: node.size, 
                        height: node.size,
                        border: `1px solid ${hoveredNode === node.id ? (node.isMystery ? 'rgba(255,255,255,0.2)' : node.color) : 'rgba(255, 255, 255, 0.05)'}`,
                        boxShadow: hoveredNode === node.id ? `0 0 50px ${node.glowColor} inset, 0 20px 50px rgba(0,0,0,0.9)` : `0 0 20px rgba(255,176,0,0.03) inset, 0 20px 50px rgba(0,0,0,0.9)`
                     }}
                  >
                     {/* Node Text - Ultra Luminous Effect */}
                     {!node.isMystery && (
                       <span 
                         className="font-serif italic transition-all duration-500 font-light text-center px-4" 
                         style={{ 
                           fontSize: `${node.size * 0.16}px`,
                           lineHeight: 1.1,
                           color: hoveredNode === node.id ? node.color : '#FFFFFF',
                           textShadow: hoveredNode === node.id 
                             ? `0 0 40px ${node.glowColor}, 0 0 80px ${node.color}40` 
                             : '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(255,176,0,0.2)'
                         }}
                       >
                         {node.name}
                       </span>
                     )}
                     
                     {/* Mini Pulse Indicator inside the orb */}
                     {(!node.isMystery || hoveredNode === node.id) && (
                       <span 
                          className="w-2.5 h-2.5 rounded-full absolute bottom-[22%] transition-all duration-500"
                          style={{ 
                            backgroundColor: hoveredNode === node.id ? node.pulseColor : (node.isMystery ? 'transparent' : '#FFB000'), 
                            boxShadow: `0 0 15px ${hoveredNode === node.id ? node.pulseColor : (node.isMystery ? 'transparent' : '#FFB000')}`,
                            opacity: hoveredNode === node.id ? 1 : 0.6,
                            animation: hoveredNode === node.id && node.id === 'orbit-77' ? 'pulse 1.5s infinite' : 'none'
                          }}
                       />
                     )}
                  </motion.div>
                  
                  {/* Outer Status Text (e.g. "FORMING") below the planet */}
                  {node.statusText && (
                    <span 
                       className="absolute -bottom-8 text-[9px] font-mono tracking-[0.2em] uppercase transition-opacity duration-500 font-bold"
                       style={{ 
                         color: hoveredNode === node.id ? node.color : '#FFB000',
                         opacity: hoveredNode === node.id ? 0.9 : 0.4 
                       }}
                    >
                      {node.statusText}
                    </span>
                  )}

                  {/* Ambient Background Glow (Revealed on Hover) */}
                  <div 
                     className="absolute inset-0 rounded-full blur-[100px] -z-10 transition-opacity duration-1000 opacity-0 group-hover:opacity-40 pointer-events-none"
                     style={{ backgroundColor: node.color }}
                  />

                  {(() => {
                     const xVal = parseInt(node.x);
                     let posClass = "";
                     if (node.id === "orbit-77") {
                       // Center Planet: Bottom always
                       posClass = "top-[calc(100%+24px)] left-1/2 -translate-x-1/2";
                     } else if (xVal < 40) {
                       // Left Side (EtherniCapsule) -> Right on Desktop, Top on Mobile
                       // Removed -translate-y-1/2 so it grows mostly downwards, avoiding Orbit above it.
                       posClass = "bottom-[calc(100%+24px)] left-1/2 -translate-x-1/2 md:bottom-auto md:top-[15%] md:left-[calc(100%+24px)] md:translate-x-0";
                     } else if (xVal > 60) {
                       // Right Side (Figurines) -> Left on Desktop, Top on Mobile
                       posClass = "bottom-[calc(100%+24px)] left-1/2 -translate-x-1/2 md:bottom-auto md:top-[15%] md:right-[calc(100%+24px)] md:left-auto md:translate-x-0";
                     }

                     const cardWidth = node.isMystery ? 'auto' : (node.id === 'orbit-77' ? '360px' : '280px');

                     return (
                        <div className={`absolute z-50 transition-all duration-300 ${posClass} ${hoveredNode === node.id ? 'pointer-events-auto' : 'pointer-events-none'}`}>
                           <motion.div 
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: hoveredNode === node.id ? 1 : 0, scale: hoveredNode === node.id ? 1 : 0.95 }}
                              transition={{ duration: 0.3, ease: "easeOut" }}
                              className="bg-[#050505]/95 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 shadow-[0_30px_60px_rgba(0,0,0,0.95)] text-left whitespace-nowrap md:whitespace-normal"
                              style={{ width: cardWidth, minWidth: node.isMystery ? '200px' : 'auto' }}
                           >
                              {/* MYSTERY NODE CARD */}
                              {node.isMystery ? (
                                <div className="flex items-center justify-center p-2 text-center">
                                   <p className="text-[9px] md:text-[10px] uppercase font-mono tracking-widest text-[#E3DAC9]/70 leading-relaxed whitespace-pre-line font-light">
                                     {node.hoverCard.description}
                                   </p>
                                </div>
                              ) : (
                                /* STANDARD NODE CARD (Orbit, Capsule, Figurines) */
                                <>
                                  {/* HUD Header */}
                                  <div className="flex justify-between items-center mb-6 gap-6">
                                     <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/50">{node.hoverCard.label}</span>
                                     <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded bg-black/40 border border-white/5 ${node.hoverCard.badgeColor}`}>
                                       {node.hoverCard.badgeDot && <span className={`w-1.5 h-1.5 rounded-full ${node.hoverCard.badgeDot}`} />}
                                       <span className="text-[8px] font-mono uppercase tracking-[0.2em] font-bold">
                                         {node.hoverCard.badgeText}
                                       </span>
                                     </div>
                                  </div>
                                  
                                  {/* Title */}
                                  <h4 className="text-3xl font-serif italic mb-6 tracking-tight font-light" style={{ color: node.color, textShadow: `0 0 25px ${node.glowColor}` }}>
                                    {node.name}
                                  </h4>
                                  
                                  <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent my-5" />
                                  
                                  {/* Metrics or Description */}
                                  {node.hoverCard.metrics && (
                                     <p className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-white/80 font-bold leading-relaxed mb-6 whitespace-pre-line">
                                       {node.hoverCard.metrics.split(' • ').map((m, i) => (
                                         <span key={i}>
                                           {m}
                                           {i < 2 && <span className="mx-2 text-white/20 font-light">•</span>}
                                         </span>
                                       ))}
                                     </p>
                                  )}
                                  
                                  {node.hoverCard.description && (
                                     <p className="text-sm font-sans font-light text-white/70 leading-relaxed mb-6 whitespace-pre-line bg-white/5 p-4 rounded-xl border border-white/5">
                                       {node.hoverCard.description}
                                     </p>
                                  )}
                                  
                                  <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent my-5" />
                                  
                                  {/* NODE STATUS LIST */}
                                  {node.hoverCard.nodeStatus && node.hoverCard.nodeStatus.length > 0 && (
                                    <div className="mb-6">
                                       <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-white/40 block mb-4 border-b border-white/5 pb-2 inline-block">NODE STATUS:</span>
                                       <ul className="space-y-3">
                                          {node.hoverCard.nodeStatus.map((statusItem, idx) => (
                                            <li key={idx} className="flex items-center gap-3">
                                               <span className="text-[#FFB000]/80 text-[10px]">✦</span>
                                               <div className="flex gap-2 text-[10px] md:text-xs font-mono tracking-wider items-end">
                                                  <span className="text-white/60">{statusItem.label}</span>
                                                  <span className="text-white/20">—</span>
                                                  <span className="text-white/90 font-bold" style={{ color: statusItem.value === 'Complete' ? node.color : 'rgba(255,255,255,0.9)' }}>
                                                    {statusItem.value}
                                                  </span>
                                               </div>
                                            </li>
                                          ))}
                                       </ul>
                                    </div>
                                  )}
                                  
                                  <div className="w-full h-[1px] bg-gradient-to-r from-white/10 to-transparent my-6" />
                                  
                                  {/* ACTION BUTTON */}
                                  <div className="mt-2 flex flex-col items-start w-full">
                                     {node.id === "orbit-77" ? (
                                       <button className="w-full flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.3em] transition-all p-3 -mx-3 rounded-xl hover:bg-[#39FF14]/10 border border-transparent hover:border-[#39FF14]/30 shadow-[0_0_15px_rgba(57,255,20,0)] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)]">
                                          <span className="transition-colors duration-500" style={{ color: node.color }}>
                                            {node.hoverCard.buttonLabel}
                                          </span>
                                       </button>
                                     ) : (
                                        <div className="w-full flex justify-between items-center text-[10px] uppercase font-bold tracking-[0.3em] transition-all p-3 -mx-3 rounded-xl hover:bg-white/5 border border-transparent cursor-default">
                                           <span className="transition-colors duration-500 text-[#FFB000]">
                                             {node.hoverCard.buttonLabel}
                                           </span>
                                        </div>
                                     )}

                                     {node.hoverCard.buttonSubLabel && (
                                       <p className="text-[9px] font-sans text-white/40 mt-3 font-light leading-relaxed border-t border-white/5 pt-3 w-full">
                                         {node.hoverCard.buttonSubLabel}
                                       </p>
                                     )}
                                  </div>
                                </>
                              )}
                           </motion.div>
                        </div>
                     );
                  })()}

               </Link>
            </motion.div>
         ))}

      </div>
    </div>
  );
}