"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface GlobalContextType {
  isMuted: boolean;
  toggleAudio: () => void;
}

const GlobalContext = createContext<GlobalContextType>({
  isMuted: true,
  toggleAudio: () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element only on client to avoid hydration mismatch
  useEffect(() => {
    // Disabled: audio file not available
    // TODO: Add ambient-drone.mp3 to /public directory to enable
    // const audio = new Audio("/ambient-drone.mp3");
    // audio.loop = true;
    // audio.volume = 0; // start at 0
    // audioRef.current = audio;
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      // Activating with 3s fade-in to 30% volume
      audioRef.current.play().catch(() => {});
      setIsMuted(false);
      
      let vol = 0;
      const step = 0.3 / 30; // 3 seconds at ~10 steps/sec = 30 steps
      const fade = setInterval(() => {
        vol = Math.min(vol + step, 0.3);
        if (audioRef.current) audioRef.current.volume = vol;
        if (vol >= 0.3) clearInterval(fade);
      }, 100);
    } else {
      // Deactivating with 2s fade-out
      setIsMuted(true);
      
      let vol = audioRef.current.volume;
      const step = vol / 20; // 2 seconds
      const fade = setInterval(() => {
        vol = Math.max(vol - step, 0);
        if (audioRef.current) audioRef.current.volume = vol;
        if (vol <= 0) {
          if (audioRef.current) audioRef.current.pause();
          clearInterval(fade);
        }
      }, 100);
    }
  };

  return (
    <GlobalContext.Provider value={{ isMuted, toggleAudio }}>
      {children}
    </GlobalContext.Provider>
  );
}
