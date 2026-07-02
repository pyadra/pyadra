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

const CURTAIN_MS = 3000;         // first visit — the full ceremony
const CURTAIN_RETURN_MS = 700;   // returning Observers get a short beat, not the wait
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
  const [met, setMet] = useState(false);
  const height = Math.round((SYMBOL_SIZE * 232) / 240);

  return (
    <div className="inline-flex flex-col items-center relative z-10">
      <button
        type="button"
        onClick={() => setMet((m) => !m)}
        aria-label="Pyadra symbol — tap to see them meet"
        className="cursor-pointer bg-transparent border-0 p-0 block"
        style={{ lineHeight: 0 }}
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
      </button>

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
          fontSize: 'clamp(10px, 4.4vw, 22px)',
          letterSpacing: '0.34em',
          marginTop: 'clamp(12px, 5vw, 21px)',
        }}
      >
        LO QUE DEJAS IMPORTA
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

      {/* Micro-hint (fades in after the intro settles) */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ delay: reduced ? 0 : 1.6, duration: 0.9 }}
        className="relative z-10 mt-4 t-d6 text-[#3A4A3E]"
      >
        tap the symbol — see them meet
      </motion.p>
    </div>
  );
}

/* ---------- the page ---------- */

export default function PyadraHome() {
  const [observerId, setObserverId] = useState<string | null>(null);
  const [curtainUp, setCurtainUp] = useState(false);
  const reduced = useReducedMotion() ?? false;

  // Every visitor becomes a numbered Observer — Pyadra's quiet signature.
  useEffect(() => {
    const localId = window.localStorage.getItem('pyadra_observer_id');
    if (localId) {
      setObserverId(localId);
      return;
    }
    fetch('/api/observer')
      .then((r) => r.json())
      .then((data) => {
        const formatted = `#${String(data.id).padStart(4, '0')}`;
        window.localStorage.setItem('pyadra_observer_id', formatted);
        window.localStorage.setItem('pyadra_observer_num', String(data.id));
        setObserverId(formatted);
      })
      .catch(() => setObserverId(null));
  }, []);

  // the curtain rises — full ceremony on first visit, a short beat after that
  useEffect(() => {
    const returning = !!window.localStorage.getItem('pyadra_observer_id');
    const wait = reduced ? 250 : returning ? CURTAIN_RETURN_MS : CURTAIN_MS;
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
              Lo que dejas importa
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* shared nav — home is the root, no breadcrumb */}
      <SiteNav />

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

          {/* badge — D6 micro-label */}
          {curtainUp && (
            <motion.span
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3, ...SPRING }}
              className="inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 t-d6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              A living collection
            </motion.span>
          )}

          {/* THE LOGO — mounted only after the curtain lifts, so intro
              plays as black slides away. The star of the page. */}
          <div className="relative w-full flex items-center justify-center min-h-[380px]">
            {curtainUp && <LogoShowcase reduced={reduced} />}
          </div>

          {/* THE WORDS — supporting, not competing. Mounted with the
              curtain, so the choreography works at any curtain length. */}
          {curtainUp && (
          <div className="flex flex-col items-center gap-5 max-w-xl">
            {/* D2 headline — DM Sans 700 */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, ...SPRING }}
              className="t-d2 text-[#1A1C1A]"
            >
              A startup museum for projects, products,{' '}
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(100deg, #059669 0%, #047857 25%, #34D399 50%, #059669 75%)',
                  backgroundSize: '220% 100%',
                  animation: reduced ? undefined : 'py-shimmer 7s linear infinite',
                }}
              >
                and people.
              </span>
            </motion.h1>

            {/* D4 body */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, ...SPRING }}
              className="t-d4 text-[#3A4A3E]"
            >
              A place to discover, support, and grow what strangers are building.
            </motion.p>

            {/* D5 italic — the one place serif italic reads well */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, ...SPRING }}
              className="t-d5 font-serif italic text-[#3A4A3E]/70"
            >
              No one stays a stranger once you meet them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, ...SPRING }}
              className="mt-2"
            >
              <motion.span
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 350, damping: 17 }}
              >
                <Link
                  href="/exhibitions"
                  className="block rounded-full bg-[#1A1C1A] text-white px-9 py-4 t-d5 font-semibold shadow-lg shadow-[#1A1C1A]/20"
                >
                  Enter the exhibition →
                </Link>
              </motion.span>
            </motion.div>

            {/* discovery — one quiet line: what's inside, right now */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.45, duration: 0.8 }}
              className="mt-4"
            >
              <Link
                href="/exhibitions/galaxy"
                className="t-d6 text-[#6B8070] hover:text-[#059669] transition-colors"
              >
                On exhibition now — Orbit 77 · EterniCapsule · Figuitoon · Kangaroo Cleanup
              </Link>
            </motion.div>
          </div>
          )}
        </div>
      </section>

      <SiteFooter />

      {/* shimmer keyframes for the "and people" accent */}
      <style>{`@keyframes py-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>
    </div>
  );
}
