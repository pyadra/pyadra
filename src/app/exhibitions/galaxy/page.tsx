'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import GreenDust from '../../components/ui/GreenDust';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import { useZoomDoor } from '@/app/components/ui/useZoomDoor';
import { LOTS, SECTORS, type Lot, type WayIn } from './lots';
import { layoutOrbit, toPoint, RING } from './orbit';

/* ------------------------------------------------------------------ */
/*  PYADRA — GALAXY                                                    */
/*  The orbit as an instrument, and the zooms that go into it.         */
/*                                                                     */
/*  Zoom 1 — the orbit. Where a sphere sits says how you come in       */
/*           (angle) and how ready it is (ring). Read it, don't enter. */
/*  Zoom 2 — the lot. A click turns the sphere into its card, here,    */
/*           without leaving the page.                                 */
/*  Zoom 3 — the dossier. Only if they want more: the project's room.  */
/* ------------------------------------------------------------------ */

const ENTER = 0.75; // template.tsx dissolve ~1.5s — choreography starts after
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };

/* The lots and the instrument that places them live next door:
   lots.ts is the data (one row per project), orbit.ts the geometry. */
const { arcs: ARCS, placed: PLACED } = layoutOrbit(LOTS);

/* ---------- pieces ---------- */

const GemIcon = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-[#059669] drop-shadow-md">
    <polygon points="50 5, 95 27.5, 95 72.5, 50 95, 5 72.5, 5 27.5" fill="currentColor" opacity="0.8" />
    <polygon points="50 20, 75 35, 75 65, 50 80, 25 65, 25 35" fill="white" opacity="0.2" />
    <polygon points="50 5, 95 27.5, 50 50, 5 27.5" fill="white" opacity="0.4" />
    <polygon points="95 27.5, 95 72.5, 50 50" fill="black" opacity="0.1" />
    <polygon points="5 27.5, 5 72.5, 50 50" fill="white" opacity="0.1" />
  </svg>
);

/** Inline stand-in mark used until EterniCapsule has a real logo asset. */
const CapsuleMark = () => (
  <svg viewBox="0 0 40 60" className="w-full h-full">
    <rect x="10" y="6" width="20" height="48" rx="10" fill="none" stroke="#C9A961" strokeWidth="2.5" />
    <circle cx="20" cy="30" r="2.6" fill="#C9A961" />
  </svg>
);

function LogoSlot({ project }: { project: Lot }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute w-16 h-16 md:w-18 md:h-18 lg:w-22 lg:h-22 rounded-full bg-white/20 blur-sm" />
      {project.logo.kind === 'image' && (
        <Image
          src={project.logo.src}
          alt={project.name}
          width={80}
          height={80}
          className="relative w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 object-contain opacity-70 pointer-events-none select-none"
          draggable={false}
        />
      )}
      {project.logo.kind === 'inline-capsule' && (
        <div className="relative w-10 h-14 md:w-11 md:h-16 lg:w-12 lg:h-18 opacity-80 pointer-events-none">
          <CapsuleMark />
        </div>
      )}
      {/* No logo asset yet — the dashed ring the team index already uses for
          a project whose mark hasn't been made. */}
      {project.logo.kind === 'pending' && (
        <span className="relative w-10 h-10 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full border border-dashed border-[#1A1C1A]/25 pointer-events-none" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 rounded-full pointer-events-none" />
    </div>
  );
}

const SECTOR_LABEL = Object.fromEntries(SECTORS.map((s) => [s.key, s.label])) as Record<WayIn, string>;
const STAGE_LABEL: Record<Lot['stage'], string> = { ready: 'Ready', forming: 'Forming' };
const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
const COUNT = COUNT_WORDS[LOTS.length] ?? String(LOTS.length);

/** The sphere follows the cursor and opens its lot card (Zoom 2). */
function MagneticSphere({ children, onOpen, label }: { children: React.ReactNode; onOpen: () => void; label: string }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { damping: 15, stiffness: 150, mass: 0.1 });
  const mouseY = useSpring(y, { damping: 15, stiffness: 150, mass: 0.1 });

  const onMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) / 4);
    y.set((e.clientY - (rect.top + rect.height / 2)) / 4);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={label}
      onClick={onOpen}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: mouseX, y: mouseY }}
      whileTap={{ scale: 0.97 }}
      className="relative flex flex-col items-center justify-center group rounded-3xl cursor-pointer bg-transparent border-0 p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
    >
      {children}
    </motion.button>
  );
}

