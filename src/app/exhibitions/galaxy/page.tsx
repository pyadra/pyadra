'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import GreenDust from '../../components/ui/GreenDust';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import { useZoomDoor } from '@/app/components/ui/useZoomDoor';
import { TYPE } from '@/app/components/ui/type';
import BringIdeaDialog, { type DialogCopy } from '@/app/components/nav/BringIdeaDialog';
import Guide from '@/app/components/guide/Guide';
import { INTENTS, useIntent, type Intent } from '@/app/components/guide/intent';
import { LOTS, type Lot, type LotSheet, type WayIn } from './lots';
import { layoutOrbit, toPoint, RING, FIELD } from './orbit';

/* ------------------------------------------------------------------ */
/*  PYADRA — GALAXY                                                    */
/*  The orbit as an instrument — one screen, one camera.               */
/*                                                                     */
/*  The orbit — every project at once, as a sphere and a name. Where   */
/*           it sits says how you come in (angle) and how ready it is  */
/*           (ring). Hover a sphere to preview it.                     */
/*  The lot  — a click flies the camera to the sphere and opens its    */
/*           panel beside it, on the same page (?lot=). ← → walk the   */
/*           orbit from there; Esc or the field steps back out.        */
/*  The room — "Open the dossier" zooms into the project's page.       */
/*                                                                     */
/*  One idea per glance: the canvas never shows more than names until  */
/*  the visitor asks for more.                                         */
/* ------------------------------------------------------------------ */

const { arcs: ARCS, placed: PLACED } = layoutOrbit(LOTS);

/** The layer the spheres sit in, as a share of the stage (keeps the outer
 *  ring's nodes and their names inside the canvas). */
const INSET = { x: 0.07, y: 0.11 };
/** How close the camera gets to a lot. */
const FOCUS_SCALE = 1.55;
/** Desktop panel width + its gap from the edge — the camera centres the
 *  lot in the space left of it. */
const PANEL_SPACE = 456;

const STAGE_LABEL: Record<Lot['stage'], string> = { ready: 'Ready', forming: 'Forming' };

/** The orbit's title, written for the direction that's lit. */
const TITLE: Record<WayIn, string> = {
  acquire: 'What you can own',
  operate: 'What you can run',
  support: 'What you can back',
  build: 'What you can build',
  forming: 'What is forming',
  pending: 'Still to confirm',
};

/** Small counts read as words — a guide talks, it doesn't print. */
const say = (n: number) => (COUNT_WORDS[n] ?? String(n));

const names = (lots: Lot[]) =>
  lots.length <= 1 ? (lots[0]?.name ?? '') : `${lots.slice(0, -1).map((l) => l.name).join(', ')} and ${lots[lots.length - 1].name}`;

/** What the guide says on the orbit — counted from the lots, so it can
 *  never fall behind the data. */
function narrate({ way, intent, hovered, focus }: { way: WayIn | null; intent: Intent | null; hovered: Lot | null; focus: Lot | null }): string {
  if (focus) {
    switch (focus.wayIn) {
      case 'acquire': return `${focus.name} can be bought whole. If it's for you, the dossier is your next step.`;
      case 'operate': return `No capital needed to start here — ${focus.name} needs time and someone who wants to run it.`;
      case 'support': return `Backing ${focus.name} isn't investing: you help it keep going, and it gives back.`;
      case 'forming': return `${focus.name} is still forming. Ask Pyadra where it's heading.`;
      default: return `${focus.name} hasn't set how you come in yet. Every deal here starts as a conversation — ask.`;
    }
  }
  if (hovered) {
    const next = { acquire: "what you'd take", operate: "what you'd run", support: 'what it gives back' }[hovered.wayIn as 'acquire'] ?? 'more';
    return `${hovered.name}: ${hookOf(hovered).replace(/\.$/, '')}. Click to see ${next}.`;
  }
  const lit = way ? LOTS.filter((l) => l.wayIn === way) : [];
  switch (way) {
    case 'acquire':
      return lit.length > 3
        ? `${say(lit.length)} projects are for sale today, each one whole. Hover one to see what you'd take.`
        : `${lit.length === 1 ? 'One project is' : `${say(lit.length)} projects are`} for sale today: ${names(lit)}. Each one can be yours, whole.`;
    case 'operate': return `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} looking for someone to run ${lit.length === 1 ? 'it' : 'them'}. Here, your work is your capital.`;
    case 'support': return `${names(lit)} ${lit.length === 1 ? 'lives' : 'live'} on ${lit.length === 1 ? 'its' : 'their'} supporters. Backing isn't buying — see what it gives back.`;
    case 'build': return lit.length ? `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} looking for builders.` : 'Nothing to build here yet — that seat is open. Your idea could be the next project in this orbit.';
    case 'forming': return `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} still forming — close enough to follow.`;
    case 'pending': return `${names(lit)} haven't set how you come in yet. Ask Pyadra about any of them.`;
  }
  if (intent === 'look') return `${say(LOTS.length)} real projects. The direction tells you how to come in; the closer to the centre, the readier it is.`;
  return `This is Galaxy: ${say(LOTS.length).toLowerCase()} real projects. Pick a direction to light it, or hover a sphere to meet it.`;
}
const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
const COUNT = COUNT_WORDS[LOTS.length] ?? String(LOTS.length);

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

