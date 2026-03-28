"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

function ConfirmationInner() {
  const params = useSearchParams();
  const session_id = params.get("session_id");
  const isPreview = params.get("preview") === "1";
  const [supporterName, setSupporterName] = useState<string>(isPreview ? "Pablo Ramirez" : "Anonymous");
  const [supporterNumber, setSupporterNumber] = useState<string>(isPreview ? "O77-S1-PREV01" : "—");
  const [supporterId, setSupporterId] = useState<string | null>(null);
  const [dateStr, setDateStr] = useState<string>("");

  useEffect(() => {
    // Generate current date
    const d = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateStr(`${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`);

    if (isPreview) return;

    const verifySession = async () => {
      if (!session_id) return;
      try {
        const res = await fetch(`/api/session?session_id=${session_id}`);
        const data = await res.json();
        const name = data?.session?.metadata?.supporter_name;
        if (name && name !== "Anonymous") setSupporterName(name);

        const id = data?.session?.id as string | undefined;
        if (id) {
          const suffix = id.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(-6);
          setSupporterNumber(`O77-S1-${suffix}`);
        }

        if (data?.supporter_id) {
          setSupporterId(data.supporter_id);
        }
      } catch {
        /* ignore */
      }
    };
    verifySession();
  }, [session_id, isPreview]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Orbit 77 — Season Credential',
          text: `I'm officially part of the Orbit 77 archive. My credential: ${supporterNumber}.`,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Credential link copied to clipboard.");
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#020503] text-[#F4EFEA] flex flex-col items-center justify-center font-sans px-4 py-16">

      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(57,255,20,0.06)_0%,#020503_70%)] pointer-events-none" />
      <motion.div
        animate={{ opacity: [0.04, 0.1, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(57,255,20,0.15) 0%, transparent 70%)" }}
      />

      {/* Status label */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center gap-3 mb-10"
      >
        <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
        <span className="text-[9px] md:text-[10px] font-mono tracking-[0.35em] uppercase text-[#39FF14] font-bold">
          Orbit 77 — System Active
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 text-4xl md:text-5xl lg:text-7xl font-serif italic font-light text-center mb-5 drop-shadow-[0_0_30px_rgba(57,255,20,0.15)]"
      >
        Transmission Recorded.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="relative z-10 text-xs md:text-sm font-light font-sans text-[#AEFFA1]/70 text-center mb-14 max-w-md leading-relaxed"
      >
        Your signal arrived. The support has been permanently recorded in the Orbit 77 Archive.
      </motion.p>

      {/* DIGITAL SUPPORT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(15px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Card outer glow */}
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-br from-[#39FF14]/40 via-transparent to-[#39FF14]/10 blur-[3px] pointer-events-none" />

        {/* Card body */}
        <div className="relative bg-gradient-to-br from-[#0A1A0D] to-[#050A07] border border-[#39FF14]/30 rounded-3xl p-8 md:p-12 shadow-[0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden">

          {/* Card background texture */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#39FF14]/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Card top bar */}
          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#39FF14]/60 mb-1 font-bold">Orbit 77</p>
              <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#AEFFA1]/40">Season 1 — 2026</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#39FF14]/30 flex items-center justify-center shadow-[0_0_15px_rgba(57,255,20,0.2)]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] shadow-[0_0_10px_rgba(57,255,20,0.8)]" />
            </div>
          </div>

          {/* Supporter name */}
          <div className="mb-10 relative z-10">
            <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/50 mb-3">Display Name</p>
            <h2 className="text-3xl md:text-4xl font-serif italic text-[#F4EFEA] drop-shadow-[0_0_15px_rgba(57,255,20,0.1)]">
              {supporterName}
            </h2>
          </div>

          {/* Card footer row */}
          <div className="flex justify-between items-end border-t border-[#39FF14]/10 pt-8 relative z-10">
            <div>
              <p className="text-[9px] font-mono tracking-[0.3em] uppercase text-[#AEFFA1]/50 mb-2">Role</p>
              <p className="text-[12px] font-mono text-[#39FF14] tracking-widest font-bold">Orbit 77 Supporter</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] font-mono tracking-[0.2em] uppercase text-[#AEFFA1]/40 mb-1">Your permanent archive number</p>
              <p className="text-[9px] font-mono tracking-[0.4em] uppercase text-[#39FF14] mb-2 font-bold">Archive ID</p>
              <p className="text-sm md:text-base font-mono text-[#060B08] bg-[#39FF14] px-4 py-1.5 rounded-sm inline-block tracking-widest font-bold shadow-[0_0_10px_rgba(57,255,20,0.3)]">{supporterNumber}</p>
            </div>
          </div>

          {/* Date */}
          <div className="mt-6 relative z-10 text-right">
            <p className="text-[9px] font-mono tracking-[0.2em] text-[#AEFFA1]/30 uppercase">{dateStr}</p>
          </div>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="relative z-10 mt-14 text-xs md:text-sm font-light font-sans italic text-[#AEFFA1]/50 text-center max-w-sm leading-relaxed"
      >
        &ldquo;The content exists. The distribution doesn&apos;t — yet. That&apos;s the only thing standing between Orbit 77 and scale.&rdquo;
      </motion.p>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="relative z-10 flex flex-wrap gap-4 justify-center mt-12 max-w-2xl px-4"
      >
        <button onClick={handleShare} className="w-full sm:w-auto px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all border border-[#39FF14] text-[#060B08] bg-[#39FF14] hover:shadow-[0_0_30px_rgba(57,255,20,0.5)]">
          Share My Credential
        </button>
        <Link href="/projects/orbit" className="w-full sm:w-auto">
          <button className="w-full px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all border border-white/10 hover:border-white/30 text-[#AEFFA1]/70 hover:text-white bg-black/30">
            Return to Orbit 77
          </button>
        </Link>
        <div className="w-full sm:w-auto relative group">
          {supporterId ? (
            <Link href={`/archive/${supporterId}`} className="block w-full">
              <button className="w-full px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all border border-[#39FF14]/50 text-[#39FF14] bg-black/50 hover:bg-[#39FF14]/10 shadow-[0_0_15px_rgba(57,255,20,0.1)] hover:shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                View in Archive
              </button>
            </Link>
          ) : (
            <>
              <button disabled className="w-full px-8 py-4 rounded-full text-[10px] uppercase tracking-[0.3em] font-bold transition-all border border-white/5 text-white/20 bg-transparent cursor-not-allowed">
                View in Archive
              </button>
              <span className="absolute -top-3 right-1/2 translate-x-1/2 bg-[#020503] border border-white/10 px-2 py-0.5 text-[7px] font-mono tracking-widest uppercase text-white/30 rounded-full">Syncing...</span>
            </>
          )}
        </div>
      </motion.div>

      <p className="relative z-10 text-[8px] font-mono tracking-[0.3em] text-[#AEFFA1]/20 mt-10 uppercase">
        Secured via Stripe. One-time payment. No subscription.
      </p>
    </main>
  );
}

export default function TransmissionConfirmed() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#020503] flex items-center justify-center p-8 text-[#39FF14] font-mono text-[10px] uppercase tracking-[0.5em] animate-pulse">Confirming support...</main>}>
      <ConfirmationInner />
    </Suspense>
  );
}
