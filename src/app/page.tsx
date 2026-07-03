'use client';

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTime,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';

/* ------------------------------------------------------------------ */
/*  PYADRA — HOME · The Threshold                                      */
/*                                                                     */
/*  The Pyadra symbol IS the home. It assembles, breathes, and can be  */
/*  met (click → gem and body encounter). The words orbit around it,   */
/*  not the other way around. One door leads to the exhibition.        */
/* ------------------------------------------------------------------ */

const CURTAIN_MS = 2000;         // every visit — the full ceremony
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

/* Fixed spark orbit params — no Math.random() (SSR/hydration safe). */
const SPARKS: { radius: number; speed: number; phase: number; size: number; opacity: number }[] = [
  { radius: 230, speed: 0.15,  phase: 0.0, size: 6, opacity: 0.55 },
  { radius: 265, speed: -0.10, phase: 1.5, size: 4, opacity: 0.45 },
  { radius: 205, speed: 0.13,  phase: 3.1, size: 5, opacity: 0.50 },
  { radius: 285, speed: -0.08, phase: 4.7, size: 4, opacity: 0.40 },
  { radius: 218, speed: 0.19,  phase: 2.4, size: 3, opacity: 0.60 },
  { radius: 250, speed: -0.14, phase: 5.6, size: 3, opacity: 0.35 },
];

/* One spark, endlessly orbiting the symbol. */
function OrbitingSpark({
  radius,
  speed,
  phase,
  size,
  opacity,
  reduced,
}: {
  radius: number;
  speed: number;
  phase: number;
  size: number;
  opacity: number;
  reduced: boolean;
}) {
  const time = useTime();
  const v = reduced ? 0 : speed;
  const x = useTransform(time, (t) => Math.cos(phase + (t / 1000) * v) * radius);
  const y = useTransform(time, (t) => Math.sin(phase + (t / 1000) * v) * radius * 0.6);

  return (
    <motion.div
      aria-hidden
      style={{ x, y, width: size, height: size, opacity }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#059669] shadow-[0_0_10px_rgba(5,150,105,0.7)] pointer-events-none"
    />
  );
}

/* ---- The Hero Symbol — custom SVG, click ALWAYS works ----
   Built directly here (not via PyadraLogo) so the encounter click
   isn't gated behind the intro completing. Same visual language:
   gem drops from y:-90, body rises from y:90, corner spark on
   intro; click → gem drops to +30, body rises to -24, spark bursts
   at their meeting point. */
const STROKE = '#059669';
const SW = 11;
const SYMBOL_SIZE = 260;

function HeroSymbol({ reduced }: { reduced: boolean }) {
  const router = useRouter();
  const [met, setMet] = useState(false);
  const height = Math.round((SYMBOL_SIZE * 232) / 240);

  useEffect(() => {
    router.prefetch('/exhibitions');
  }, [router]);

  // click → they meet (the shrink), then the door opens
  const enter = () => {
    if (met) return;
    setMet(true);
    setTimeout(() => router.push('/exhibitions'), reduced ? 150 : 950);
  };

  return (
    <div className="inline-flex flex-col items-center relative z-10">
      <motion.button
        type="button"
        onClick={enter}
        aria-label="Pyadra symbol — enter the exhibitions"
        className="cursor-pointer bg-transparent border-0 p-0 block"
        style={{ lineHeight: 0 }}
        whileHover={reduced ? undefined : { scale: 1.04 }}
        whileTap={reduced ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18 }}
      >
        <svg
          width={SYMBOL_SIZE}
          height={height}
          viewBox="0 0 240 232"
          overflow="visible"
          className="block h-auto"
          style={{ width: 'min(260px, 58vw)' }}
        >
          {/* GEM */}
          <motion.g
            initial={reduced ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
            animate={{ y: met ? 30 : 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 130, damping: 16, mass: 1 }}
          >
            <path
              d="M106,20 L134,20 L150,38 L150,72 L134,90 L106,90 L90,72 L90,38 Z"
              fill="none"
              stroke={STROKE}
              strokeWidth={SW}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Intro spark (top-right, next to the gem) */}
            <motion.path
              d="M168,16 L170.5,23.5 L178,26 L170.5,28.5 L168,36 L165.5,28.5 L158,26 L165.5,23.5 Z"
              fill={STROKE}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.3, 1], opacity: [0, 1, 0.85] }}
              transition={{ duration: 0.55, delay: reduced ? 0 : 1.0, ease: 'easeOut' }}
              style={{ transformOrigin: '168px 26px', transformBox: 'fill-box' }}
            />
          </motion.g>

          {/* BODY + SMILE */}
          <motion.g
            initial={reduced ? { y: 0, opacity: 1 } : { y: 90, opacity: 0 }}
            animate={{ y: met ? -24 : 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 130, damping: 16, mass: 1, delay: reduced ? 0 : 0.15 }}
          >
            <path
              d="M88,184 Q92,170 93,160 A27,44 0 0 1 147,160 Q148,170 152,184"
              fill="none"
              stroke={STROKE}
              strokeWidth={SW}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M70,196 Q120,214 170,196"
              fill="none"
              stroke={STROKE}
              strokeWidth={SW}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>

          {/* Meeting spark — bursts each time they meet */}
          <motion.path
            d="M120,124 L122.5,131.5 L130,134 L122.5,136.5 L120,144 L117.5,136.5 L110,134 L117.5,131.5 Z"
            fill={STROKE}
            initial={{ scale: 0, opacity: 0 }}
            animate={met ? { scale: [0, 1.8, 0], opacity: [0, 1, 0] } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ transformOrigin: '120px 134px', transformBox: 'fill-box' }}
          />
        </svg>
      </motion.button>

      {/* PYADRA word */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduced ? 0 : 1.3 }}
        className="font-serif font-semibold text-center text-[#1A1C1A]"
        style={{
          fontSize: 'clamp(34px, 15vw, 78px)',
          letterSpacing: '0.32em',
          textIndent: '0.32em',
          marginTop: 'clamp(30px, 13vw, 57px)',
        }}
      >
        PYADRA
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: reduced ? 0 : 1.45 }}
        className="font-mono uppercase text-center text-[#6B8070]"
        style={{
          fontSize: 'clamp(9px, 3.4vw, 19px)',
          letterSpacing: '0.3em',
          marginTop: 'clamp(12px, 5vw, 21px)',
        }}
      >
        DISCOVER. CONNECT. BUILD. BUY.
      </motion.div>
    </div>
  );
}

