"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

/* Matches the Orbit 77 page design system: light museum surface,
   emerald accent, serif italic display + mono labels. */
const T = {
  display: 'text-3xl lg:text-4xl',
  heading: 'text-base',
  body: 'text-sm',
  small: 'text-[13px]',
  micro: 'text-[11px]',
} as const;

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
    <main className="min-h-screen bg-[#EDEFED] text-[#1A1C1A] antialiased selection:bg-[#059669] selection:text-white flex flex-col items-center justify-center font-sans px-4 py-16 relative overflow-hidden">

      {/* Soft museum light */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_20%,rgba(5,150,105,0.06)_0%,transparent_60%)]" />

      {/* Status label */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex items-center gap-2.5 mb-8"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
        <span className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#059669] font-bold`}>
          Orbit 77 — Transmission recorded
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`relative z-10 ${T.display} font-serif italic font-light text-center mb-4`}
      >
        Your signal arrived.
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`relative z-10 ${T.body} font-light text-[#6B8070] text-center mb-12 max-w-md leading-relaxed`}
      >
        The support has been permanently recorded in the Orbit 77 Archive.
      </motion.p>

      {/* DIGITAL SUPPORT CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(15px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="relative rounded-[32px] bg-white/60 border border-white/40 shadow-[0_20px_60px_rgba(10,18,14,0.10)] p-8 md:p-12 overflow-hidden">

          {/* Card ambient accent */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#059669]/5 rounded-full blur-[70px] pointer-events-none" />

          {/* Card top bar */}
          <div className="flex justify-between items-start mb-10 relative z-10">
            <div>
              <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#059669] font-bold mb-1`}>Orbit 77</p>
              <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070]`}>Season 1 — 2026</p>
            </div>
            <div className="w-10 h-10 rounded-full border border-[#059669]/25 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#059669]" />
            </div>
          </div>

          {/* Supporter name */}
          <div className="mb-10 relative z-10">
            <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] mb-3`}>Display Name</p>
            <h2 className="text-3xl md:text-4xl font-serif italic font-light text-[#1A1C1A]">
              {supporterName}
            </h2>
          </div>

          {/* Card footer row */}
          <div className="flex justify-between items-end border-t border-[#1A1C1A]/10 pt-7 relative z-10">
            <div>
              <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] mb-2`}>Role</p>
              <p className={`font-mono ${T.small} text-[#059669] tracking-widest font-bold`}>Orbit 77 Supporter</p>
            </div>
            <div className="text-right">
              <p className={`font-mono ${T.micro} uppercase tracking-[0.18em] text-[#6B8070] mb-2`}>Archive ID</p>
              <p className={`font-mono ${T.body} text-white bg-[#059669] px-4 py-1.5 rounded-md inline-block tracking-widest font-bold`}>{supporterNumber}</p>
            </div>
          </div>

          {/* Date */}
          <div className="mt-6 relative z-10 text-right">
            <p className={`font-mono ${T.micro} tracking-[0.18em] text-[#6B8070]/60 uppercase`}>{dateStr}</p>
          </div>
        </div>
      </motion.div>

      {/* Quote */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className={`relative z-10 mt-12 ${T.small} font-light italic text-[#6B8070] text-center max-w-sm leading-relaxed`}
      >
        &ldquo;The content exists. The distribution doesn&apos;t — yet. That&apos;s the only thing standing between Orbit 77 and scale.&rdquo;
      </motion.p>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="relative z-10 flex flex-wrap gap-3 justify-center mt-10 max-w-2xl px-4"
      >
        <button
          onClick={handleShare}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-mono ${T.small} uppercase tracking-[0.18em] font-bold transition-all bg-[#059669] text-white hover:bg-[#047857] shadow-[0_6px_18px_rgba(5,150,105,0.25)]`}
        >
          Share my credential
        </button>
        <Link href="/exhibitions/galaxy/orbit" className="w-full sm:w-auto">
          <button className={`w-full px-8 py-3.5 rounded-full font-mono ${T.small} uppercase tracking-[0.18em] font-bold transition-all border border-[#1A1C1A]/15 text-[#6B8070] hover:text-[#1A1C1A] hover:border-[#1A1C1A]/30 bg-white/40`}>
            Return to Orbit 77
          </button>
        </Link>
        <div className="w-full sm:w-auto relative">
          {supporterId ? (
            <Link href={`/archive/${supporterId}`} className="block w-full">
              <button className={`w-full px-8 py-3.5 rounded-full font-mono ${T.small} uppercase tracking-[0.18em] font-bold transition-all border border-[#059669]/40 text-[#059669] bg-white/40 hover:bg-[#059669]/10`}>
                View in Archive
              </button>
            </Link>
          ) : (
            <>
              <button disabled className={`w-full px-8 py-3.5 rounded-full font-mono ${T.small} uppercase tracking-[0.18em] font-bold border border-[#1A1C1A]/10 text-[#1A1C1A]/25 bg-transparent cursor-not-allowed`}>
                View in Archive
              </button>
              <span className={`absolute -top-3 right-1/2 translate-x-1/2 bg-[#EDEFED] border border-[#1A1C1A]/10 px-2 py-0.5 font-mono text-[10px] tracking-widest uppercase text-[#6B8070] rounded-full`}>Syncing…</span>
            </>
          )}
        </div>
      </motion.div>

      <p className={`relative z-10 font-mono text-[10px] tracking-[0.18em] text-[#6B8070]/50 mt-10 uppercase`}>
        Secured via Stripe. One-time payment. No subscription.
      </p>
    </main>
  );
}

export default function TransmissionConfirmed() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#EDEFED] flex items-center justify-center p-8 text-[#059669] font-mono text-sm uppercase tracking-widest animate-pulse">Confirming support…</main>}>
      <ConfirmationInner />
    </Suspense>
  );
}