/** The logo inside a sphere, sized as a share of the sphere so the same
 *  piece works at 44px in a list and 80px on the canvas. */
function LogoSlot({ lot }: { lot: Lot }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {lot.logo.kind === 'image' && (
        <Image
          src={lot.logo.src}
          alt=""
          width={96}
          height={96}
          className="relative w-[64%] h-[64%] object-contain opacity-75 pointer-events-none select-none"
          draggable={false}
        />
      )}
      {lot.logo.kind === 'inline-capsule' && (
        <div className="relative w-[34%] h-[50%] opacity-80 pointer-events-none">
          <CapsuleMark />
        </div>
      )}
      {/* No logo asset yet — the dashed ring the team index already uses for
          a project whose mark hasn't been made. */}
      {lot.logo.kind === 'pending' && (
        <span className="relative w-[40%] h-[40%] rounded-full border border-dashed border-[#1A1C1A]/25 pointer-events-none" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/15 rounded-full pointer-events-none" />
    </div>
  );
}

function Sphere({ lot, className }: { lot: Lot; className: string }) {
  return (
    <div className={`relative rounded-full overflow-hidden ${lot.sphereClass} ${className}`}>
      <LogoSlot lot={lot} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.25)_270deg,transparent_360deg)]"
      />
    </div>
  );
}

const StageDot = ({ lot }: { lot: Lot }) => (
  <span
    aria-hidden
    className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${lot.stage === 'ready' ? 'bg-[#059669]' : 'border border-[#6B8070]/60'}`}
  />
);

/* ---------- the orbit ---------- */

/** One lot on the canvas: a sphere and a name. The rest waits in the
 *  preview (hover / focus) and the panel (click). */
function OrbitNode({
  lot, index, x, y, state, onOpen, onHover,
}: {
  lot: Lot;
  index: number;
  x: number;
  y: number;
  state: 'idle' | 'active' | 'dim';
  onOpen: () => void;
  onHover: (on: boolean) => void;
}) {
  const below = y < 62; // previews open away from the canvas edge
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 hover:z-30 focus-within:z-30"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.button
        type="button"
        onClick={onOpen}
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        aria-label={`${lot.name} — ${lot.opportunity}`}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: state === 'dim' ? 0.22 : 1, scale: 1 }}
        transition={{ opacity: { duration: 0.4 }, scale: { delay: 0.15 + index * 0.03, type: 'spring', stiffness: 150, damping: 16 } }}
        className="group relative flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer rounded-2xl focus:outline-none"
      >
        <motion.span
          className="relative block w-[clamp(44px,6.2cqw,82px)] aspect-square"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 5 + (index % 4) * 0.7, repeat: Infinity, ease: 'easeInOut', delay: index * 0.6 }}
        >
          <span className={`absolute inset-0 rounded-full blur-xl opacity-40 ${lot.glow}`} />
          <Sphere
            lot={lot}
            className={`w-full h-full shadow-[-8px_8px_18px_rgba(0,0,0,0.12)] transition-transform duration-500 ease-out group-hover:scale-110 group-focus-visible:scale-110 ${
              state === 'active' ? 'ring-2 ring-[#059669] ring-offset-4 ring-offset-[#EDEFED] scale-110' : ''
            }`}
          />
        </motion.span>
        <span className="mt-2.5 inline-flex items-center gap-1.5 whitespace-nowrap font-sans text-[13px] font-semibold text-ink transition-colors group-hover:text-accent-deep group-focus-visible:text-accent-deep">
          <StageDot lot={lot} />
          {lot.name}
        </span>

        {/* preview — the hook: what it is, why look, what it costs */}
        {state !== 'active' && (
          <span
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${below ? 'top-full mt-2' : 'bottom-full mb-2'} w-[290px] rounded-2xl bg-white/95 backdrop-blur-md p-4 text-left shadow-xl shadow-ink/10 ring-1 ring-ink/5 opacity-0 translate-y-1 scale-[0.98] transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:scale-100`}
          >
            <span className={`block ${TYPE.label}`}>{lot.kind}</span>
            <span className="mt-1.5 block font-sans text-sm font-medium leading-snug text-ink">{hookOf(lot)}</span>
            <span className="mt-3 pt-2.5 flex items-center justify-between gap-3 border-t border-ink/6">
              <span className="font-sans text-[13px] font-semibold text-ink whitespace-nowrap">{priceOf(lot.sheet ?? {})}</span>
              <span className="font-sans text-[13px] font-semibold text-accent-deep whitespace-nowrap">{lot.opportunity} →</span>
            </span>
          </span>
        )}
      </motion.button>
    </div>
  );
}

