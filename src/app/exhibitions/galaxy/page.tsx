"use client"; // force turbopack update

import { motion, useMotionValue } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const EcosystemCanvas = dynamic(() => import("./EcosystemCanvas"), { ssr: false });

const nodes = [
  {
    id: "orbit-77",
    name: "Orbit 77",
    x: "50%",
    y: "30%",
    size: 220,
    color: "#39FF14",
    hoverCard: {
       label: "PODCAST & MEDIA",
       badgeText: "[ live ]",
       badgeColor: "text-[#39FF14]",
       badgeDot: "",
       metrics: "10 Episodes  •  Season 1 Complete  •  Now Streaming",
       description: null,
       nodeStatus: [
         { label: "Content", value: "Complete" },
         { label: "Distribution", value: "In Progress" },
         { label: "Crew", value: "Recruiting Now" }
       ],
       buttonLabel: "ENTER NODE →",
       buttonHref: "/exhibitions/galaxy/orbit",
       buttonSubLabel: null
    }
  },
  {
    id: "ebok",
    name: "EBOK",
    x: "25%",
    y: "52%",
    size: 150,
    color: "#8B7355",
    hoverCard: {
       label: "PHYSICAL ANTHOLOGY",
       badgeText: "[ forming ]",
       badgeColor: "text-[#8B7355]",
       badgeDot: "",
       metrics: null,
       description: "Stories from the void.\nPhysical pages holding digital souls.\n\nA book of collected transmissions.\nComing 2026.",
       nodeStatus: [
         { label: "Concept", value: "Defined" },
         { label: "Writing", value: "In Progress" },
         { label: "Publication", value: "Q3 2026" }
       ],
       buttonLabel: "WATCH THIS NODE",
       buttonHref: "#",
       buttonSubLabel: "This node is forming. Be notified when it opens."
    }
  },
  {
    id: "ethernicapsule",
    name: "EtherniCapsule",
    x: "50%",
    y: "65%",
    size: 180,
    color: "#C4A882",
    hoverCard: {
       label: "DIGITAL MEMORY",
       badgeText: "[ live ]",
       badgeColor: "text-[#C4A882]",
       badgeDot: "",
       metrics: "Time-Locked Letters  •  Encrypted Sealing  •  Guardian System",
       description: "A letter written for someone\nwho isn't ready to read it yet.\n\nSeal your words. Pass the key.\nLet time decide when they arrive.",
       nodeStatus: [
         { label: "Platform", value: "Live" },
         { label: "Encryption", value: "Active" },
         { label: "Guardians", value: "Recruiting" }
       ],
       buttonLabel: "ENTER NODE →",
       buttonHref: "/exhibitions/galaxy/ethernicapsule",
       buttonSubLabel: null
    }
  },
  {
    id: "figurines",
    name: "Figurines",
    x: "75%",
    y: "52%",
    size: 150,
    color: "#DCA88F",
    hoverCard: {
       label: "PHYSICAL SCULPTURE",
       badgeText: "[ live ]",
       badgeColor: "text-[#DCA88F]",
       badgeDot: "",
       metrics: "Hand-Painted  •  Chibi Style  •  A$175 AUD",
       description: "Send us your selfies.\nWe craft a hand-painted figurine—\n\nunique, physical, permanent.\n3D printed & painted by hand.",
       nodeStatus: [
         { label: "Commissions", value: "Open" },
         { label: "Production", value: "3-6 Weeks" },
         { label: "Shipping", value: "Worldwide" }
       ],
       buttonLabel: "COMMISSION YOURS →",
       buttonHref: "/exhibitions/galaxy/figurines",
       buttonSubLabel: null
    }
  },
  {
    id: "project-mystery-1",
    name: "UNKNOWN NODE",
    x: "20%",
    y: "82%",
    size: 70,
    color: "#888888",
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
    }
  },
  {
    id: "project-mystery-2",
    name: "UNKNOWN NODE",
    x: "80%",
    y: "82%",
    size: 70,
    color: "#888888",
    isMystery: true,
    hoverCard: {
       isMystery: true,
       label: "",
       badgeText: "",
       badgeColor: "",
       badgeDot: "",
       metrics: null,
       description: "Something is awakening...\nPatience.",
       nodeStatus: [],
       buttonLabel: "",
       buttonHref: "#",
       buttonSubLabel: null
    }
  }
];