/** Where a sphere was opened from — the orbit (xl+) or the list below it.
 *  Both are in the page, one hidden, so each gets its own layoutId. */
type Origin = 'orbit' | 'list';

/** The sphere itself. Shares a layoutId with the one in the lot card, so
 *  opening a lot reads as the sphere growing into it. */
function Sphere({ lot, size, origin }: { lot: Lot; size: string; origin: Origin }) {
  return (
    <motion.div
      layoutId={`sphere-${origin}-${lot.id}`}
      className={`relative ${size} rounded-full ${lot.sphereClass} transition-[box-shadow] duration-500 group-hover:shadow-2xl overflow-hidden`}
    >
      <LogoSlot project={lot} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.2)_270deg,transparent_360deg)]"
      />
    </motion.div>
  );
}

/** One lot on the field: the five elements of Company_Master §7. */
function SphereCard({ lot, index, open, dim, origin, onOpen }: { lot: Lot; index: number; open: boolean; dim: boolean; origin: Origin; onOpen: () => void }) {
  return (
    <motion.div
      animate={{ opacity: dim ? 0.28 : 1 }}
      transition={{ duration: 0.4 }}
      className="w-[160px] sm:w-[200px]"
    >
      <MagneticSphere onOpen={onOpen} label={`${lot.name} — open its card`}>
        <span className="rounded-full bg-white/70 backdrop-blur-sm ring-1 ring-[#1A1C1A]/8 px-3 py-1 text-[10px] font-bold text-[#3A4A3E] mb-3">
          {lot.type} · {lot.kind}
        </span>

        {/* floats in place, each on its own rhythm, so the field breathes */}
        <motion.div
          className="relative mb-3"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 5 + index * 0.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.9 }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
            className={`absolute inset-0 rounded-full blur-xl ${lot.glow}`}
          />
          {open ? <div className="w-20 h-20 sm:w-24 sm:h-24" /> : <Sphere lot={lot} size="w-20 h-20 sm:w-24 sm:h-24" origin={origin} />}
        </motion.div>

        <h3 className="text-base sm:text-lg font-bold tracking-[-0.02em] text-center mb-1 transition-colors duration-300 group-hover:text-[#059669]">
          {lot.name}
        </h3>
        <div className="text-[12px] font-semibold text-[#3A4A3E] text-center leading-snug">{lot.subtitle}</div>
        <div className="text-[11px] font-medium text-[#6B8070] text-center mt-0.5 leading-snug">{lot.proof}</div>
        <div className="text-[11px] font-semibold text-[#059669] text-center mt-1 leading-snug">{lot.opportunity}</div>
      </MagneticSphere>
    </motion.div>
  );
}

/* ---------- Zoom 2 — the lot card ---------- */