/** An empty sector's seat — the door exists, nobody is behind it yet.
 *  It asks for the project that would sit there. */
function OpenSeat({ x, y, label, dim, onOpen }: { x: number; y: number; label: string; dim: boolean; onOpen: () => void }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 z-10 hover:z-30 focus-within:z-30" style={{ left: `${x}%`, top: `${y}%` }}>
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`Open seat in ${label} — bring your idea`}
        initial={{ opacity: 0 }}
        animate={{ opacity: dim ? 0.2 : 1 }}
        transition={{ duration: 0.6, delay: dim ? 0 : 0.9 }}
        className="group relative flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer focus:outline-none"
      >
        <span className="flex items-center justify-center w-[clamp(44px,6.2cqw,82px)] aspect-square rounded-full border border-dashed border-[#059669]/45 text-[#059669] text-xl transition-all duration-300 group-hover:bg-white/70 group-hover:border-solid group-hover:scale-105 group-focus-visible:bg-white/70">
          +
        </span>
        <span className="mt-2.5 whitespace-nowrap font-sans text-[13px] font-semibold text-ink-mute group-hover:text-accent-deep group-focus-visible:text-accent-deep">Open seat</span>
        <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-[240px] rounded-2xl bg-white/95 p-4 text-left shadow-xl shadow-ink/10 ring-1 ring-ink/5 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
          <span className={`block ${TYPE.label}`}>{label}</span>
          <span className="mt-1.5 block font-sans text-sm font-medium leading-snug text-ink">Nothing to {label.toLowerCase()} here yet. Have the project that belongs in this seat?</span>
          <span className="mt-3 pt-2.5 block border-t border-ink/6 font-sans text-[13px] font-semibold text-accent-deep">Bring your idea →</span>
        </span>
      </motion.button>
    </div>
  );
}

/* ---------- the lot dashboard ---------- */

/** In development an empty lot-sheet field shows as a marked slot, so the
 *  owner sees the template and what's left to write; the live site hides it. */
const SHOW_EMPTY = process.env.NODE_ENV !== 'production';

/** Development only, with ?sample=1: fills the empty fields with marked
 *  sample text, so the owner can see a finished sheet before writing one. */
const SAMPLE_SHEET: LotSheet = {
  hook: 'Sample — the one line that makes someone want to look closer.',
  summary: 'Sample — two sentences that tell a stranger what this project is and why it matters.',
  formats: ['Sample format', 'Website'],
  price: 'Sample $0,000',
  priceNote: 'Sample — negotiable',
  includes: ['Sample — the product itself', 'Sample — the brand and domain', 'Sample — the customers so far', 'Sample — the know-how'],
  idealFor: ['Sample — a first-time founder', 'Sample — an operator', 'Sample — a studio'],
  numbers: [{ label: 'Sample metric', value: '000' }, { label: 'Sample metric', value: '00%' }, { label: 'Sample metric', value: '0.0' }],
  handover: 'Sample — two weeks, guided',
  live: { label: 'Sample — see it live', href: 'https://pyadra.io' },
};

function useSheet(lot: Lot): LotSheet {
  const sample = SHOW_EMPTY && typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('sample');
  return sample ? { ...SAMPLE_SHEET, ...lot.sheet } : (lot.sheet ?? {});
}

/** The line that makes a visitor lean in — the sheet's hook, or the
 *  subtitle until the owner writes one. */