export default function ProjectsConstellation() {
  const router = useRouter();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  const [audioStatus, setAudioStatus] = useState<"ACTIVE" | "MUTED">("ACTIVE");
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  // OPTIMIZED: Frame loop escape. Using Framer Motion directly bypasses React re-rendering.
  // This solves massive CPU spikes on mouse move.
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  useEffect(() => {
    setMounted(true);
    fetch('/api/observers', { method: 'POST' }).catch(() => {});
    return () => {
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
            audioContextRef.current.close().catch(()=>{});
        }
    }
  }, []);

  const initializeAudio = () => {
      if (audioStatus === "MUTED") return;
      if (audioContextRef.current) {
          if (audioContextRef.current.state === 'suspended') {
              audioContextRef.current.resume();
          }
          return;
      }
      
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
          try {
              const ctx = new AudioContextClass();
              audioContextRef.current = ctx;
              
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              // 1. AUDIO FIX: Drop frequency drastically for a soft, almost imperceptible dark hum (108Hz).
              osc.frequency.value = 108; 
              
              const lfo = ctx.createOscillator();
              lfo.frequency.value = 0.2; // Slower breath
              const lfoGain = ctx.createGain();
              lfoGain.gain.value = 5; 
              lfo.connect(lfoGain);
              lfoGain.connect(osc.frequency);
              
              osc.connect(gain);
              gain.connect(ctx.destination);
              
              gain.gain.value = 0.02; // Practically inaudible idle
              osc.start();
              lfo.start();
              
              oscillatorRef.current = osc;
              gainNodeRef.current = gain;
          } catch(err) {
              console.log("Audio contextual restrictions locked.");
          }
      }
  };

  const triggerClimax = () => {
     if (!oscillatorRef.current || !audioContextRef.current || audioStatus === "MUTED") return;
     const now = audioContextRef.current.currentTime;
     
     // AUDIO FIX: Instead of a piercing 864Hz shriek, it sweeps softly to 216Hz for 1 second, then drops back.
     // This makes reading cards relaxing while still feeling the interaction.
     oscillatorRef.current.frequency.cancelScheduledValues(now);
     oscillatorRef.current.frequency.setTargetAtTime(216, now, 0.5);
     
     if (gainNodeRef.current) {
         gainNodeRef.current.gain.cancelScheduledValues(now);
         // Subdued climax volume
         gainNodeRef.current.gain.setTargetAtTime(0.06, now, 0.5);
     }
  };

  const returnToDrone = () => {
     if (!oscillatorRef.current || !audioContextRef.current || audioStatus === "MUTED") return;
     const now = audioContextRef.current.currentTime;
     oscillatorRef.current.frequency.cancelScheduledValues(now);
     oscillatorRef.current.frequency.setTargetAtTime(108, now, 1.0);
     
     if (gainNodeRef.current) {
         gainNodeRef.current.gain.cancelScheduledValues(now);
         gainNodeRef.current.gain.setTargetAtTime(0.02, now, 1.0);
     }
  };

  useEffect(() => {
      if (hoveredNode) {
         triggerClimax();
      } else {
         returnToDrone();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoveredNode, audioStatus]);

  useEffect(() => {
      const handleGlobalClick = () => {
          if (audioStatus === "ACTIVE" && !audioContextRef.current) {
              initializeAudio();
          }
      };
      document.addEventListener("click", handleGlobalClick, { once: true });
      return () => document.removeEventListener("click", handleGlobalClick);
  }, [audioStatus]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (audioStatus === "ACTIVE" && !audioContextRef.current) {
         initializeAudio();
    }

    // Bypassing React render loop for massive performance spike
    cursorX.set(e.clientX - 16);
    cursorY.set(e.clientY - 16);

    if (audioStatus === "ACTIVE" && audioContextRef.current) {
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(()=>{});
        }
    }
  };

  const toggleSound = () => {
      if (audioStatus === "MUTED") {
          setAudioStatus("ACTIVE");
          initializeAudio();
      } else {
          setAudioStatus("MUTED");
          if (audioContextRef.current) {
              audioContextRef.current.suspend();
          }
      }
  };

  return (
    // 3. COLOR FIX: Shifted to a deep ink/obsidian tone instead of brown
    <div 
       className="min-h-[100dvh] bg-[#02040A] text-[#E8D9BB] overflow-hidden font-sans relative w-full flex items-center justify-center select-none"
       onMouseMove={handleMouseMove}
       style={{ cursor: 'none' }}
    >
      <motion.div 
         className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/30 pointer-events-none z-[100] transition-transform duration-300 ease-out"
         style={{ x: cursorX, y: cursorY }}
         animate={{ scale: hoveredNode ? 2.0 : 1 }}
      />
      <motion.div 
         className="fixed top-0 left-0 w-1.5 h-1.5 bg-white/50 rounded-full pointer-events-none z-[100] transition-opacity"
         style={{ x: cursorX, y: cursorY, translateX: 13, translateY: 13 }}
         animate={{ opacity: hoveredNode ? 0 : 1 }}
      />

      <motion.div 
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         transition={{ duration: 2, ease: "easeInOut" }}
         className="absolute inset-0 z-0 pointer-events-none"
      >
          {/* THREE.JS engine receives no React re-rendered props on mousemove, meaning 60fps locked */}
          <EcosystemCanvas hoveredNode={hoveredNode} />
      </motion.div>
      
      <div className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between">
          <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="w-full p-8 md:p-12 flex justify-between items-start pointer-events-auto"
          >
            <Link href="/" className="text-[10px] uppercase font-sans font-light tracking-[0.3em] text-[#E8D9BB]/80 hover:text-[#C4A882] transition-colors duration-500 cursor-none">
              [ Return to Main ]
            </Link>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#E8D9BB]/60">
              Galaxy Exhibition
            </span>
          </motion.nav>

          <div className="absolute top-28 md:top-32 left-8 md:left-12 pointer-events-none">
            <motion.h1 
               initial={{ opacity: 0, filter: "blur(10px)", x: -20 }}
               animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
               transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
               className="text-4xl md:text-5xl font-serif italic font-light leading-tight mb-4"
            >
              <span className="bg-gradient-to-br from-[#FFFFFF] via-[#E8D9BB] to-[#C4A882]/80 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(196,168,130,0.1)]">
                  Galaxy Exhibition
              </span>
            </motion.h1>
            
            <motion.p
               initial={{ opacity: 0, clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)" }}
               animate={{ opacity: 1, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
               transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
               className="text-[11px] md:text-[12px] font-mono text-[#E8D9BB]/70 uppercase tracking-[0.1em] leading-loose max-w-lg font-light whitespace-pre-line"
            >
              Four live projects. Two forming.
              Participate. Support. Leave your mark.
              What you contribute becomes permanent.
            </motion.p>
          </div>

          <div className="absolute inset-0 w-full h-[100dvh] max-w-[1400px] pointer-events-none mx-auto">
            {mounted && nodes.map((node, index) => {
                const cardWidth = node.isMystery ? 'auto' : '320px';
                let desktopPosClass = "md:absolute md:top-1/2 md:-translate-y-1/2 md:left-[calc(100%+30px)] md:bottom-auto md:-translate-x-0";
                
                const xVal = parseInt(node.x);
                if (xVal > 60) {
                    desktopPosClass = "md:absolute md:top-1/2 md:-translate-y-1/2 md:right-[calc(100%+30px)] md:left-auto md:bottom-auto md:-translate-x-0";
                }

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    transition={{ duration: 2, delay: 1 + (index * 0.4), ease: "easeOut" }}
                    className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                    style={{ left: node.x, top: node.y, zIndex: hoveredNode === node.id ? 50 : 20 }}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                        <div
                            onClick={() => {
                               if (node.hoverCard.buttonHref !== "#") {
                                   router.push(node.hoverCard.buttonHref);
                               }
                            }}
                            className="rounded-full flex flex-col items-center justify-center relative group transition-all duration-300 cursor-none"
                            style={{ width: node.size, height: node.size }}
                        >
                            {!node.isMystery && (
                              <span
                                className="absolute w-full font-serif italic transition-all duration-500 font-light text-center"
                                style={{
                                  fontSize: `${node.size * 0.15}px`,
                                  lineHeight: 1.1,
                                  color: hoveredNode === node.id ? node.color : '#888888',
                                  opacity: hoveredNode === node.id ? 1 : 0.8,
                                  textShadow: hoveredNode === node.id ? `0 0 30px ${node.color}` : 'none',
                                  bottom: '-10px'
                                }}
                              >
                                {node.name}
                              </span>
                            )}
                        </div>
                        
                        {hoveredNode === node.id && (
                             <div className={`fixed inset-x-0 bottom-0 md:w-max flex justify-center pointer-events-auto ${desktopPosClass}`}>
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="bg-[#05060A]/95 backdrop-blur-3xl p-6 md:p-7 shadow-[0_40px_100px_rgba(0,0,0,0.95)] text-left w-full rounded-t-[4px] md:rounded-[4px] border border-white/5"
                                    style={{ 
                                      width: cardWidth,
                                      borderTopColor: `${node.color}50`
                                    }}
                                >
                                    {node.isMystery ? (
                                      <div className="flex items-center justify-center text-center py-4">
                                        <p className="text-[10px] uppercase font-mono tracking-widest text-[#E8D9BB]/60 leading-relaxed whitespace-pre-line font-light">
                                          {node.hoverCard.description}
                                        </p>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="flex justify-between items-center mb-6 gap-6">
                                          <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#E8D9BB]/50">{node.hoverCard.label}</span>
                                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 ${node.hoverCard.badgeColor}`}>
                                            <span className="text-[9px] font-mono uppercase tracking-[0.2em] font-medium">
                                              {node.hoverCard.badgeText}
                                            </span>
                                          </div>
                                        </div>
                                        
                                        <h4 className="text-3xl font-serif italic mb-5 tracking-tight font-light" style={{ color: node.color, textShadow: `0 0 15px ${node.color}40` }}>
                                          {node.name}
                                        </h4>
                                        <div className="w-full h-[1px] bg-white/10 my-4" />
                                        
                                        {node.hoverCard.metrics && (
                                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#E8D9BB]/90 font-normal leading-relaxed mb-5 whitespace-pre-line">
                                            {node.hoverCard.metrics.split(' • ').map((m, i) => (
                                              <span key={i}>
                                                {m}
                                                {i < 2 && <span className="mx-2 text-[#E8D9BB]/30">•</span>}
                                              </span>
                                            ))}
                                          </p>
                                        )}
                                        
                                        {node.hoverCard.description && (
                                          <p className="text-[13px] font-sans font-light text-[#E8D9BB]/80 leading-relaxed mb-6 whitespace-pre-line bg-white/5 p-4 rounded-[4px]">
                                            {node.hoverCard.description}
                                          </p>
                                        )}
                                        
                                        {node.hoverCard.nodeStatus && node.hoverCard.nodeStatus.length > 0 && (
                                          <div className="mb-6">
                                            <span className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#E8D9BB]/40 block mb-3">NODE STATUS:</span>
                                            <ul className="space-y-3 pl-1">
                                                {node.hoverCard.nodeStatus.map((statusItem, idx) => (
                                                  <li key={idx} className="flex items-center gap-3">
                                                    <span className="text-[#E8D9BB]/50 text-[10px]">✦</span>
                                                    <div className="flex gap-2 text-[11px] font-mono tracking-wider items-center w-full">
                                                        <span className="text-[#E8D9BB]/70 w-24">{statusItem.label}</span>
                                                        <span className="text-[#E8D9BB]/90 font-medium" style={{ color: statusItem.value === 'Complete' ? node.color : 'rgba(232, 217, 187, 0.9)' }}>
                                                          {statusItem.value}
                                                        </span>
                                                    </div>
                                                  </li>
                                                ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        <div className="mt-6 flex flex-col items-start w-full gap-3">
                                          {node.hoverCard.buttonHref !== "#" ? (
                                            <div
                                                onClick={() => router.push(node.hoverCard.buttonHref)}
                                                className={`w-full flex justify-center items-center text-[11px] uppercase font-semibold tracking-[0.2em] transition-all p-3.5 rounded-[4px] bg-white/10 hover:bg-white/20 cursor-none`}
                                                style={{ color: node.color }}
                                            >
                                                 {node.hoverCard.buttonLabel}
                                            </div>
                                          ) : (
                                              <div className="w-full flex justify-center items-center text-[11px] uppercase font-semibold tracking-[0.2em] transition-all p-3.5 rounded-[4px] bg-white/5 opacity-50 text-[#E8D9BB] cursor-none pointer-events-none">
                                                {node.hoverCard.buttonLabel}
                                              </div>
                                          )}

                                          {node.hoverCard.buttonSubLabel && (
                                            <p className="text-[10px] font-sans text-[#E8D9BB]/50 font-light leading-relaxed w-full text-center">
                                              {node.hoverCard.buttonSubLabel}
                                            </p>
                                          )}
                                        </div>
                                      </>
                                    )}
                                </motion.div>
                              </div>
                        )}
                  </motion.div>
                );
            })}
          </div>

          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 2, delay: 2.5 }}
             className="absolute bottom-8 right-8 z-50 pointer-events-auto flex items-center justify-end bg-black/80 backdrop-blur-xl px-4 py-2.5 rounded-[4px] border border-white/10 hover:bg-white/10 transition-colors cursor-none"
             onClick={toggleSound}
          >
             <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: audioStatus === "ACTIVE" ? (hoveredNode ? nodes.find(n => n.id === hoveredNode)?.color || "#888" : "#888") : '#E8D9BB', opacity: audioStatus === "ACTIVE" ? 1 : 0.6 }}>
               FREQ: {audioStatus}
             </span>
             <span className="ml-3 text-[12px] opacity-80">
               {audioStatus === 'MUTED' ? '🔇' : '🔊'}
             </span>
          </motion.div>
      </div>
    </div>
  );
}