"use client";
// CACHE BUST: 2026-03-26T14:02:27+08:00
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useGlobalContext } from "./providers";

const Scene = dynamic(() => import("./components/Scene"), { ssr: false });

export default function ShadowEarthHome() {
  const [hovered, setHovered] = useState(false); 
  const [isInitializing, setIsInitializing] = useState(true);
  const [stats, setStats] = useState({ members: 0, nodes: 0 }); // Dynamically pulled from Stripe
  
  const { isMuted, toggleAudio } = useGlobalContext();
  const [observerId, setObserverId] = useState<string | null>(null);
  const [showObserverOverlay, setShowObserverOverlay] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    // Stage 1: Pre-Loader timeout (1.5s of pure anticipation)
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 1500); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fetch Live Project Data (Nodes and Stripe Founding Members/Supporters)
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch((err) => {
        console.error("Missing DB Connection - Fallback to active mock data", err);
        setStats({ members: 2, nodes: 1 });
      });
  }, []);

  useEffect(() => {
    // Setup Local Observer ID
    const localId = window.localStorage.getItem("pyadra_observer_id");
    if (localId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setObserverId(localId);
    } else {
      fetch("/api/observer")
        .then(r => r.json())
        .then(data => {
           const formatted = `#${String(data.id).padStart(4, '0')}`;
           window.localStorage.setItem("pyadra_observer_id", formatted);
           setObserverId(formatted);
        })
        .catch(() => {});
    }
  }, []);

  const handleAudioToggle = () => {
    toggleAudio();
    if (isMuted) {
      // Oval gold ring emits ONE soft pulse
      setHovered(true);
      setTimeout(() => setHovered(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#E3DAC9] flex flex-col justify-center items-center relative overflow-hidden font-sans">
      
      {/* EASTER EGG PARTICLE */}
      {mounted && (
        <motion.div 
          className="absolute w-[3px] h-[3px] rounded-full bg-[#FFB000] shadow-[0_0_8px_#FFB000] cursor-crosshair group z-50 pointer-events-auto"
          initial={{ x: "-40vw", y: "-30vh" }}
          animate={{ 
            x: ["-40vw", "35vw", "15vw", "-40vw"],
            y: ["-30vh", "20vh", "40vh", "-30vh"],
          }}
          transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
        >
           {/* Tooltip */}
           <div className="absolute top-4 left-4 ml-2 min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#0A0A0A]/90 backdrop-blur-md border border-[#FFB000]/20 p-4 rounded-xl pointer-events-none shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
              <p className="text-[10px] font-mono text-[#FFB000] tracking-widest uppercase mb-2">You found the first node.</p>
              <p className="text-[9px] font-mono text-white/50 tracking-widest uppercase inline-block border-b border-white/10 pb-1">Keep looking.</p>
           </div>
        </motion.div>
      )}

      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Pass inverted isMuted (audioActive) down to Scene to speed up particles by 10% */}
        <Scene hovered={hovered} audioActive={!isMuted} />
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#000000_100%)] pointer-events-none z-0 mix-blend-multiply" />

      {/* OBSERVER IDENTITY (Top Left) */}
      <div className="absolute top-8 left-8 md:top-12 md:left-12 z-50">
        <button 
          onClick={() => setShowObserverOverlay(true)}
          className="text-[8px] font-mono tracking-[0.4em] uppercase transition-colors duration-500 text-[#FFB000]/70 hover:text-[#FFB000] outline-none opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]"
        >
          OBSERVER {observerId || "..."}
        </button>
      </div>

      {/* OBSERVER OVERLAY MODAL */}
      <AnimatePresence>
         {showObserverOverlay && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
             className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
           >
              <motion.div 
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="max-w-md w-full bg-[#0A0A0A]/90 border border-white/10 rounded-2xl p-8 md:p-12 text-center shadow-[0_0_50px_rgba(0,0,0,0.8)]"
              >
                 <span className="text-[10px] md:text-xs font-mono text-[#FFB000] uppercase tracking-[0.4em] mb-8 block">
                   OBSERVER {observerId}
                 </span>
                 <p className="text-sm font-sans font-light text-[#E3DAC9]/80 leading-relaxed mb-6">
                   This number is yours.<br/>You arrived early.
                 </p>
                 <p className="text-xs font-sans font-light text-[#E3DAC9]/50 leading-relaxed mb-10">
                   If you choose to enter the ecosystem —<br/>as a Supporter or part of the Crew —<br/>this becomes your permanent identity.
                 </p>
                 <p className="text-[10px] font-mono uppercase tracking-widest text-[#E3DAC9]/40 mb-12 pb-4 border-b border-white/5">
                   The ecosystem remembers who arrived first.
                 </p>

                 <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
                    <button 
                      onClick={() => setShowObserverOverlay(false)} 
                      className="text-[9px] font-mono tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors"
                    >
                      [ CLOSE ]
                    </button>
                    <Link 
                      href="/projects" 
                      className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#FFB000] hover:text-[#FFB000] hover:drop-shadow-[0_0_10px_rgba(255,176,0,0.8)] transition-all"
                    >
                      [ ENTER THE ECOSYSTEM → ]
                    </Link>
                 </div>
              </motion.div>
           </motion.div>
         )}
      </AnimatePresence>

      {/* STEALTH UI HUD */}
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
      
      {/* FREQUENCY AUDIO TOGGLE */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 z-50">
        <button 
          onClick={handleAudioToggle}
          className="text-[8px] font-mono tracking-[0.4em] uppercase transition-colors duration-500 hover:text-[#FFB000] outline-none flex items-center gap-2 group"
        >
          FREQUENCY: <span className={isMuted ? "text-[#E3DAC9]/40 group-hover:text-[#FFB000]/60 transition-colors" : "text-[#39FF14] drop-shadow-[0_0_5px_rgba(57,255,20,0.5)] transition-colors animate-pulse"}>
            {isMuted ? "MUTED" : "ACTIVE"}
          </span>
        </button>
      </div>

      <div className="relative z-20 w-full h-full flex justify-center items-center pointer-events-none">
        <div className="relative flex flex-col items-center justify-center p-8 md:p-16 w-full max-w-[800px] h-[800px] pointer-events-auto mt-6">
          
          {/* THE LITHIC PULSE */}
          <motion.div 
            animate={{ 
               opacity: isMuted ? [0.05, 0.2, 0.05] : [0.08, 0.35, 0.08], 
               scale: isMuted ? [0.95, 1.1, 0.95] : [0.98, 1.15, 0.98] 
            }}
            transition={{ duration: isMuted ? 12 : 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#2D2926] rounded-full blur-[100px] pointer-events-none z-0"
          />

          <AnimatePresence mode="wait">
             {isInitializing ? (
               <motion.div 
                  key="loader"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
               >
                 <p className="text-[9px] md:text-[10px] font-mono tracking-[0.5em] text-[#39FF14]/50 transition-colors uppercase animate-pulse">
                   SIGNAL DETECTED — INITIALIZING...
                 </p>
               </motion.div>
             ) : (
               <motion.div 
                 key="content"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 2, ease: "easeOut" }}
                 className="relative z-10 flex flex-col items-center w-full"
               >
                  {/* RITUAL PRE-TITLE */}
                  <h2 className="text-[10px] md:text-[11px] tracking-[0.6em] uppercase mb-10 font-sans font-light text-[#FFB000] mix-blend-screen drop-shadow-[0_0_15px_rgba(255,176,0,0.5)]">
                    [ The Core ]
                  </h2>

                  {/* PYADRA SCULPT */}
                  <h1 
                    className="text-6xl md:text-7xl lg:text-8xl font-serif italic font-light tracking-widest mb-6 select-none leading-none"
                    style={{ textShadow: "1px 1px 0px rgba(255,255,255,0.15), -1px -1px 3px rgba(0,0,0,0.8)" }}
                  >
                    <span className="bg-gradient-to-br from-[#FFFFFF] via-[#FFB000] to-[#503500] bg-clip-text text-transparent">
                      Pyadra
                    </span>
                  </h1>

                  {/* RITUAL COPYWRITING - Refined & Minimal */}
                  <p className="text-[10px] md:text-[12px] uppercase tracking-[0.2em] md:tracking-[0.4em] font-light leading-[3] text-center max-w-2xl mt-4 mb-20 text-[#E3DAC9]/70 px-4 drop-shadow-md">
                    An ecosystem etched in stone.<br/>
                    <span className="mt-6 block font-serif italic text-[11px] md:text-[13px] text-[#FFB000]/90 tracking-[0.1em] md:tracking-[0.2em] drop-shadow-[0_0_15px_rgba(255,176,0,0.6)]">
                      Where people build things that last.
                    </span>
                  </p>

                  <div className="flex flex-col items-center mb-16">
                    {/* THE CATALYST TRIGGER HITBOX */}
                    <Link 
                      href="/projects" 
                      onMouseEnter={() => setHovered(true)} 
                      onMouseLeave={() => setHovered(false)}
                      className="group flex flex-col items-center gap-6 transition-all duration-1000"
                    >
                       <div className="flex flex-col items-center gap-2">
                         <span className="text-[10px] uppercase tracking-[0.5em] font-sans font-bold text-[#E3DAC9]/70 group-hover:text-[#FFB000] group-hover:drop-shadow-[0_0_20px_rgba(255,176,0,0.8)] transition-all duration-700">
                           ENTER THE ECOSYSTEM
                         </span>
                       </div>
                       
                       {/* Transmitted Gold Laser Connector */}
                       <div className="w-[1px] h-[50px] bg-gradient-to-b from-[#E3DAC9]/20 to-transparent group-hover:h-[70px] group-hover:from-[#FFB000] group-hover:shadow-[0_0_30px_#FFB000] transition-all duration-[1000ms] ease-out mt-2" />
                    </Link>
                  </div>

                  {/* ECOSYSTEM STATUS BAR - Pushed completely down */}
                  <div className="mt-8 flex flex-col items-center opacity-80">
                     <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-6 md:gap-12 text-[9px] font-mono tracking-[0.2em] text-[#E3DAC9]/50 uppercase transition-opacity">
                        <div className="flex items-center gap-3">
                           Nodes Active <span className="text-white/20">—</span> <span className="text-[#39FF14] drop-shadow-[0_0_5px_rgba(57,255,20,0.5)] font-bold">{stats.nodes || 1}</span>
                        </div>
                        
                        <span className="text-[#E3DAC9]/10 hidden md:inline">|</span>
                        
                        <div className="flex flex-col items-center gap-1">
                           <div className="flex items-center gap-3">
                             Supporters <span className="text-white/20">—</span> <span className="text-[#FFB000] font-bold">{stats.members || '--'}</span>
                           </div>
                        </div>
                        
                        <span className="text-[#E3DAC9]/10 hidden md:inline">|</span>
                        
                        <div className="flex items-center gap-3">
                           Units Created <span className="text-white/20">—</span> <span className="text-[#E3DAC9]/90 font-bold">{(stats.members || 0) * 100}</span>
                        </div>
                     </div>
                  </div>

               </motion.div>
             )}
          </AnimatePresence>

          {/* ULTRA-MINIMALIST FOOTER */}
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