/* The logo showcase: halos + orbiting sparks + interactive symbol. */
function LogoShowcase({ reduced }: { reduced: boolean }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-4">
      {/* Halo 1 — wide, slow breath */}
      <motion.div
        aria-hidden
        animate={reduced ? undefined : { scale: [1, 1.18, 1], opacity: [0.35, 0.6, 0.35] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.18), transparent 65%)', filter: 'blur(20px)' }}
      />

      {/* Halo 2 — tighter, counter-phase */}
      <motion.div
        aria-hidden
        animate={reduced ? undefined : { scale: [1.15, 1, 1.15], opacity: [0.5, 0.25, 0.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.22), transparent 60%)', filter: 'blur(12px)' }}
      />

      {/* Orbiting sparks — atmosphere, not projects */}
      {SPARKS.map((s, i) => (
        <OrbitingSpark key={i} {...s} reduced={reduced} />
      ))}

      {/* THE SYMBOL — click always works. */}
      <HeroSymbol reduced={reduced} />
    </div>
  );
}

/* ---------- observer ticket — the admission stub (home only) ---------- */

function ObserverTicket({ id }: { id: string | null }) {
  if (!id) return null;
  return (
    <motion.aside
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.8 }}
      aria-label="Your observer ticket"
      className="fixed left-3.5 bottom-3.5 md:left-6 md:bottom-6 z-40 flex items-center gap-3 rounded-md border border-[#1A1C1A]/25 bg-[#EDEFED] px-3 py-2 md:px-3.5 md:py-2.5 shadow-[0_6px_18px_rgba(10,18,14,0.12)]"
    >
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#6B8070]">
          Observer №
        </span>
        <span className="font-mono text-[15px] font-medium text-[#1A1C1A]">{id}</span>
      </div>
      <span
        aria-hidden
        className="self-stretch w-px"
        style={{
          background:
            'repeating-linear-gradient(to bottom, rgba(26,28,26,0.35) 0 3px, transparent 3px 7px)',
        }}
      />
      <span
        className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#047857]"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        Admitted
      </span>
    </motion.aside>
  );
}

