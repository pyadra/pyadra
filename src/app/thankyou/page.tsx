"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

/* === Render dinámico (evita prerender) === */
export const dynamic = "force-dynamic";

/* === Fondo Neural === */
function NeuralBackground() {
  useEffect(() => {
    const canvas = document.getElementById("neural-thanks") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const N = 80, linkDist = 150;
    const ps = Array.from({ length: N }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
    }));

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(41,171,226,0.6)";
        ctx.fill();
      }
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i], b = ps[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDist) {
            const op = 1 - d / linkDist;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(41,171,226,${op * 0.2})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };
    tick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", setSize);
    };
  }, []);

  return <canvas id="neural-thanks" className="fixed inset-0 w-full h-full pointer-events-none opacity-30" />;
}

/* === Contenido real === */
function ThankYouInner() {
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
        const cents = Number(data?.amount_total);
        if (!Number.isNaN(cents)) setAmount(cents / 100);
      } catch {
        /* ignore */
      }
    })();
  }, [session_id]);

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0B1D26] text-white flex flex-col items-center justify-center">
      <NeuralBackground />

      {/* Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 0.5, 1], scale: [0.8, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmin] h-[60vmin] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(0,224,199,0.2), rgba(0,0,0,0))" }}
      />

      <div
        className="relative z-10 text-center max-w-xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 mx-4"
        style={{ boxShadow: "0 30px 80px rgba(41,171,226,0.25)" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-[#29ABE2] to-[#00E0C7] bg-clip-text text-transparent"
        >
          Thank you for contributing ✨
        </motion.h1>

        {amount !== null ? (
          <p className="text-white/70 mb-6 leading-relaxed">
            You contributed <span className="text-[#66FFB2] font-semibold">${amount.toFixed(2)}</span> to the collective flow.
          </p>
        ) : (
          <p className="text-white/60 mb-6">Your contribution nourishes our collective mind.</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/projects">
            <button
              className="px-6 py-3 rounded-xl font-semibold text-[#0B1D26]"
              style={{ background: "linear-gradient(90deg,#29ABE2 0%, #00E0C7 100%)", boxShadow: "0 0 24px rgba(41,171,226,0.45)" }}
            >
              Explore Projects
            </button>
          </Link>
          <Link href="/">
            <button className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition">
              Go Home
            </button>
          </Link>
        </div>

        <p className="text-xs text-white/50 mt-6">
          No card data touches Pyadra — Stripe handles all payments securely.
        </p>
      </div>
    </main>
  );
}

/* === Export con Suspense === */
export default function ThankYou() {
  return (
    <Suspense fallback={<main className="min-h-screen flex items-center justify-center p-8 text-white">Loading…</main>}>
      <ThankYouInner />
    </Suspense>
  );
}