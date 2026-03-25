"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

// Authentic, synthetic low-end frequency drone generation via WebAudio API
export default function AmbientAudio() {
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const filterRef = useRef<BiquadFilterNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  
  const pathname = usePathname();
  const isOrbit = pathname?.includes("/orbit");
  const color = isOrbit ? "text-[#39FF14]" : "text-[#DCA88F]";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleAudio = () => {
    if (!active) {
      if (!audioCtxRef.current) {
        // Initialize synthetic drone (Warm, cinematic 40Hz sub-drone to mimic deep space/incubator hum)
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        oscRef.current = audioCtxRef.current.createOscillator();
        filterRef.current = audioCtxRef.current.createBiquadFilter();
        gainRef.current = audioCtxRef.current.createGain();
        
        oscRef.current.type = "sawtooth"; 
        
        // Lower pitch if we are in alien Orbit, higher if we are in Warm Incubator Pyadra
        const freq = isOrbit ? 38 : 45; 
        oscRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
        
        // Lowpass filter to muffle it completely into a distant wind instead of a buzz
        filterRef.current.type = "lowpass";
        filterRef.current.frequency.setValueAtTime(120, audioCtxRef.current.currentTime);
        
        gainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        gainRef.current.gain.linearRampToValueAtTime(0.05, audioCtxRef.current.currentTime + 3); // Slow 3s cinematic fade in
        
        oscRef.current.connect(filterRef.current);
        filterRef.current.connect(gainRef.current);
        gainRef.current.connect(audioCtxRef.current.destination);
        
        oscRef.current.start();
      } else {
        if (audioCtxRef.current.state === "suspended") {
          audioCtxRef.current.resume();
        }
        gainRef.current?.gain.linearRampToValueAtTime(0.05, audioCtxRef.current!.currentTime + 2);
      }
      setActive(true);
    } else {
      if (gainRef.current && audioCtxRef.current) {
         // Smooth cinematic exit (fade out over 2 seconds)
         gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 2);
      }
      setActive(false);
    }
  };

  if (!mounted) return null;

  return (
    <button 
      onClick={toggleAudio}
      className={`fixed bottom-8 right-8 md:bottom-[3.25rem] md:right-12 z-[500] text-[9px] font-sans tracking-[0.3em] uppercase transition-all duration-[1500ms] ${active ? `${color} opacity-80 shadow-[0_0_15px_currentColor]` : 'text-neutral-500 opacity-40 hover:opacity-100'}`}
    >
      Frequency: {active ? "Active" : "Muted"}
    </button>
  );
}