/* ---------- the page ---------- */

export default function PyadraHome() {
  const [curtainUp, setCurtainUp] = useState(false);
  const [observerId, setObserverId] = useState<string | null>(null);
  const reduced = useReducedMotion() ?? false;

  // Every visitor becomes a numbered Observer — Pyadra's quiet signature.
  // Returning visitors read their stored id; first-timers get registered,
  // and 'pyadra:observer' tells the footer the number arrived mid-session.
  useEffect(() => {
    const stored = window.localStorage.getItem('pyadra_observer_id');
    if (stored) {
      setObserverId(stored);
      return;
    }
    fetch('/api/observer')
      .then((r) => r.json())
      .then((data) => {
        const formatted = `#${String(data.id).padStart(4, '0')}`;
        window.localStorage.setItem('pyadra_observer_id', formatted);
        window.localStorage.setItem('pyadra_observer_num', String(data.id));
        setObserverId(formatted);
        window.dispatchEvent(new Event('pyadra:observer'));
      })
      .catch(() => {});
  }, []);

  // the curtain rises — three seconds of black, every visit
  useEffect(() => {
    const wait = reduced ? 250 : CURTAIN_MS;
    const t = setTimeout(() => setCurtainUp(true), wait);
    return () => clearTimeout(t);
  }, [reduced]);

  // museum spotlight follows cursor
  const spotXraw = useMotionValue(-600);
  const spotYraw = useMotionValue(-600);
  const spotX = useSpring(spotXraw, { stiffness: 80, damping: 20 });
  const spotY = useSpring(spotYraw, { stiffness: 80, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${spotX}px ${spotY}px, rgba(5,150,105,0.08), transparent 70%)`;

  const onHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotXraw.set(e.clientX - rect.left);
    spotYraw.set(e.clientY - rect.top);
  };

  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] overflow-x-clip antialiased selection:bg-[#059669] selection:text-white">

      {/* ============ THE CURTAIN — 3 seconds of black ============ */}
      <AnimatePresence>
        {!curtainUp && (
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[100] bg-[#0A120E] flex flex-col items-center justify-center"
          >
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(55% 45% at 50% 55%, rgba(5,150,105,0.14), transparent 70%)' }}
            />
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.42em' }}
              transition={{ duration: 0.9, delay: 0.4, ease: 'easeOut' }}
              className="relative text-[#EDEFED] text-lg md:text-2xl font-bold uppercase mb-6"
            >
              Pyadra
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-px w-40 md:w-56 bg-[#10B981] origin-center mb-6"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="relative font-serif italic text-[#EDEFED]/60 text-sm md:text-base"
            >
              Discover. Connect. Build. Buy.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* shared nav — home is the root, no breadcrumb */}
      <SiteNav />

      {/* the admission stub — home shows the ticket; elsewhere it lives in the footer */}
      {curtainUp && <ObserverTicket id={observerId} />}

      {/* ============ HERO — the symbol is the focus ============ */}
      <section
        onMouseMove={onHeroMove}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        {/* soft color field */}
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.10), transparent 65%)' }}
          />
          <div
            className="absolute -bottom-56 -right-32 w-[760px] h-[760px] rounded-full opacity-60"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10), transparent 65%)' }}
          />
        </div>

        {/* museum spotlight follows the cursor */}
        <motion.div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: spotlight }} />

        {/* ---- the composition ---- */}
        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 flex flex-col items-center text-center gap-8 md:gap-10 py-24">

          {/* THE LOGO — mounted only after the curtain lifts, so intro
              plays as black slides away. Symbol + PYADRA + tagline.
              Nothing else competes with it. */}
          <div className="relative w-full flex items-center justify-center min-h-[380px]">
            {curtainUp && <LogoShowcase reduced={reduced} />}
          </div>

          {/* THE ONE DOOR */}
          {curtainUp && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, ...SPRING }}
            >
              <Link
                href="/exhibitions"
                className="cta-glow group relative block rounded-full bg-[#1A1C1A] text-white px-12 py-4 t-d5 font-semibold shadow-lg shadow-[#1A1C1A]/20 overflow-hidden"
              >
                {/* emerald bloom seeps in from below on hover */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(80% 120% at 50% 130%, rgba(5,150,105,0.55), transparent 70%)' }}
                />
                <span className="relative">Join</span>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
