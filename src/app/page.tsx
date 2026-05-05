"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useGlobalContext } from "./providers";
import PyadraStone from "./components/interactive/PyadraStone";

interface GameStats {
  timeElapsed: number;
  pulsesSent: number;
  signalsFound: number;
  timestamp: string;
}

export default function PyAdraHome() {
  const [observerId, setObserverId] = useState<string | null>(null);
  const [observerNum, setObserverNum] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const { isMuted, toggleAudio } = useGlobalContext();

  useEffect(() => {
    setMounted(true);

    // Setup Observer ID
    const localId = window.localStorage.getItem("pyadra_observer_id");
    const localNum = window.localStorage.getItem("pyadra_observer_num");

    if (localId && localNum) {
      setObserverId(localId);
      setObserverNum(parseInt(localNum, 10));
    } else {
      fetch("/api/observer")
        .then(r => r.json())
        .then(data => {
           const formatted = `#${String(data.id).padStart(4, '0')}`;
           window.localStorage.setItem("pyadra_observer_id", formatted);
           window.localStorage.setItem("pyadra_observer_num", String(data.id));
           setObserverId(formatted);
           setObserverNum(data.id);
        })
        .catch((err) => {
          console.error('[Observer] Failed to initialize:', err);
          setObserverId('#0000');
          setObserverNum(0);
        });
    }
  }, []);

  const handleComplete = async (stats: GameStats) => {
    if (observerNum) {
      // Save to database in background (fire and forget)
      fetch('/api/home/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          observerId: observerNum,
          timeElapsed: stats.timeElapsed,
          pulsesSent: stats.pulsesSent,
          signalsFound: stats.signalsFound,
          timestamp: stats.timestamp,
        }),
      }).catch(err => console.error('Failed to save completion:', err));
    }
  };

  return (
    <div className="h-[100dvh] w-full bg-[#000000] text-[#E3DAC9] overflow-hidden font-sans select-none relative">

      {/* Top Bar (Minimalist) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 1 }}
        className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-12 pointer-events-none"
      >
        <div className="text-[9px] md:text-[10px] font-mono tracking-[0.4em] uppercase text-[#FFB000]/30 flex items-center gap-3">
          <div className="w-1 h-1 bg-[#FFB000]/50 rounded-full"></div>
          {observerId ? `ID ${observerId}` : "..."}
        </div>

        <button
          onClick={toggleAudio}
          className="pointer-events-auto text-[9px] md:text-[10px] font-mono tracking-[0.4em] uppercase transition-colors hover:text-[#FFB000] flex items-center gap-2 outline-none"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          <span className={isMuted ? "text-[#E3DAC9]/20" : "text-[#FFB000]/40"}>
            {isMuted ? "AUDIO MUTED" : "AUDIO ACTIVE"}
          </span>
        </button>
      </motion.div>

      {/* The Pyadra Stone Experience */}
      {mounted && (
        <PyadraStone 
          onComplete={handleComplete} 
          observerId={observerNum ? String(observerNum).padStart(4, '0') : null} 
        />
      )}

      {/* Footer (Minimalist legal links) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 2 }}
        className="absolute bottom-6 md:bottom-8 left-0 right-0 flex flex-wrap items-center justify-center gap-4 md:gap-8 text-[8px] md:text-[9px] font-mono tracking-[0.3em] text-[#E3DAC9]/10 uppercase z-50 pointer-events-auto"
      >
        <a href="/manifesto" className="hover:text-[#FFB000]/50 transition-colors">Manifesto</a>
        <span className="text-[#E3DAC9]/5">|</span>
        <a href="/legal/terms" className="hover:text-[#FFB000]/50 transition-colors">Terms</a>
        <span className="text-[#E3DAC9]/5">|</span>
        <a href="/legal/privacy" className="hover:text-[#FFB000]/50 transition-colors">Privacy</a>
      </motion.div>

    </div>
  );
}
