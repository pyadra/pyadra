'use client';

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import PyadraLogo from '@/app/components/brand/PyadraLogo';

/* ------------------------------------------------------------------ */
/*  PYADRA — HOME · The Museum Entrance                                */
/*                                                                     */
/*  The theater of the museum:                                         */
/*  1. THE CURTAIN — a ceremonial dark curtain lifts on arrival.       */
/*  2. THE ORBIT — the collection (spheres, the card, proof chips)     */
/*     orbits the headline like a planetary system, with cursor        */
/*     parallax on top. Every object is real and clickable.            */
/*  3. THE SPOTLIGHT — a museum light follows the cursor.              */
/*  4. THE SOUL — the dark card expands to full-bleed as you scroll.   */
/*                                                                     */
/*  Source of truth: Company_Master.md — "Pyadra is where projects     */
/*  and ideas find the people who make them real."                     */
/* ------------------------------------------------------------------ */

/* The global template.tsx dissolve blurs the first ~1.2s, so the curtain
   holds until 2.0s (crisp window after the dissolve), then lifts. */
const ENTER = 2.2;
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

const pop = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-70px' },
  transition: SPRING,
};

const MODES = [
  {
    num: '01',
    title: 'Money',
    verb: 'Back it.',
    body: 'Contribute capital and own a percentage of a real, documented project — proof first, always.',
  },
  {
    num: '02',
    title: 'Work',
    verb: 'Build it.',
    body: 'Your time and execution are capital. Operate, produce, grow — and earn real participation.',
  },
  {
    num: '03',
    title: 'Skills',
    verb: 'Shape it.',
    body: 'Design, legal, sales, tech, connections — bring the expertise a project needs to take off.',
  },
];

const PROJECTS = [
  {
    name: 'Kangaroo Cleanup',
    kind: 'Local · Service business',
    line: 'A Sydney cleanup business with a 5.0 reputation — for sale to the right operator.',
    valuation: '$15,000',
    available: '95%',
    href: '/exhibitions/galaxy/kangaroo-cleanup',
    sphere: 'bg-[radial-gradient(circle_at_30%_30%,#10B981,#059669,#047857)]',
    glow: 'bg-[#059669]',
  },
  {
    name: 'Orbit 77',
    kind: 'Glocal · Podcast',
    line: 'A podcast recorded from Australia exploring life, creation and identity.',
    valuation: '$12,000',
    available: '49%',
    href: '/exhibitions/galaxy/orbit',
    sphere: 'bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#E8E9E8,#C8C9C8)]',
    glow: 'bg-[#6B8070]',
  },
  {
    name: 'EterniCapsule',
    kind: 'Global · Digital vault',
    line: 'A vault for words you can’t say today. Seal them — choose when they open.',
    valuation: '$4,000',
    available: '100%',
    href: '/exhibitions/galaxy/ethernicapsule',
    sphere: 'bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#D4DDD6,#A0A0A0)]',
    glow: 'bg-white',
  },
  {
    name: 'Figuitoon',
    kind: 'Glocal · Physical product',
    line: 'A collectible version of yourself — AI-designed, 3D printed, shipped to you.',
    valuation: '$5,000',
    available: '100%',
    href: '/exhibitions/galaxy/figurines',
    sphere: 'bg-[radial-gradient(circle_at_30%_30%,#3A4A3E,#1A1C1A,#050A07)]',
    glow: 'bg-[#3A4A3E]',
  },
];

const PROMISE = [
  {
    num: '01',
    title: 'We document',
    body: 'Every project becomes a complete dossier — its story, its assets, its numbers, and its risks. Nothing under the table.',
  },
  {
    num: '02',
    title: 'We verify',
    body: 'Public proof comes first. Reviews, metrics and channels you can check yourself — nothing on Pyadra asks to be believed.',
  },
  {
    num: '03',
    title: 'You decide',
    body: 'Experience it, participate, or own it. Deals close between people in conversation — never through a checkout.',
  },
];