const hookOf = (lot: Lot, sheet: LotSheet = lot.sheet ?? {}) => sheet.hook ?? lot.subtitle;
const priceOf = (sheet: LotSheet) => sheet.price ?? 'Price on request';

function Pending({ label }: { label: string }) {
  return (
    <span className="inline-block font-mono font-bold text-[11px] uppercase tracking-[0.14em] text-accent/80 border-b border-dashed border-accent/40">
      To complete · {label}
    </span>
  );
}

const reveal = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: 'easeOut' as const } },
};

/** The dashboard a click opens: just enough to want the dossier. The full
 *  story — summary, assets, risks, handover — stays in the dossier. */
function LotPanel({
  lot, position, total, onClose, onStep, onEnter, onAsk,
}: {
  lot: Lot;
  position: number;
  total: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
  onEnter: (from: Element | null) => void;
  onAsk: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const sheet = useSheet(lot);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

  // the three facts a buyer looks for first
  const facts: { label: string; value: React.ReactNode; note?: string }[] = [
    { label: 'Price', value: sheet.price ?? (SHOW_EMPTY ? <Pending label="price" /> : 'On request'), note: sheet.priceNote },
    { label: 'Format', value: sheet.formats?.length ? sheet.formats.join(' · ') : lot.kind },
    { label: 'Stage', value: <span className="inline-flex items-center gap-1.5"><StageDot lot={lot} />{STAGE_LABEL[lot.stage]}</span> },
  ];

  // the highlights — numbers if there are any, else what comes with it
  const numbers = sheet.numbers?.slice(0, 3) ?? [];
  const includes = sheet.includes?.slice(0, 3) ?? [];

  return (
    <>
    {/* phones: the list dims behind the sheet, and a tap on it steps back */}
    <motion.button
      type="button"
      aria-label="Back to the projects"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lg:hidden fixed inset-0 z-40 bg-ink/25 backdrop-blur-[2px] border-0 cursor-default"
    />
    <div className="fixed z-50 inset-x-3 bottom-3 top-16 lg:inset-x-auto lg:right-6 lg:top-20 lg:bottom-6 lg:w-[420px] flex items-end lg:items-center pointer-events-none">
    <motion.aside
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="lot-title"
      initial={{ opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 32 }}
      transition={{ type: 'spring', stiffness: 160, damping: 22 }}
      className="pointer-events-auto w-full max-h-full overflow-hidden rounded-[28px] bg-white/92 backdrop-blur-xl ring-1 ring-ink/6 shadow-2xl shadow-ink/12 flex flex-col"
    >
      {/* walk the orbit */}
      <div className="flex items-center justify-between px-5 pt-4 shrink-0">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onStep(-1)} aria-label="Previous project" className="w-8 h-8 rounded-full text-ink-soft hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">←</button>
          <button type="button" onClick={() => onStep(1)} aria-label="Next project" className="w-8 h-8 rounded-full text-ink-soft hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">→</button>
          <span className={`ml-1 ${TYPE.label}`}>
            {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Back to the orbit" className="w-8 h-8 rounded-full bg-paper text-ink-soft hover:bg-[#E2E6E2] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">×</button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 lg:px-7 pb-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={lot.id}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          >
            <motion.div variants={reveal} className="flex items-center gap-3 pt-3">
              {/* on desktop the camera already holds the sphere — phones show it here */}
              <Sphere lot={lot} className="lg:hidden w-12 h-12 shrink-0 shadow-[-6px_6px_14px_rgba(0,0,0,0.12)]" />
              <span className={TYPE.label}>{lot.type} · {lot.kind}</span>
            </motion.div>

            <motion.h2 variants={reveal} id="lot-title" className={`mt-3 ${TYPE.display}`}>{lot.name}</motion.h2>
            <motion.p variants={reveal} className={`mt-2.5 ${TYPE.lead}`}>{hookOf(lot, sheet)}</motion.p>
            {SHOW_EMPTY && !sheet.hook && <motion.p variants={reveal} className="mt-1"><Pending label="hook" /></motion.p>}
            <motion.span variants={reveal} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 font-mono font-bold text-[11px] uppercase tracking-[0.14em] text-accent-deep">
              {lot.opportunity}
            </motion.span>

            {/* the three facts */}
            <motion.dl variants={reveal} className="mt-5 grid grid-cols-3 gap-2">
              {facts.map((f) => (
                <div key={f.label} className="rounded-2xl bg-paper/80 px-3 py-3 min-w-0">
                  <dt className={TYPE.label}>{f.label}</dt>
                  <dd className="mt-1.5 font-sans text-sm font-semibold leading-snug text-ink break-words">{f.value}</dd>
                  {f.note && <dd className="mt-0.5 font-sans text-[13px] leading-snug text-ink-mute">{f.note}</dd>}
                </div>
              ))}
            </motion.dl>

            {/* the highlights */}
            {numbers.length > 0 ? (
              <motion.div variants={reveal} className="mt-2 grid grid-cols-3 gap-2">
                {numbers.map((n, i) => (
                  <div key={`${n.label}-${i}`} className="rounded-2xl ring-1 ring-ink/8 px-3 py-3">
                    <div className="font-serif font-semibold text-2xl leading-none text-ink">{n.value}</div>
                    <div className="mt-1.5 font-sans text-[13px] leading-snug text-ink-mute">{n.label}</div>
                  </div>
                ))}
              </motion.div>
            ) : includes.length > 0 ? (
              <motion.ul variants={reveal} className="mt-4 grid gap-1.5">
                {includes.map((it, i) => (
                  <li key={`${it}-${i}`} className="flex gap-2.5 font-sans text-sm leading-snug text-ink">
                    <span aria-hidden className="mt-[3px] flex w-4 h-4 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[11px] leading-none text-accent-deep">✓</span>
                    {it}
                  </li>
                ))}
              </motion.ul>
            ) : (
              SHOW_EMPTY && <motion.p variants={reveal} className="mt-4"><Pending label="numbers or what's included" /></motion.p>
            )}

            {/* who it's for */}
            {sheet.idealFor?.length ? (
              <motion.div variants={reveal} className="mt-5">
                <p className={TYPE.label}>Ideal for</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {sheet.idealFor.map((p, i) => (
                    <span key={`${p}-${i}`} className="rounded-full ring-1 ring-ink/10 px-3 py-1 font-sans text-[13px] font-medium text-ink-soft">{p}</span>
                  ))}
                </div>
              </motion.div>
            ) : (
              SHOW_EMPTY && <motion.p variants={reveal} className="mt-5"><Pending label="ideal for" /></motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* the move, always in reach — the dossier when the room is open, the
          conversation when it isn't — and the other one beside it */}
      <div className="shrink-0 border-t border-ink/6 bg-white/80 px-6 lg:px-7 pt-3 pb-4 grid gap-1">
        <p className="text-center font-sans text-[13px] text-ink-mute pb-1">Every deal starts as a conversation — no checkout.</p>
        <button
          type="button"
          onClick={() => (lot.enter_url ? onEnter(panelRef.current) : onAsk())}
          className="cta-glow w-full rounded-full bg-ink text-white px-7 py-3.5 font-sans text-sm font-semibold shadow-lg shadow-ink/15 hover:bg-accent-deep transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >
          {lot.enter_url ? 'Open the dossier →' : `Ask about ${lot.name} →`}
        </button>
        {lot.enter_url ? (
          <button
            type="button"
            onClick={onAsk}
            className="w-full rounded-full px-7 py-2 font-sans text-[13px] font-semibold text-accent-deep hover:bg-accent/8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Ask Pyadra about it
          </button>
        ) : (
          <span className="text-center font-sans text-[13px] text-ink-mute py-1">Its room opens soon.</span>
        )}
      </div>
    </motion.aside>
    </div>
    </>
  );
}

/* ---------- URL state ---------- */

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

/** Stage size and position, for the camera. Measured in the browser
 *  only — the camera never moves until there is a lot to fly to. */
type Box = { w: number; h: number; left: number; vw: number };

function useStageBox(ref: React.RefObject<HTMLDivElement | null>) {
  const [box, setBox] = useState<Box | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setBox({ w: el.offsetWidth, h: el.offsetHeight, left: r.left + window.scrollX, vw: window.innerWidth });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [ref]);
  return box;
}

/* ---------- the page ---------- */

export default function GalaxyExhibition() {
  const { zoomTo, overlay, zoomProps } = useZoomDoor();
  const reduced = useReducedMotion() ?? false;

  // The URL is the state: ?way= lights a sector (the Home's verbs land
  // here), ?lot= is the open panel — both survive a reload or a share.
  const search = useSyncExternalStore(subscribeUrl, () => window.location.search, () => '');
  const q = new URLSearchParams(search);
  const way = ARCS.find((a) => a.key === q.get('way'))?.key ?? null;
  const focusIndex = PLACED.findIndex((p) => p.lot.id === q.get('lot'));
  const focus = focusIndex >= 0 ? PLACED[focusIndex] : null;

  const intent = useIntent();
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredWay = PLACED.find((p) => p.lot.id === hovered)?.lot.wayIn ?? null;

  // one dialog, two doors: an open seat asks for an idea, a lot for a question
  const [dialog, setDialog] = useState<{ copy?: DialogCopy } | null>(null);
  const askAbout = (lot: Lot) =>
    setDialog({
      copy: {
        eyebrow: `Galaxy · ${lot.name}`,
        title: `Ask about ${lot.name}.`,
        intro: 'Every deal starts as a conversation. Tell us who you are and how you’d like to come in — it goes straight to the museum’s inbox.',
        messageLabel: 'Your question',
        messagePlaceholder: 'What would you like to know?',
        submitLabel: 'Send',
        // the inbox learns which door the visitor came through
        model: `Galaxy · ${lot.name}${intent ? ` · came in as: ${INTENTS.find((i) => i.key === intent)?.title}` : ''}`,
      },
    });

  const openLot = (id: string) => setUrl({ lot: id });
  const closeLot = useCallback(() => setUrl({ lot: null }), []);
  const step = (dir: 1 | -1) => {
    if (focusIndex < 0) return;
    setUrl({ lot: PLACED[(focusIndex + dir + PLACED.length) % PLACED.length].lot.id });
  };
  const pickWay = (w: WayIn) => setUrl({ way: way === w ? null : w });

  useEffect(() => {
    if (focusIndex < 0 || dialog) return; // the dialog owns the keys while it's open
    const walk = (dir: 1 | -1) =>
      setUrl({ lot: PLACED[(focusIndex + dir + PLACED.length) % PLACED.length].lot.id });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLot();
      if (e.key === 'ArrowRight') walk(1);
      if (e.key === 'ArrowLeft') walk(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusIndex, dialog, closeLot]);

  // the camera — flies to the focused lot and leaves room for the panel
  const stageRef = useRef<HTMLDivElement>(null);
  const box = useStageBox(stageRef);
  let camera = { x: 0, y: 0, scale: 1 };
  if (focus && box && box.vw >= 1024) {
    const lx = box.w * (INSET.x + (focus.x / 100) * (1 - 2 * INSET.x));
    const ly = box.h * (INSET.y + (focus.y / 100) * (1 - 2 * INSET.y));
    const tx = (box.vw - PANEL_SPACE) / 2 - box.left;
    const ty = box.h / 2;
    camera = {
      scale: FOCUS_SCALE,
      x: tx - box.w / 2 - (lx - box.w / 2) * FOCUS_SCALE,
      y: ty - box.h / 2 - (ly - box.h / 2) * FOCUS_SCALE,
    };
  }

  const nodeState = (l: Lot) =>
    focus ? (focus.lot.id === l.id ? 'active' : 'dim') : way && l.wayIn !== way ? 'dim' : 'idle';

  return (
    <>
    <motion.div
      {...zoomProps}
      className="bg-[#EDEFED] text-[#1A1C1A] relative overflow-x-clip antialiased selection:bg-[#059669] selection:text-white"
    >
      {/* ambient vignette */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white/40 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#D4DDD6]/40 to-transparent" />
      </div>

      {/* blueprint grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.22]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #D4DDD6 1px, transparent 1px),
            linear-gradient(to bottom, #D4DDD6 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
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

      <GreenDust count={160} />

      <SiteNav
        crumbs={[{ label: 'Galaxy' }]}
        status={{ label: `${LOTS.length} projects`, live: true }}
      />

      {/* ============ THE FIRST SCREEN ============ */}
      <section className="relative z-10 lg:h-[100svh] flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: focus ? 0 : 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-24 px-6 text-center"
        >
          <p className={TYPE.label}>Galaxy · {COUNT} projects</p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h1
              key={way ?? 'all'}
              initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className={`mt-3 ${TYPE.display}`}
            >
              {way ? TITLE[way] : 'Read the orbit'}<span className="text-accent">.</span>
            </motion.h1>
          </AnimatePresence>
          <p className={`lg:hidden mt-3 max-w-md mx-auto ${TYPE.lead}`}>
            Grouped by how you can come in. Tap one to see what you put in and what you take away.
          </p>
        </motion.header>

        {/* ---- desktop: the canvas ---- */}
        <div className="hidden lg:flex flex-1 min-h-0 items-center justify-center px-6 pt-2 pb-24 [container-type:size]">
          <div
            ref={stageRef}
            className="relative [container-type:inline-size]"
            style={{ width: `min(1240px, 100cqw, ${((100 * FIELD.w) / FIELD.h).toFixed(2)}cqh)`, aspectRatio: `${FIELD.w} / ${FIELD.h}` }}
          >
            <motion.div
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0, scale: 0.86 }}
              animate={{ opacity: 1, ...camera }}
              transition={{
                opacity: { duration: 0.5 },
                default: { type: 'spring', stiffness: 60, damping: 18, mass: 1 },
              }}
            >
              <div className="absolute" style={{ inset: `${INSET.y * 100}% ${INSET.x * 100}%` }}>

                {/* the field itself — a click on empty space steps back out */}
                {focus && (
                  <button type="button" aria-label="Back to the orbit" onClick={closeLot} className="absolute -inset-[40%] z-0 cursor-zoom-out bg-transparent border-0" />
                )}

                {/* rings and sector spokes */}
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full overflow-visible pointer-events-none text-[#059669]"
                  aria-hidden
                >
                  {Object.values(RING).map((r, i) => (
                    <ellipse
                      key={r}
                      cx="50" cy="50" rx={50 * r} ry={50 * r}
                      fill="none" stroke="currentColor" strokeOpacity={i === 0 ? 0.28 : 0.18}
                      strokeDasharray={i === 0 ? '3 5' : '1 7'}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                  {ARCS.map((a) => {
                    const p = toPoint(a.start, 1.12);
                    const lit = way === a.key || hoveredWay === a.key;
                    return (
                      <line
                        key={a.key} x1="50" y1="50" x2={p.x} y2={p.y}
                        stroke="currentColor" strokeOpacity={lit ? 0.3 : 0.1}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>

                {/* the sectors are the filters */}
                {ARCS.map((a, i) => {
                  // neighbours alternate between two radii so narrow sectors
                  // never print their names side by side
                  const p = toPoint((a.start + a.end) / 2, i % 2 ? 0.44 : 0.3);
                  const n = PLACED.filter((x) => x.lot.wayIn === a.key).length;
                  const lit = way === a.key || hoveredWay === a.key;
                  return (
                    <motion.button
                      key={a.key}
                      type="button"
                      aria-pressed={way === a.key}
                      onClick={() => pickWay(a.key)}
                      animate={{ opacity: focus ? 0 : 1 }}
                      className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-2.5 py-1 font-mono font-bold uppercase text-[11px] tracking-[0.18em] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        focus ? 'pointer-events-none' : ''
                      } ${way === a.key ? 'bg-ink text-white' : lit ? 'text-accent-deep' : 'text-ink-mute/80 hover:text-accent-deep'}`}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    >
                      {a.label} <span className="opacity-60">{n}</span>
                    </motion.button>
                  );
                })}

                {/* central gem — the door to the museum shop */}
                <motion.div
                  animate={{ opacity: focus ? 0.25 : 1 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(40px,5cqw,64px)] aspect-square z-10"
                >
                  <GemLink />
                </motion.div>

                {/* empty sectors keep a seat */}
                {ARCS.filter((a) => !PLACED.some((p) => p.lot.wayIn === a.key)).map((a) => {
                  const p = toPoint((a.start + a.end) / 2, RING.ready);
                  return (
                    <OpenSeat
                      key={a.key}
                      x={p.x}
                      y={p.y}
                      label={a.label}
                      dim={!!focus || (way !== null && way !== a.key)}
                      onOpen={() => setDialog({})}
                    />
                  );
                })}

                {/* the lots */}
                {PLACED.map((p, index) => (
                  <OrbitNode
                    key={p.lot.id}
                    lot={p.lot}
                    index={index}
                    x={p.x}
                    y={p.y}
                    state={nodeState(p.lot)}
                    onOpen={() => (focus?.lot.id === p.lot.id ? closeLot() : openLot(p.lot.id))}
                    onHover={(on) => setHovered(on ? p.lot.id : null)}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ---- phones and tablets: the same orbit, read as a list ---- */}
        <div className="lg:hidden w-full max-w-md mx-auto px-4 pt-8 pb-32 flex flex-col gap-7">
          {/* the direction the visitor chose comes first */}
          {[...ARCS].sort((a, b) => Number(b.key === way) - Number(a.key === way)).map((a) => {
            const lots = PLACED.filter((p) => p.lot.wayIn === a.key);
            if (!lots.length) {
              return (
                <section key={a.key} aria-label={a.label}>
                  <h2 className={`px-2 mb-2.5 font-mono font-bold uppercase text-[11px] tracking-[0.18em] ${way === a.key ? 'text-accent-deep' : 'text-ink-mute'}`}>
                    {a.label} <span className="opacity-60">· 0</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => setDialog({})}
                    className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left rounded-[24px] border border-dashed border-[#059669]/40 bg-transparent cursor-pointer active:bg-white/60 focus:outline-none focus-visible:bg-white/60"
                  >
                    <span className="w-11 h-11 shrink-0 rounded-full border border-dashed border-[#059669]/45 flex items-center justify-center text-[#059669] text-lg">+</span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-sans text-base font-semibold text-ink-soft">Open seat</span>
                      <span className="block font-sans text-[13px] font-semibold text-accent-deep">Bring your idea →</span>
                    </span>
                  </button>
                </section>
              );
            }
            return (
              <section key={a.key} aria-label={a.label}>
                <h2 className={`px-2 mb-2.5 font-mono font-bold uppercase text-[11px] tracking-[0.18em] ${way === a.key ? 'text-accent-deep' : 'text-ink-mute'}`}>
                  {a.label} <span className="opacity-60">· {lots.length}</span>
                </h2>
                <ul className="rounded-[24px] bg-white/75 backdrop-blur-sm ring-1 ring-[#1A1C1A]/5 shadow-sm divide-y divide-[#1A1C1A]/6 overflow-hidden">
                  {lots.map(({ lot }) => (
                    <li key={lot.id}>
                      <button
                        type="button"
                        onClick={() => openLot(lot.id)}
                        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left bg-transparent border-0 cursor-pointer active:bg-[#EDEFED] focus:outline-none focus-visible:bg-[#EDEFED]"
                      >
                        <Sphere lot={lot} className="w-11 h-11 shrink-0 shadow-[-4px_4px_10px_rgba(0,0,0,0.1)]" />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-1.5 font-sans text-base font-semibold text-ink">
                            <StageDot lot={lot} />{lot.name}
                          </span>
                          <span className="block truncate font-sans text-[13px] text-ink-mute">{hookOf(lot)}</span>
                        </span>
                        <span aria-hidden className="text-[#6B8070]">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
          <Link
            href="/store"
            className="self-center inline-flex items-center gap-2 rounded-full bg-white/80 ring-1 ring-[#1A1C1A]/8 shadow-sm px-4 py-2"
          >
            <span className="w-5 h-5 shrink-0"><GemIcon /></span>
            <span className="font-sans text-[13px] font-semibold text-ink">The museum shop →</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </motion.div>

    {/* ============ THE LOT ============ */}
    <AnimatePresence>
      {focus && (
        <LotPanel
          lot={focus.lot}
          position={focusIndex + 1}
          total={PLACED.length}
          onClose={closeLot}
          onStep={step}
          onEnter={(from) => focus.lot.enter_url && zoomTo(from, focus.lot.enter_url)}
          onAsk={() => askAbout(focus.lot)}
        />
      )}
    </AnimatePresence>

    {/* the guide — says where you are and what you can do here */}
    <Guide
      path={focus ? ['Pyadra', 'Galaxy', focus.lot.name] : ['Pyadra', 'Galaxy']}
      line={narrate({
        way,
        intent,
        hovered: PLACED.find((p) => p.lot.id === hovered)?.lot ?? null,
        focus: focus?.lot ?? null,
      })}
      offsetRight={focus && box && box.vw >= 1024 ? PANEL_SPACE : 0}
      hidden={!!focus && (!box || box.vw < 1024)}
    />

    <BringIdeaDialog open={dialog !== null} onClose={() => setDialog(null)} copy={dialog?.copy} />

    {/* ============ into the dossier ============ */}
    {overlay}
    </>
  );
}

function GemLink() {
  return (
    <Link href="/store" className="group relative block w-full h-full" aria-label="The museum shop">
      <motion.div
        whileHover={{ scale: 1.12 }}
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
      <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-3.5 py-1.5 font-sans text-[13px] font-semibold text-ink shadow-md ring-1 ring-[#1A1C1A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        The museum shop →
      </span>
    </Link>
  );
}
