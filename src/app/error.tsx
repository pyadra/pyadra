"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error("Pyadra Internal Protocol Error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#000000] text-[#E3DAC9] flex flex-col justify-center items-center font-mono selection:bg-[#FFB000]/20 selection:text-[#FFB000] p-6 text-center">
      <div className="max-w-md w-full bg-[#0A120D]/60 backdrop-blur-xl border border-[#FFB000]/30 rounded-2xl p-10 shadow-[0_0_30px_rgba(255,176,0,0.1)]">
        <span className="text-[10px] tracking-[0.4em] uppercase text-[#FFB000] mb-6 font-bold flex flex-col items-center gap-4">
          <span className="w-2 h-2 bg-[#FFB000] rounded-full animate-ping shadow-[0_0_15px_rgba(255,176,0,0.8)]" /> 
          Critical Exception
        </span>
        
        <h2 className="text-3xl font-serif italic mb-6">Connection Severed</h2>
        
        <p className="text-[10px] uppercase tracking-widest text-[#E3DAC9]/60 leading-relaxed mb-10">
          The node you are trying to reach has experienced structural telemetry failure.
        </p>

        <div className="space-y-4">
          <button 
            onClick={() => reset()}
            className="w-full px-6 py-4 rounded-full text-[9px] uppercase tracking-[0.3em] font-bold transition-all border border-[#FFB000]/30 hover:border-[#FFB000] text-[#FFB000] bg-[#FFB000]/5 hover:bg-[#FFB000]/20"
          >
            Attempt Re-link
          </button>
          
          <Link href="/">
            <button className="w-full px-6 py-4 rounded-full text-[9px] uppercase tracking-[0.3em] font-bold transition-all border border-white/10 hover:border-white/40 text-white/50 hover:text-white bg-black/40">
              Return to Core
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