/* ---------- the planetary system ---------- */

function Sphere({ className, glow }: { className: string; glow: string }) {
  return (
    <div className="relative w-full h-full">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.3, 0.12] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-0 rounded-full blur-xl ${glow}`}
      />
      <div className={`relative w-full h-full rounded-full ${className} shadow-[-8px_10px_22px_rgba(0,0,0,0.18)] overflow-hidden`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.25)_270deg,transparent_360deg)]"
        />
      </div>
    </div>
  );
}

function ProofChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-white px-4 py-2.5 text-[12px] font-bold tracking-tight shadow-lg shadow-[#1A1C1A]/8 ring-1 ring-[#1A1C1A]/5 whitespace-nowrap">
      {children}
    </span>
  );
}

/* An object in orbit around the entrance — real, clickable, alive. */
function Orbiter({
  mx,
  my,
  fx,
  radius,
  speed,
  phase,
  rscale,
  href,
  className = '',
  children,
}: {
  mx: MotionValue<number>;
  my: MotionValue<number>;
  fx: number; // cursor-parallax factor
  radius: number; // orbit radius (px at full scale)
  speed: number; // radians per second (negative = counter-orbit)
  phase: number; // starting angle
  rscale: number; // responsive radius scale
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const time = useTime();
  const v = reduced ? 0 : speed;

  const orbitX = useTransform(time, (t) => Math.cos(phase + (t / 1000) * v) * radius * rscale);
  const orbitY = useTransform(time, (t) => Math.sin(phase + (t / 1000) * v) * radius * rscale * 0.6);
  const px = useSpring(useTransform(mx, (m) => m * fx), { stiffness: 50, damping: 18 });
  const py = useSpring(useTransform(my, (m) => m * fx), { stiffness: 50, damping: 18 });

  return (
    <motion.div style={{ x: px, y: py }} className={`absolute left-1/2 top-1/2 z-10 ${className}`}>
      <motion.div style={{ x: orbitX, y: orbitY }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: ENTER + 0.8 + phase * 0.08, type: 'spring', stiffness: 110, damping: 15 }}
          className="-translate-x-1/2 -translate-y-1/2"
        >
          <Link href={href} className="block">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 1.5 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {children}
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- the page ---------- */

export default function PyadraHome() {
  const [observerId, setObserverId] = useState<string | null>(null);
  const [curtainUp, setCurtainUp] = useState(false);
  const [rscale, setRscale] = useState(1);
  const reduced = useReducedMotion();

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

  // the curtain rises
  useEffect(() => {
    const t = setTimeout(() => setCurtainUp(true), reduced ? 250 : 2000);
    return () => clearTimeout(t);
  }, [reduced]);

  // responsive orbit radius
  useEffect(() => {
    const set = () => setRscale(Math.min(Math.max(window.innerWidth / 1440, 0.42), 1));
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);

  // cursor parallax + museum spotlight
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spotXraw = useMotionValue(-600);
  const spotYraw = useMotionValue(-600);
  const spotX = useSpring(spotXraw, { stiffness: 80, damping: 20 });
  const spotY = useSpring(spotYraw, { stiffness: 80, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${spotX}px ${spotY}px, rgba(5,150,105,0.08), transparent 70%)`;

  const onHeroMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    mx.set(((e.clientX - innerWidth / 2) / innerWidth) * 26);
    my.set(((e.clientY - innerHeight / 2) / innerHeight) * 26);
    const rect = e.currentTarget.getBoundingClientRect();
    spotXraw.set(e.clientX - rect.left);
    spotYraw.set(e.clientY - rect.top);
  };

  // hero recedes as you scroll deeper into the museum
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroP } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroTextY = useTransform(heroP, [0, 1], [0, -90]);
  const heroFade = useTransform(heroP, [0, 0.65], [1, 0]);
  const orbitScale = useTransform(heroP, [0, 1], [1, 0.9]);

  // the soul card swallows the screen
  const soulRef = useRef<HTMLElement>(null);
  const { scrollYProgress: soulP } = useScroll({ target: soulRef, offset: ['start 0.95', 'start 0.35'] });
  const [sideGap, setSideGap] = useState(140);
  useEffect(() => {
    const set = () => setSideGap(Math.max((window.innerWidth - Math.min(window.innerWidth - 48, 1104)) / 2, 12));
    set();
    window.addEventListener('resize', set);
    return () => window.removeEventListener('resize', set);
  }, []);
  const soulInset = useTransform(soulP, [0, 1], [sideGap, 0]);
  const soulRadius = useTransform(soulP, [0, 1], [36, 0]);
  const soulClip = useMotionTemplate`inset(0px ${soulInset}px round ${soulRadius}px)`;

  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] overflow-x-clip antialiased selection:bg-[#059669] selection:text-white">

      {/* shimmer keyframes */}
      <style>{`@keyframes py-shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }`}</style>

      {/* ============ THE CURTAIN ============ */}
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

      {/* floating pill nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ENTER, ...SPRING }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
      >
        <div className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg shadow-[#1A1C1A]/5 ring-1 ring-[#1A1C1A]/5 pl-5 pr-1.5 py-1.5">
          <span className="flex items-center gap-2 mr-2">
            <PyadraLogo size={22} interactive />
            <span className="text-sm font-bold tracking-tight">Pyadra</span>
          </span>
          <Link
            href="/exhibitions"
            className="hidden sm:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#3A4A3E] hover:bg-[#EDEFED] transition-colors"
          >
            Exhibitions
          </Link>
          <Link
            href="/exhibitions/galaxy"
            className="hidden md:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#3A4A3E] hover:bg-[#EDEFED] transition-colors"
          >
            Galaxy
          </Link>
          <Link
            href="/store"
            className="hidden md:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#3A4A3E] hover:bg-[#EDEFED] transition-colors"
          >
            Store
          </Link>
          {observerId && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#059669]/10 text-[#047857] px-3.5 py-2 text-[12px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
              Observer № {observerId.replace('#', '')}
            </span>
          )}
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 17 }}
          >
            <Link
              href="/exhibitions"
              className="block rounded-full bg-[#1A1C1A] text-white px-5 py-2 text-[13px] font-semibold"
            >
              Enter
            </Link>
          </motion.span>
        </div>
      </motion.nav>

      {/* ============ HERO — the collection in orbit ============ */}
      <section
        ref={heroRef}
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

        {/* the museum spotlight follows you */}
        <motion.div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: spotlight }} />

        {/* faint orbit traces */}
        <motion.div
          aria-hidden
          style={{ opacity: heroFade }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          {[380, 460, 545].map((r) => (
            <div
              key={r}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#059669]/8"
              style={{ width: r * 2 * rscale, height: r * 2 * rscale * 0.6 }}
            />
          ))}
        </motion.div>

        {/* ---- the orbiting collection ---- */}
        <motion.div style={{ scale: orbitScale, opacity: heroFade }} className="absolute inset-0">
          {/* Kangaroo sphere */}
          <Orbiter mx={mx} my={my} fx={0.7} radius={460} speed={0.05} phase={3.6} rscale={rscale} href="/exhibitions/galaxy/kangaroo-cleanup">
            <div className="w-14 h-14 md:w-20 md:h-20">
              <Sphere className="bg-[radial-gradient(circle_at_30%_30%,#10B981,#059669,#047857)]" glow="bg-[#059669]" />
            </div>
          </Orbiter>

          {/* the business card — a real artifact in orbit */}
          <Orbiter mx={mx} my={my} fx={1.1} radius={545} speed={-0.035} phase={2.2} rscale={rscale} href="/exhibitions/galaxy/kangaroo-cleanup" className="hidden md:block">
            <Image
              src="/images/kangaroo/kangaroo_card.png"
              alt="Kangaroo Cleanup business card"
              width={400}
              height={400}
              className="w-40 lg:w-44 h-auto rounded-2xl shadow-[0_24px_48px_-16px_rgba(10,18,14,0.45)] ring-1 ring-[#1A1C1A]/10 -rotate-6"
            />
          </Orbiter>

          {/* proof chips — verifiable, not decorative */}
          <Orbiter mx={mx} my={my} fx={0.45} radius={500} speed={0.06} phase={5.1} rscale={rscale} href="/exhibitions/galaxy/kangaroo-cleanup" className="hidden lg:block">
            <ProofChip>5.0 ★ · 213 reviews</ProofChip>
          </Orbiter>

          {/* EterniCapsule sphere */}
          <Orbiter mx={mx} my={my} fx={0.5} radius={395} speed={-0.07} phase={0.6} rscale={rscale} href="/exhibitions/galaxy/ethernicapsule">
            <div className="w-12 h-12 md:w-16 md:h-16">
              <Sphere className="bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#D4DDD6,#A0A0A0)]" glow="bg-white" />
            </div>
          </Orbiter>

          <Orbiter mx={mx} my={my} fx={0.85} radius={555} speed={0.045} phase={0.0} rscale={rscale} href="/exhibitions/galaxy/ethernicapsule" className="hidden lg:block">
            <ProofChip>$9 per capsule · live</ProofChip>
          </Orbiter>

          {/* Orbit 77 sphere */}
          <Orbiter mx={mx} my={my} fx={0.75} radius={470} speed={0.055} phase={1.3} rscale={rscale} href="/exhibitions/galaxy/orbit">
            <div className="relative w-16 h-16 md:w-24 md:h-24">
              <Sphere className="bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#E8E9E8,#C8C9C8)]" glow="bg-[#6B8070]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/orbit-logo.png" alt="Orbit 77" className="w-3/5 h-3/5 object-contain opacity-70" />
              </div>
            </div>
          </Orbiter>

          <Orbiter mx={mx} my={my} fx={0.4} radius={415} speed={-0.065} phase={4.3} rscale={rscale} href="/exhibitions/galaxy/orbit" className="hidden md:block">
            <ProofChip>10 episodes live</ProofChip>
          </Orbiter>

          {/* Figuitoon sphere */}
          <Orbiter mx={mx} my={my} fx={0.6} radius={350} speed={0.08} phase={2.9} rscale={rscale} href="/exhibitions/galaxy/figurines" className="hidden md:block">
            <div className="w-10 h-10 md:w-12 md:h-12">
              <Sphere className="bg-[radial-gradient(circle_at_30%_30%,#3A4A3E,#1A1C1A,#050A07)]" glow="bg-[#3A4A3E]" />
            </div>
          </Orbiter>
        </motion.div>

        {/* ---- the words ---- */}
        <motion.div
          style={{ y: heroTextY, opacity: heroFade }}
          className="relative z-20 text-center px-6 max-w-3xl mx-auto pointer-events-none"
        >
          <motion.span
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: ENTER + 0.1, ...SPRING }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 text-[12px] font-semibold mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            A museum of living projects
          </motion.span>

          <h1 className="text-4xl md:text-7xl lg:text-[5.2rem] font-bold tracking-[-0.035em] leading-[1.08] md:leading-[1.0] mb-8">
            {['Where ideas find', 'the people who', 'make them real.'].map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ delay: ENTER + 0.2 + i * 0.09, type: 'spring', stiffness: 110, damping: 20 }}
                >
                  {i === 2 ? (
                    <span
                      className="text-transparent bg-clip-text"
                      style={{
                        backgroundImage: 'linear-gradient(100deg, #059669 0%, #047857 25%, #34D399 50%, #059669 75%)',
                        backgroundSize: '220% 100%',
                        animation: reduced ? undefined : 'py-shimmer 7s linear infinite',
                      }}
                    >
                      {line}
                    </span>
                  ) : (
                    line
                  )}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 0.55, ...SPRING }}
            className="text-lg md:text-xl text-[#3A4A3E] font-medium leading-relaxed max-w-lg mx-auto mb-10"
          >
            Real projects, documented and verified. Contribute money, work
            or skills — and own part of something that matters.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 0.7, ...SPRING }}
            className="pointer-events-auto flex items-center justify-center gap-3 flex-wrap"
          >
            <motion.span whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 350, damping: 17 }}>
              <Link
                href="/exhibitions"
                className="block rounded-full bg-[#059669] text-white px-8 py-4 text-sm font-semibold shadow-lg shadow-[#059669]/25"
              >
                Enter the museum →
              </Link>
            </motion.span>
            <motion.span whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 350, damping: 17 }}>
              <Link
                href="/exhibitions/galaxy"
                className="block rounded-full bg-white text-[#1A1C1A] px-8 py-4 text-sm font-semibold ring-1 ring-[#1A1C1A]/10 shadow-sm"
              >
                Meet the projects
              </Link>
            </motion.span>
          </motion.div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: ENTER + 1.8 }}
          style={{ opacity: heroFade }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="block text-[12px] font-semibold text-[#6B8070]"
          >
            ↓
          </motion.span>
        </motion.div>
      </section>

      {/* ============ THE THREE WAYS IN ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 max-w-2xl">
          You don&rsquo;t need to be an investor.
          <span className="text-[#059669]"> You need something to contribute.</span>
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] font-medium max-w-md mb-14">
          Every project defines how you can participate — with money, work, or skills. Or all three.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {MODES.map((mode, i) => (
            <motion.div
              key={mode.num}
              {...pop}
              transition={{ ...SPRING, delay: i * 0.08 }}
              whileHover={{ y: -5 }}
              className="group rounded-[28px] bg-white p-8 md:p-10 shadow-sm ring-1 ring-[#1A1C1A]/5 hover:shadow-xl hover:shadow-[#059669]/5 transition-shadow duration-300"
            >
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-2xl bg-[#059669]/10 text-[#047857] text-[13px] font-bold mb-6 group-hover:bg-[#059669] group-hover:text-white transition-colors duration-300">
                {mode.num}
              </span>
              <h3 className="text-2xl font-bold tracking-tight mb-1">{mode.title}</h3>
              <p className="text-[15px] font-semibold text-[#059669] mb-3">{mode.verb}</p>
              <p className="text-[15px] text-[#3A4A3E] leading-relaxed">{mode.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ THE LIVING PROJECTS ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 max-w-2xl">
          Four projects.
          <span className="text-[#059669]"> All real. All open.</span>
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] font-medium max-w-md mb-14">
          Built and documented inside Pyadra. Tap one to meet it.
        </motion.p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.name}
              {...pop}
              transition={{ ...SPRING, delay: i * 0.07 }}
              whileHover={{ y: -6 }}
              className="h-full"
            >
              <Link
                href={project.href}
                className="group flex flex-col h-full rounded-[28px] bg-white p-7 shadow-sm ring-1 ring-[#1A1C1A]/5 hover:shadow-xl hover:shadow-[#059669]/8 transition-shadow duration-300"
              >
                <div className="relative w-14 h-14 mb-6">
                  <Sphere className={project.sphere} glow={project.glow} />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-1 group-hover:text-[#059669] transition-colors">
                  {project.name}
                </h3>
                <p className="text-[12px] font-semibold text-[#6B8070] mb-3">{project.kind}</p>
                <p className="text-[14px] text-[#3A4A3E] leading-relaxed mb-6 flex-1">{project.line}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold">
                    {project.valuation} <span className="text-[#6B8070] font-medium">AUD</span>
                  </span>
                  <span className="text-[13px] font-bold text-[#059669]">
                    {project.available} <span className="transition-transform duration-300 inline-block group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ THE SOUL — it swallows the screen as you arrive ============ */}
      <section ref={soulRef} className="py-24 md:py-32">
        <motion.div
          style={{ clipPath: soulClip }}
          className="relative left-1/2 -translate-x-1/2 w-screen bg-[#1A1C1A] text-white overflow-hidden"
        >
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(55% 60% at 50% 100%, rgba(5,150,105,0.18), transparent 70%)' }}
          />
          <div className="relative max-w-3xl mx-auto px-6 py-20 md:py-32 text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...SPRING, delay: 0.1 }}
              className="inline-block rounded-full bg-white/10 px-4 py-2 text-[12px] font-semibold text-white/70 mb-10"
            >
              Lo que dejas importa
            </motion.span>

            <motion.h2 {...pop} className="font-serif italic font-light text-4xl md:text-6xl leading-tight max-w-2xl mx-auto mb-10">
              What you leave behind
              <span className="text-[#10B981] not-italic"> matters.</span>
            </motion.h2>

            <motion.p {...pop} className="text-[15px] md:text-base text-white/60 leading-relaxed max-w-md mx-auto">
              Pyadra was born from a chess game — the belief that every pawn
              can become a queen. The path is what we build together.
            </motion.p>
          </div>
        </motion.div>
      </section>

      {/* ============ THE PROMISE ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 max-w-2xl">
          A museum,
          <span className="text-[#059669]"> not a marketplace.</span>
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] font-medium max-w-md mb-14">
          Three things make Pyadra different — and none of them is technology.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {PROMISE.map((step, i) => (
            <motion.div
              key={step.num}
              {...pop}
              transition={{ ...SPRING, delay: i * 0.08 }}
              className="rounded-[28px] bg-white p-8 md:p-10 shadow-sm ring-1 ring-[#1A1C1A]/5"
            >
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-2xl bg-[#059669]/10 text-[#047857] text-[13px] font-bold mb-6">
                {step.num}
              </span>
              <h3 className="text-xl font-bold tracking-tight mb-2.5">{step.title}</h3>
              <p className="text-[15px] text-[#3A4A3E] leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ FINAL ============ */}
      <section className="relative max-w-6xl mx-auto px-6 py-28 md:py-40 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[420px] pointer-events-none"
          style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(5,150,105,0.10), transparent 70%)' }}
        />
        <motion.h2 {...pop} className="relative text-5xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.02] mb-7">
          The museum is open.
        </motion.h2>
        <motion.p {...pop} className="relative text-lg md:text-xl text-[#3A4A3E] font-medium max-w-md mx-auto mb-10">
          Three rooms. One open. Four living projects inside —
          and one of them might be yours.
        </motion.p>
        <motion.div {...pop} className="relative flex items-center justify-center gap-3 flex-wrap">
          <motion.span whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 350, damping: 17 }}>
            <Link
              href="/exhibitions"
              className="block rounded-full bg-[#059669] text-white px-9 py-4 text-sm font-semibold shadow-lg shadow-[#059669]/25"
            >
              Enter the museum →
            </Link>
          </motion.span>
          <motion.span whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.96 }} transition={{ type: 'spring', stiffness: 350, damping: 17 }}>
            <a
              href="/manifesto"
              className="block rounded-full bg-white text-[#1A1C1A] px-9 py-4 text-sm font-semibold ring-1 ring-[#1A1C1A]/10 shadow-sm"
            >
              Read the manifesto
            </a>
          </motion.span>
        </motion.div>
        {observerId && (
          <motion.p {...pop} className="relative text-[12px] font-semibold text-[#6B8070] mt-10">
            You are Observer № {observerId.replace('#', '')} — welcome back anytime.
          </motion.p>
        )}
      </section>

      {/* footer */}
      <footer className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex items-center justify-between flex-wrap gap-4 border-t border-[#1A1C1A]/8 pt-7">
          <span className="text-[12px] font-medium text-[#6B8070]">
            © 2026 Pyadra · We document. We verify. You decide.
          </span>
          <div className="flex gap-5">
            <a href="/manifesto" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">
              Manifesto
            </a>
            <a href="/legal/terms" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">
              Terms
            </a>
            <a href="/legal/privacy" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
