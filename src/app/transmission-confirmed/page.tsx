"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

function ConfirmationInner() {
  const params = useSearchParams();
  const session_id = params.get("session_id");
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!session_id) return;
    (async () => {
      try {
        const r = await fetch(`/api/session?session_id=${encodeURIComponent(session_id)}`);
        if (!r.ok) return;
        const data = await r.json();
        const cents = Number(data?.session?.amount_total);
        if (!Number.isNaN(cents) && cents > 0) setAmount(cents / 100);
      } catch {
        /* ignore */
      }
    })();
  }, [session_id]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#000000] text-white flex flex-col items-center justify-center font-sans px-4">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,176,0,0.05)_0%,#000000_100%)] pointer-events-none" />

      {/* Military/Sci-Fi HUD Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl bg-[#0A120D]/60 backdrop-blur-xl border border-[#FFB000]/20 rounded-[2rem] p-8 md:p-16 flex flex-col items-center text-center shadow-[0_0_50px_rgba(255,176,0,0.05)]"
      >
        <span className="text-[9px] md:text-[11px] font-mono tracking-[0.4em] uppercase text-[#FFB000] mb-8 font-bold flex flex-col items-center gap-4">
          <span className="w-2 md:w-3 h-2 md:h-3 bg-[#FFB000] rounded-full animate-ping shadow-[0_0_15px_rgba(255,176,0,0.8)]" /> 
          Transmission Confirmed
        </span>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-[#F4EFEA] mb-8 font-light drop-shadow-[0_0_20px_rgba(255,176,0,0.3)]">
          Energy Received
        </h1>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFB000]/30 to-transparent mb-8" />

        {amount !== null ? (
          <p className="text-[10px] md:text-xs font-sans font-light tracking-[0.2em] md:tracking-[0.3em] text-[#E3DAC9]/80 mb-10 leading-loose uppercase">
            Transmission Confirmed.<br/>
            Thank you for the coffee. You contributed <span className="text-[#FFB000] font-bold drop-shadow-[0_0_10px_rgba(255,176,0,0.8)]">${amount.toFixed(2)} AUD</span> to nourish the ecosystem.
          </p>
        ) : (
          <p className="text-[10px] md:text-xs font-sans font-light tracking-[0.2em] md:tracking-[0.3em] text-[#E3DAC9]/80 mb-10 leading-loose uppercase">
            Transmission Confirmed.<br/>
            Thank you for the coffee. Your resources nourish our collective journey.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full">
          <Link href="/projects" className="group w-full sm:w-auto">
            <button className="w-full px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all border border-[#FFB000]/30 hover:border-[#FFB000] text-[#FFB000] bg-[#FFB000]/5 hover:bg-[#FFB000]/20 shadow-[0_0_20px_rgba(255,176,0,0.1)] group-hover:shadow-[0_0_30px_rgba(255,176,0,0.4)]">
              Initialize Constellation
            </button>
          </Link>
          <Link href="/" className="group w-full sm:w-auto">
            <button className="w-full px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all border border-white/10 hover:border-white/40 text-white/50 hover:text-white bg-black/40">
              Return to Core
            </button>
          </Link>
        </div>

        <p className="text-[8px] font-mono tracking-[0.3em] text-[#E3DAC9]/40 mt-12 uppercase">
          Transmission secured via Stripe Protocol.
        </p>
      </motion.div>
    </main>
  );
}

export default function TransmissionConfirmed() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#000000] flex items-center justify-center p-8 text-[#FFB000] font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Establishing Secure Link...</main>}>
      <ConfirmationInner />
    </Suspense>
  );
}