function LotCard({ lot, origin, onClose, onEnter }: { lot: Lot; origin: Origin; onClose: () => void; onEnter: (from: Element | null) => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    // the orbit stays put behind the card
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const rows: [string, React.ReactNode][] = [
    ['How you come in', SECTOR_LABEL[lot.wayIn]],
    [
      'Where it stands',
      <span key="stage" className="inline-flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${lot.stage === 'ready' ? 'bg-[#059669]' : 'bg-[#6B8070]/50'}`} />
        {STAGE_LABEL[lot.stage]}
      </span>,
    ],
    ['Proof', lot.proof],
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-3 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button type="button" aria-label="Back to the orbit" onClick={onClose} className="absolute inset-0 bg-[#EDEFED]/70 backdrop-blur-sm cursor-default" />

      <motion.div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lot-title"
        initial={{ y: 24, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 24, scale: 0.97 }}
        transition={SPRING}
        className="relative w-full max-w-[560px] rounded-[32px] bg-white shadow-2xl shadow-[#1A1C1A]/10 ring-1 ring-[#1A1C1A]/5 p-6 md:p-8"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#EDEFED] text-[#3A4A3E] text-lg leading-none hover:bg-[#E2E6E2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
        >
          ×
        </button>

        <div className="flex items-center gap-5 mb-6">
          <Sphere lot={lot} size="w-24 h-24 md:w-28 md:h-28 shrink-0" origin={origin} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-2 pr-8">
              <span className="rounded-full bg-[#EDEFED] px-3 py-1 text-[10px] font-bold text-[#3A4A3E]">
                {lot.type} · {lot.kind}
              </span>
              <span className="rounded-full bg-[#059669]/10 px-3 py-1 text-[10px] font-bold text-[#047857]">
                {lot.opportunity}
              </span>
            </div>
            <h2 id="lot-title" className="text-2xl md:text-3xl font-bold tracking-[-0.03em] leading-tight">{lot.name}</h2>
            <p className="text-[14px] font-medium text-[#3A4A3E] mt-1 leading-snug">{lot.subtitle}</p>
          </div>
        </div>

        <dl className="grid gap-3 border-t border-[#1A1C1A]/8 pt-5">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[130px_1fr] gap-3 text-[13px]">
              <dt className="font-semibold text-[#6B8070]">{k}</dt>
              <dd className="font-medium text-[#1A1C1A]">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-7">
          {lot.enter_url ? (
            <button
              type="button"
              onClick={() => onEnter(cardRef.current)}
              className="cta-glow w-full sm:w-auto rounded-full bg-[#059669] text-white px-7 py-3 text-sm font-semibold shadow-lg shadow-[#059669]/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#047857] focus-visible:ring-offset-2"
            >
              Open the dossier →
            </button>
          ) : (
            <span className="block sm:inline-block text-center rounded-full bg-[#EDEFED] text-[#6B8070] px-7 py-3 text-sm font-semibold">Room opening soon</span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- the page ---------- */

const URL_EVENT = 'galaxy:url';

function subscribeUrl(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  window.addEventListener(URL_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(URL_EVENT, onChange);
  };
}

function setUrl(next: { way?: WayIn | null; lot?: string | null }) {
  const q = new URLSearchParams(window.location.search);
  for (const [k, v] of Object.entries(next)) {
    if (v) q.set(k, v);
    else q.delete(k);
  }
  const s = q.toString();
  window.history.replaceState(null, '', s ? `?${s}` : window.location.pathname);
  window.dispatchEvent(new Event(URL_EVENT));
}

export default function GalaxyExhibition() {
  const { zoomTo, overlay, zoomProps } = useZoomDoor();

  // The URL is the state: ?way= lights a sector (the Home's verbs land
  // here), ?lot= is the open card — so both survive a reload or a share.
  const search = useSyncExternalStore(subscribeUrl, () => window.location.search, () => '');
  const q = new URLSearchParams(search);
  const way = ARCS.find((a) => a.key === q.get('way'))?.key ?? null;
  const open = LOTS.find((l) => l.id === q.get('lot')) ?? null;
  const openId = open?.id ?? null;

  // the sector of the sphere under the cursor, so the orbit explains itself
  const [hovered, setHovered] = useState<WayIn | null>(null);
  const [origin, setOrigin] = useState<Origin>('orbit');

  const openLot = (id: string, from: Origin) => {
    setOrigin(from);
    setUrl({ lot: id });
  };
  const closeLot = useCallback(() => setUrl({ lot: null }), []);
  const pickWay = (w: WayIn | null) => setUrl({ way: w });

  // parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridX = useTransform(mouseX, (v) => v * 0.2);
  const gridY = useTransform(mouseY, (v) => v * 0.2);
  const ringsX = useTransform(mouseX, (v) => v * 0.5);
  const ringsY = useTransform(mouseY, (v) => v * 0.5);
  const gemX = useTransform(mouseX, (v) => -v * 0.3);
  const gemY = useTransform(mouseY, (v) => -v * 0.3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { innerWidth, innerHeight } = window;
    mouseX.set(((e.clientX - innerWidth / 2) / innerWidth) * 20);
    mouseY.set(((e.clientY - innerHeight / 2) / innerHeight) * 20);
  };

  const dim = (l: Lot) => way !== null && l.wayIn !== way;

  return (
    <>
    <motion.div
      {...zoomProps}
      className="min-h-[100svh] bg-[#EDEFED] text-[#1A1C1A] flex flex-col relative overflow-hidden antialiased selection:bg-[#059669] selection:text-white"
      onMouseMove={handleMouseMove}
    >

      {/* ambient vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#D4DDD6]/40 to-transparent" />
      </div>

      {/* blueprint grid with parallax */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.25]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4DDD6 1px, transparent 1px),
            linear-gradient(to bottom, #D4DDD6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          x: gridX,
          y: gridY,
        }}
      />

      {/* grain */}
      <div className="absolute inset-0 pointer-events-none z-0 mix-blend-multiply opacity-[0.4]">
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-60" preserveAspectRatio="none">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <GreenDust count={280} />

      {/* shared nav */}
      <SiteNav
        crumbs={[
          { label: 'Exhibitions', href: '/exhibitions' },
          { label: 'Galaxy' },
        ]}
        status={{ label: `${LOTS.length} projects`, live: true }}
      />

      {/* ============ HEADLINE ============ */}
      <div className="relative z-10 text-center px-6 pt-24 md:pt-24">
        <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] leading-[1.05]">
          {[`${COUNT} projects.`, 'Read the orbit.'].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ delay: ENTER + 0.15 + i * 0.09, type: 'spring', stiffness: 110, damping: 20 }}
              >
                {i === 1 ? <span className="text-[#059669]">{line}</span> : line}
              </motion.span>
            </span>
          ))}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ENTER + 0.45, ...SPRING }}
          className="text-[15px] md:text-base text-[#3A4A3E] font-medium mt-4 max-w-md mx-auto"
        >
          Where a project sits tells you how to come in. The closer to the centre, the readier it is.
        </motion.p>

        {/* the ways in — lights one sector, never hides the others */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ENTER + 0.6, ...SPRING }}
          className="mt-6 flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Light up a way in"
        >
          {[{ key: null, label: 'All' } as { key: WayIn | null; label: string }, ...ARCS].map((a) => {
            const on = way === a.key;
            return (
              <button
                key={a.label}
                type="button"
                aria-pressed={on}
                onClick={() => pickWay(a.key)}
                className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ring-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] ${
                  on ? 'bg-[#1A1C1A] text-white ring-[#1A1C1A]' : 'bg-white/70 text-[#3A4A3E] ring-[#1A1C1A]/10 hover:bg-white'
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* ============ ZOOM 1 — THE ORBIT ============ */}
      <main className="relative z-10 flex-1 w-full px-4 md:px-8 py-6 flex flex-col items-center justify-center">

        {/* xl+: the instrument. 1180 × 1160, spheres placed inside a
            FIELD-sized layer (orbit.ts) so no card ever leaves the page. */}
        <div className="hidden xl:block relative w-[1180px] h-[1160px]">
          <div className="absolute inset-x-[100px] inset-y-[120px]">

            {/* rings and sector spokes */}
            <motion.svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full overflow-visible pointer-events-none text-[#059669]"
              style={{ x: ringsX, y: ringsY }}
              aria-hidden
            >
              {Object.values(RING).map((r, i) => (
                <ellipse
                  key={r}
                  cx="50" cy="50" rx={50 * r} ry={50 * r}
                  fill="none" stroke="currentColor" strokeOpacity={0.22}
                  strokeDasharray={i === 0 ? '4 4' : '2 6'}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {ARCS.map((a) => {
                const p = toPoint(a.start, 1.08);
                return (
                  <line key={a.key} x1="50" y1="50" x2={p.x} y2={p.y} stroke="currentColor" strokeOpacity={0.12} vectorEffect="non-scaling-stroke" />
                );
              })}
            </motion.svg>

            {/* sector names, between the gem and the inner ring */}
            {ARCS.map((a) => {
              const p = toPoint((a.start + a.end) / 2, 0.34);
              const on = way === a.key || hovered === a.key;
              const n = PLACED.filter((x) => x.lot.wayIn === a.key).length;
              return (
                <span
                  key={a.key}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono uppercase text-[10px] tracking-[0.22em] transition-colors ${
                    on ? 'text-[#047857] font-bold' : 'text-[#6B8070]/80'
                  }`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  {a.label} <span className="opacity-60">· {n}</span>
                </span>
              );
            })}

            {/* central gem — the door to the museum shop */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 z-20"
              style={{ x: gemX, y: gemY }}
            >
              <GemLink />
            </motion.div>

            {/* the lots */}
            {PLACED.map((p, index) => (
              <motion.div
                key={p.lot.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
                onMouseEnter={() => setHovered(p.lot.wayIn)}
                onMouseLeave={() => setHovered(null)}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: ENTER + 0.5 + index * 0.08, type: 'spring', stiffness: 120, damping: 16 }}
              >
                <SphereCard lot={p.lot} index={index} open={openId === p.lot.id} dim={dim(p.lot)} origin="orbit" onOpen={() => openLot(p.lot.id, 'orbit')} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* below xl: the same order, read as a list of sectors */}
        <div className="xl:hidden w-full max-w-[760px] flex flex-col gap-8">
          <Link
            href="/store"
            className="self-center inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm ring-1 ring-[#1A1C1A]/8 shadow-sm px-4 py-2"
          >
            <span className="w-5 h-5 shrink-0"><GemIcon /></span>
            <span className="text-[12px] font-semibold text-[#1A1C1A]">The museum shop →</span>
          </Link>
          {ARCS.map((a) => {
            const lots = PLACED.filter((p) => p.lot.wayIn === a.key);
            if (!lots.length) return null;
            return (
              <section key={a.key} aria-label={a.label}>
                <h2 className={`text-center font-mono uppercase text-[11px] tracking-[0.22em] mb-4 ${way === a.key ? 'text-[#047857] font-bold' : 'text-[#6B8070]'}`}>
                  {a.label}
                </h2>
                <div className="grid grid-cols-2 justify-items-center gap-x-3 gap-y-8 sm:flex sm:flex-wrap sm:justify-center sm:gap-x-4">
                  {lots.map((p) => (
                    <div key={p.lot.id} className={lots.length === 1 ? 'col-span-2' : ''}>
                    <SphereCard
                      lot={p.lot}
                      index={PLACED.indexOf(p)}
                      open={openId === p.lot.id}
                      dim={dim(p.lot)}
                      origin="list"
                      onOpen={() => openLot(p.lot.id, 'list')}
                    />
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* ============ ZOOM 2 — THE LOT ============ */}
      <AnimatePresence>
        {open && (
          <LotCard
            key={open.id}
            lot={open}
            origin={origin}
            onClose={closeLot}
            onEnter={(from) => open.enter_url && zoomTo(from, open.enter_url)}
          />
        )}
      </AnimatePresence>

      <SiteFooter />
    </motion.div>

    {/* ============ ZOOM 3 — into the dossier ============ */}
    {overlay}
    </>
  );
}

function GemLink() {
  return (
    <Link href="/store" className="group relative block w-full h-full" aria-label="The museum shop">
      <motion.div
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="relative w-full h-full cursor-pointer"
      >
        <motion.div
          animate={{ opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-[#059669] blur-xl rounded-full"
        />
        <GemIcon />
      </motion.div>
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#1A1C1A] shadow-md ring-1 ring-[#1A1C1A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        The museum shop →
      </span>
    </Link>
  );
}
