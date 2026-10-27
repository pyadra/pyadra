'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import { useZoomDoor } from '@/app/components/ui/useZoomDoor';
import { TYPE } from '@/app/components/ui/type';
import { EASE, SPRING } from '@/app/components/ui/motion';
import { trackPointer } from '@/app/components/ui/pointer';
import RevealText from '@/app/components/ui/RevealText';
import Magnetic from '@/app/components/ui/Magnetic';
import BringIdeaDialog, { type DialogCopy } from '@/app/components/nav/BringIdeaDialog';
import Guide from '@/app/components/guide/Guide';
import { INTENTS, useIntent } from '@/app/components/guide/intent';
import { LOTS, type Lot, type LotSheet, type WayIn } from './lots';
import { layoutOrbit, FIELD } from './orbit';

/* ------------------------------------------------------------------ */
/*  PYADRA — GALAXY                                                    */
/*  The orbit as a turning ring — one screen, one project at a time.   */
/*                                                                     */
/*  The ring  — every project on a ring lying on the floor, the one in */
/*           front large and in colour. Left alone it turns by itself, */
/*           one project every few seconds. Drag it, use ← →, or click  */
/*           a sphere to bring it round.                               */
/*  The glance — a hand over the ring unfolds the front project's      */
/*           hook and numbers beside it; it folds away when the hand   */
/*           leaves. Nothing shows that the visitor didn't reach for.  */
/*  The lot  — clicking the front one opens its panel (?lot=); the     */
/*           room — "Open the dossier" — zooms into the project's page.*/
/* ------------------------------------------------------------------ */

const { arcs: ARCS, placed: PLACED } = layoutOrbit(LOTS);

/** Desktop panel width + its gap from the edge — the ring steps aside
 *  to leave room for it. */
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
function narrate({ way, focus, present, phone }: { way: WayIn | null; focus: Lot | null; present: boolean; phone: boolean }): string {
  if (focus) {
    switch (focus.wayIn) {
      case 'acquire': return focus.enter_url
        ? `${focus.name} can be bought whole. If it's for you, the dossier is your next step.`
        : `${focus.name} can be bought whole. Its room opens soon — ask Pyadra about it now.`;
      case 'operate': return `No capital needed to start here — ${focus.name} needs time and someone who wants to run it.`;
      case 'support': return `Backing ${focus.name} isn't investing: you help it keep going, and it gives back.`;
      case 'forming': return `${focus.name} is still forming. Ask Pyadra where it's heading.`;
      default: return `${focus.name} hasn't set how you come in yet. Every deal here starts as a conversation — ask.`;
    }
  }
  // a hand on the orbit learns how to move it
  if (present) return 'Drag the orbit or use ← → to turn it. Click the one in front to see it all.';
  const lit = way ? LOTS.filter((l) => l.wayIn === way) : [];
  switch (way) {
    case 'acquire':
      return lit.length > 3
        ? `${say(lit.length)} projects are for sale today, each one whole. ${phone ? 'Tap one' : 'Move over the orbit'} to see what you'd take.`
        : `${lit.length === 1 ? 'One project is' : `${say(lit.length)} projects are`} for sale today: ${names(lit)}. Each one can be yours, whole.`;
    case 'operate': return `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} looking for someone to run ${lit.length === 1 ? 'it' : 'them'}. Here, your work is your capital.`;
    case 'support': return `${names(lit)} ${lit.length === 1 ? 'lives' : 'live'} on ${lit.length === 1 ? 'its' : 'their'} supporters. Backing isn't buying — see what it gives back.`;
    case 'build': return lit.length ? `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} looking for builders.` : 'Nothing to build here yet — that seat is open. Your idea could be the next project in this orbit.';
    case 'forming': return `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} still forming — close enough to follow.`;
    case 'pending': return `${names(lit)} haven't set how you come in yet. Ask Pyadra about any of them.`;
  }
  if (phone) return `This is Galaxy: ${say(LOTS.length).toLowerCase()} real projects, grouped by how you can come in. Tap one to meet it.`;
  return `${say(LOTS.length)} real projects, turning slowly. Move over the orbit to stop it and look closer.`;
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
      {/* No logo asset yet — the project's initials, set in the museum's
          serif like a monogram, until its mark is made. */}
      {lot.logo.kind === 'pending' && (
        <span className="relative font-serif font-semibold text-[34cqw] leading-none tracking-[-0.02em] text-ink/45 pointer-events-none select-none">
          {initials(lot.name)}
        </span>
      )}
    </div>
  );
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

/** A sphere: the brand colour, the mark, and the room's light on it. */
function Sphere({ lot, className }: { lot: Lot; className: string }) {
  return (
    <div className={`relative rounded-full overflow-hidden [container-type:inline-size] ${lot.sphereClass} ${className}`}>
      <LogoSlot lot={lot} />
      <span aria-hidden className="py-glass" />
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

/** What sits on the ring, in sector order: every lot, and an open seat
 *  where a direction has nobody yet. */
type Item = { kind: 'lot'; lot: Lot; way: WayIn } | { kind: 'seat'; way: WayIn; label: string };
const ITEMS: Item[] = ARCS.flatMap((a): Item[] => {
  const lots = PLACED.filter((p) => p.lot.wayIn === a.key);
  return lots.length
    ? lots.map((p) => ({ kind: 'lot', lot: p.lot, way: a.key }))
    : [{ kind: 'seat', way: a.key, label: a.label }];
});
const RING_N = ITEMS.length;
const itemId = (it: Item) => (it.kind === 'lot' ? it.lot.id : `seat-${it.way}`);
/** The featured lot starts at the front. */
const START = Math.max(0, ITEMS.findIndex((it) => it.kind === 'lot' && it.lot.featured));

const mod = (n: number, m: number) => ((n % m) + m) % m;
/** The short way round: an offset in [-N/2, N/2). */
const wrap = (o: number) => mod(o + RING_N / 2, RING_N) - RING_N / 2;

/** The ring lies on the floor: a wide ellipse whose bottom edge is nearest
 *  the visitor. Percent of the stage. */
const RING_SHAPE = { rx: 44, ry: 19, cy: 37 };
/** The size of the sphere at the front; the rest shrink with distance. */
const FRONT = 'clamp(110px, 15cqw, 196px)';

/** Where an item sits, `offset` steps from the front. depth: 1 at the
 *  front, 0 at the back. */
function onRing(offset: number) {
  const t = (offset / RING_N) * Math.PI * 2;
  return {
    x: 50 + RING_SHAPE.rx * Math.sin(t),
    y: RING_SHAPE.cy + RING_SHAPE.ry * Math.cos(t),
    depth: (Math.cos(t) + 1) / 2,
  };
}

/** One place on the ring — a lot or an open seat. As it turns to the front
 *  it grows, comes forward and takes its colour back. */
function RingNode({
  item, index, pos, isFront, state, onPick,
}: {
  item: Item;
  index: number;
  /** The ring's turn, in steps — a spring, so every node moves with it. */
  pos: MotionValue<number>;
  isFront: boolean;
  state: 'idle' | 'active' | 'dim';
  onPick: () => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const offset = useTransform(pos, (p) => wrap(index - p));
  const left = useTransform(offset, (o) => `${onRing(o).x}%`);
  const top = useTransform(offset, (o) => `${onRing(o).y}%`);
  const zIndex = useTransform(offset, (o) => Math.round(onRing(o).depth * 100));
  const k = useTransform(offset, (o) => 0.3 + 0.7 * onRing(o).depth ** 2);
  const size = useTransform(k, (v) => `calc(${v.toFixed(3)} * ${FRONT})`);
  // the sphere's centre, not the button's, sits on the ring
  const lift = useTransform(k, (v) => `calc(${(-v / 2).toFixed(3)} * ${FRONT})`);
  const opacity = useTransform(offset, (o) => 0.45 + 0.55 * onRing(o).depth);
  // the colour arrives only near the front
  const filter = useTransform(offset, (o) => `saturate(${(0.3 + 0.7 * onRing(o).depth ** 6).toFixed(2)})`);
  const glow = useTransform(offset, (o) => 0.6 * onRing(o).depth ** 6);
  const nameOpacity = useTransform(offset, (o) => Math.min(1, Math.max(0, onRing(o).depth * 1.5 - 0.35)));
  const name = item.kind === 'lot' ? item.lot.name : 'Open seat';

  return (
    <motion.div className="absolute pointer-events-auto" style={{ left, top, zIndex, marginTop: lift, opacity, x: '-50%' }}>
      <motion.button
        type="button"
        onClick={onPick}
        aria-label={isFront ? (item.kind === 'lot' ? `${name} — ${item.lot.opportunity}` : 'Open seat — bring your idea') : `Turn the orbit to ${name}`}
        animate={{ opacity: state === 'dim' ? 0.22 : 1 }}
        transition={{ duration: 0.4 }}
        className="group relative flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer rounded-2xl focus:outline-none"
      >
        {item.kind === 'lot' && item.lot.featured && isFront && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-full mb-3 whitespace-nowrap font-mono font-bold text-[11px] uppercase tracking-[0.18em] text-accent-deep"
          >
            Start here
          </motion.span>
        )}
        <motion.span className="relative block aspect-square" style={{ width: size }}>
          {item.kind === 'lot' ? (
            <>
              {/* its colour, on the floor around it — only at the front */}
              <motion.span aria-hidden className={`absolute -inset-3 rounded-full blur-2xl ${item.lot.glow}`} style={{ opacity: glow }} />
              {/* arriving at the front, it lights once */}
              {isFront && !reduced && (
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full ring-2 ring-accent"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 1.6, ease: 'easeOut', delay: 0.35 }}
                />
              )}
              <motion.span className="block w-full h-full" style={{ filter }}>
                <Sphere
                  lot={item.lot}
                  className={`w-full h-full shadow-[-10px_14px_24px_rgba(26,28,26,0.16)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06] ${
                    state === 'active' ? 'ring-2 ring-accent ring-offset-4 ring-offset-paper' : ''
                  }`}
                />
              </motion.span>
            </>
          ) : (
            <span className="flex w-full h-full items-center justify-center rounded-full border border-dashed border-accent/45 bg-white/30 text-accent text-xl transition-colors group-hover:bg-white/70 group-focus-visible:bg-white/70">
              +
            </span>
          )}
        </motion.span>
        <motion.span
          style={{ opacity: nameOpacity }}
          className={`mt-2 inline-flex items-center gap-1.5 whitespace-nowrap font-sans text-[13px] transition-colors group-hover:text-accent-deep group-focus-visible:text-accent-deep ${
            isFront ? 'font-semibold text-ink' : 'font-medium text-ink-soft'
          }`}
        >
          {item.kind === 'lot' && <StageDot lot={item.lot} />}
          {name}
        </motion.span>
      </motion.button>
    </motion.div>
  );
}

const glanceRise = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.out } },
};

/** The glance — the front project at a look, the moment a hand is over the
 *  orbit. It unfolds from the sphere and folds away when the hand leaves:
 *  the room shows nothing the visitor didn't reach for. */
function Glance({ item, onOpen, onSeat }: { item: Item; onOpen: () => void; onSeat: () => void }) {
  const sheet = item.kind === 'lot' ? (item.lot.sheet ?? {}) : {};
  const numbers = sheet.numbers?.slice(0, 3) ?? [];
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.94, filter: 'blur(8px)', clipPath: 'inset(0% 100% 0% 0% round 24px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0% 0% 0% 0% round 24px)', transitionEnd: { filter: 'none' } }}
      exit={{ opacity: 0, x: -12, scale: 0.97, filter: 'blur(6px)', transition: { duration: 0.22, ease: EASE.inOut } }}
      transition={{ ...SPRING.glide, opacity: { duration: 0.3 }, filter: { duration: 0.45 }, clipPath: { duration: 0.6, ease: EASE.out } }}
      style={{ transformOrigin: '0% 50%' }}
      className="relative pointer-events-auto w-[340px] overflow-hidden rounded-[24px] bg-white/90 backdrop-blur-xl ring-1 ring-ink/6 shadow-[0_30px_70px_-24px_rgba(26,28,26,0.35)] text-left"
    >
      {item.kind === 'lot' && <span aria-hidden className={`absolute -top-16 -right-12 w-44 h-44 rounded-full blur-3xl opacity-60 ${item.lot.glow}`} />}
      <motion.div className="relative p-5" initial="hidden" animate="show" transition={{ staggerChildren: 0.06, delayChildren: 0.12 }}>
        {item.kind === 'lot' ? (
          <>
            <motion.p variants={glanceRise} className={TYPE.label}>{item.lot.type} · {item.lot.kind}</motion.p>
            <motion.p variants={glanceRise} className={`mt-1.5 ${TYPE.title}`}>{item.lot.name}</motion.p>
            <motion.p variants={glanceRise} className="mt-1.5 font-serif font-semibold text-base leading-snug text-ink">{hookOf(item.lot)}</motion.p>
            {numbers.length > 0 ? (
              <motion.div variants={glanceRise} className="mt-4 grid grid-cols-3 gap-2">
                {numbers.map((n, i) => (
                  <div key={`${n.label}-${i}`} className="rounded-2xl ring-1 ring-ink/6 bg-white/60 px-2.5 py-2 min-w-0">
                    <p className="font-serif font-semibold text-lg leading-none text-ink"><CountUp value={n.value} /></p>
                    <p className="mt-1 font-sans text-xs leading-tight text-ink-mute">{n.label}</p>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.p variants={glanceRise} className={`mt-3 ${TYPE.small}`}>{item.lot.proof}</motion.p>
            )}
            <motion.div variants={glanceRise} className="mt-4 pt-3 flex items-center justify-between gap-3 border-t border-ink/6">
              <span className="font-sans text-[13px] font-semibold text-ink whitespace-nowrap">{priceOf(sheet)}</span>
              <button
                type="button"
                onClick={onOpen}
                className="inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 font-sans text-[13px] font-semibold text-white whitespace-nowrap border-0 cursor-pointer transition-colors hover:bg-accent-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                See it all <span aria-hidden>→</span>
              </button>
            </motion.div>
          </>
        ) : (
          <>
            <motion.p variants={glanceRise} className={TYPE.label}>{item.label} · open seat</motion.p>
            <motion.p variants={glanceRise} className={`mt-1.5 ${TYPE.title}`}>Nobody here yet</motion.p>
            <motion.p variants={glanceRise} className={`mt-1.5 ${TYPE.body}`}>Nothing to {item.label.toLowerCase()} here yet. Have the project that belongs in this seat?</motion.p>
            <motion.div variants={glanceRise} className="mt-4 pt-3 border-t border-ink/6">
              <button
                type="button"
                onClick={onSeat}
                className="inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-1.5 font-sans text-[13px] font-semibold text-white border-0 cursor-pointer transition-colors hover:bg-accent-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Bring your idea <span aria-hidden>→</span>
              </button>
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
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
  hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE.out } },
};

/** A number that counts up to itself when it appears — "500+" climbs from
 *  0 to 500 and keeps its "+". Anything that isn't a number stays as written. */
function CountUp({ value }: { value: string }) {
  const reduced = useReducedMotion() ?? false;
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const m = value.match(/^([^\d]*)([\d,]*\.?\d+)(.*)$/);
    if (!m || reduced || !ref.current) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = num.includes('.') ? num.split('.')[1].length : 0;
    const el = ref.current;
    const controls = animate(0, target, {
      duration: 1.1,
      ease: EASE.out,
      delay: 0.25,
      onUpdate: (v) => {
        el.textContent = `${pre}${v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${post}`;
      },
    });
    return () => controls.stop();
  }, [value, reduced]);
  return <span ref={ref}>{value}</span>;
}

/** The dashboard a click opens: just enough to want the dossier. The full
 *  story — summary, assets, risks, handover — stays in the dossier. */
function LotPanel({
  lot, position, total, onClose, onStep, onEnter, onAsk, sheetFromBelow,
}: {
  lot: Lot;
  /** Phones: the panel is a sheet and rises from the bottom edge. */
  sheetFromBelow: boolean;
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
      initial={sheetFromBelow ? { opacity: 0, y: 80 } : { opacity: 0, x: 56, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={sheetFromBelow ? { opacity: 0, y: 60, transition: { duration: 0.25, ease: EASE.inOut } } : { opacity: 0, x: 40, scale: 0.97, transition: { duration: 0.25, ease: EASE.inOut } }}
      transition={SPRING.glide}
      className="relative pointer-events-auto w-full max-h-full overflow-hidden rounded-[28px] bg-white/90 backdrop-blur-2xl ring-1 ring-ink/6 shadow-[0_40px_100px_-30px_rgba(26,28,26,0.35)] flex flex-col"
    >
      {/* the project's colour, as light from the top corner — it changes
          with the lot as the visitor walks the orbit */}
      <AnimatePresence initial={false}>
        <motion.span
          key={lot.id}
          aria-hidden
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.75, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE.out }}
          className={`pointer-events-none absolute -top-28 -right-20 w-80 h-80 rounded-full blur-3xl ${lot.glow}`}
        />
      </AnimatePresence>
      {/* walk the orbit */}
      <div className="relative flex items-center justify-between px-5 pt-4 shrink-0">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => onStep(-1)} aria-label="Previous project" className="w-8 h-8 rounded-full text-ink-soft hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">←</button>
          <button type="button" onClick={() => onStep(1)} aria-label="Next project" className="w-8 h-8 rounded-full text-ink-soft hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">→</button>
          <span className={`ml-1 ${TYPE.label}`}>
            {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Back to the orbit" className="w-8 h-8 rounded-full bg-paper text-ink-soft hover:bg-[#E2E6E2] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">×</button>
      </div>

      <div className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 lg:px-7 pb-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={lot.id}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } } }}
          >
            <motion.div variants={reveal} className="flex items-center gap-3 pt-3">
              {/* on desktop the camera already holds the sphere — phones show it here */}
              <Sphere lot={lot} className="lg:hidden w-12 h-12 shrink-0 shadow-[-6px_6px_14px_rgba(0,0,0,0.12)]" />
              <span className={TYPE.label}>{lot.type} · {lot.kind}</span>
            </motion.div>

            <h2 id="lot-title" className="mt-3">
              <RevealText text={lot.name} className={`block ${TYPE.display}`} delay={0.08} />
            </h2>
            <motion.p variants={reveal} className={`mt-2.5 ${TYPE.lead}`}>{hookOf(lot, sheet)}</motion.p>
            {SHOW_EMPTY && !sheet.hook && <motion.p variants={reveal} className="mt-1"><Pending label="hook" /></motion.p>}
            <motion.span variants={reveal} className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 font-mono font-bold text-[11px] uppercase tracking-[0.14em] text-accent-deep">
              {lot.opportunity}
            </motion.span>

            {/* the three facts */}
            <motion.dl variants={reveal} className="mt-5 grid grid-cols-3 gap-2">
              {facts.map((f) => (
                <div key={f.label} onPointerMove={trackPointer} className="py-spot rounded-2xl bg-paper/80 px-3 py-3 min-w-0">
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
                  <div key={`${n.label}-${i}`} onPointerMove={trackPointer} className="py-spot rounded-2xl ring-1 ring-ink/8 bg-white/60 px-3 py-3">
                    <div className="font-serif font-semibold text-2xl leading-none text-ink tabular-nums"><CountUp value={n.value} /></div>
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
      <div className="relative shrink-0 border-t border-ink/6 bg-white/80 px-6 lg:px-7 pt-3 pb-4 grid gap-1">
        <p className="text-center font-sans text-[13px] text-ink-mute pb-1">Every deal starts as a conversation — no checkout.</p>
        <Magnetic strength={0.12}>
          <button
            type="button"
            onClick={() => (lot.enter_url ? onEnter(panelRef.current) : onAsk())}
            className="py-sheen group/cta w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-7 py-3.5 font-sans text-sm font-semibold shadow-[0_14px_30px_-12px_rgba(26,28,26,0.55)] hover:bg-accent-deep hover:shadow-[0_18px_40px_-14px_rgba(4,120,87,0.7)] transition-[background-color,box-shadow] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            {lot.enter_url ? 'Open the dossier' : `Ask about ${lot.name}`}
            <span aria-hidden className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
          </button>
        </Magnetic>
        {lot.enter_url ? (
          <button
            type="button"
            onClick={onAsk}
            className="w-full rounded-full px-7 py-2 font-sans text-[13px] font-semibold text-accent-deep hover:bg-accent/8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Ask Pyadra about it
          </button>
        ) : sheet.live ? (
          // no room yet — the product itself is the proof
          <a
            href={sheet.live.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-full px-7 py-2 font-sans text-[13px] font-semibold text-accent-deep hover:bg-accent/8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            See it live · {sheet.live.label} <span aria-hidden>↗</span>
          </a>
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

  // The ring turns in whole steps. `turn` keeps counting past a full circle
  // so the spring always takes the short way round; the front is turn mod N.
  const [turn, setTurn] = useState(START);
  const front = mod(turn, RING_N);
  const target = useMotionValue(START);
  const spun = useSpring(target, { stiffness: 70, damping: 18, mass: 1 });
  const pos = reduced ? target : spun;
  useEffect(() => {
    target.set(turn);
  }, [turn, target]);
  const turnTo = useCallback((i: number) => setTurn((t) => t + wrap(i - mod(t, RING_N))), []);

  // a direction chosen (here, or on the Home) brings its first project round
  useEffect(() => {
    if (!way) return;
    const i = ITEMS.findIndex((it) => it.way === way);
    if (i >= 0) turnTo(i);
  }, [way, turnTo]);
  // so does an open lot — a shared ?lot= link arrives with it in front
  const focusId = focus?.lot.id ?? null;
  useEffect(() => {
    if (focusId) turnTo(ITEMS.findIndex((it) => itemId(it) === focusId));
  }, [focusId, turnTo]);

  // A hand over the orbit: the glance shows the front project while it's
  // there and folds away when it leaves.
  const [present, setPresent] = useState(false);

  // Nobody there: the orbit turns on its own, one project at a time — within
  // the chosen direction if there is one — and each lights as it arrives.
  const touring = !reduced && !present && !focus && !dialog;
  useEffect(() => {
    if (!touring) return;
    const id = window.setInterval(() => {
      setTurn((t) => {
        for (let k = 1; k < RING_N; k++) {
          if (!way || ITEMS[mod(t + k, RING_N)].way === way) return t + k;
        }
        return t;
      });
    }, 4800);
    return () => window.clearInterval(id);
  }, [touring, way]);

  useEffect(() => {
    if (dialog) return; // the dialog owns the keys while it's open
    const onKey = (e: KeyboardEvent) => {
      if (focusIndex >= 0) {
        const walk = (dir: 1 | -1) =>
          setUrl({ lot: PLACED[(focusIndex + dir + PLACED.length) % PLACED.length].lot.id });
        if (e.key === 'Escape') closeLot();
        if (e.key === 'ArrowRight') walk(1);
        if (e.key === 'ArrowLeft') walk(-1);
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setPresent(true);
        setTurn((t) => t + (e.key === 'ArrowRight' ? 1 : -1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusIndex, dialog, closeLot]);

  // Drag the ring round. A drag that moved isn't a click on what it let go of.
  const drag = useRef<{ x: number; from: number; moved: boolean } | null>(null);
  const dragged = useRef(false);
  const onDragStart = (e: React.PointerEvent) => {
    if (e.button !== 0 || focus) return;
    dragged.current = false;
    drag.current = { x: e.clientX, from: target.get(), moved: false };
  };
  const onDragMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    d.moved = true;
    target.set(d.from - dx / 160);
  };
  const onDragEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    dragged.current = true;
    const t = Math.round(target.get());
    target.set(t);
    setTurn(t);
  };

  const pick = (i: number) => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    const it = ITEMS[i];
    if (focus) {
      if (it.kind === 'lot') (focus.lot.id === it.lot.id ? closeLot() : openLot(it.lot.id));
      return;
    }
    if (i !== front) return turnTo(i);
    if (it.kind === 'lot') openLot(it.lot.id);
    else setDialog({});
  };

  // with a lot open, the ring steps left to leave room for its panel
  const stageRef = useRef<HTMLDivElement>(null);
  const box = useStageBox(stageRef);
  const shift = focus && box && box.vw >= 1024 ? -PANEL_SPACE / 2 : 0;

  const nodeState = (it: Item) =>
    focus ? (it.kind === 'lot' && focus.lot.id === it.lot.id ? 'active' : 'dim') : way && it.way !== way ? 'dim' : 'idle';

  // a light follows the pointer across the floor
  const lightX = useMotionValue(-2000);
  const lightY = useMotionValue(-2000);
  const light = useMotionTemplate`radial-gradient(560px circle at ${lightX}px ${lightY}px, rgba(5,150,105,0.075), transparent 70%)`;
  const onRoomMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    lightX.set(e.clientX - r.left);
    lightY.set(e.clientY - r.top);
  };

  return (
    <>
    <motion.div
      {...zoomProps}
      className="bg-paper text-ink relative overflow-x-clip antialiased selection:bg-accent selection:text-white"
    >
      {/* ambient vignette — light from above, the floor darker */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-white/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#D4DDD6]/45 to-transparent" />
      </div>

      <MuseumAtmosphere dust={16} />

      <SiteNav crumbs={[{ label: 'Galaxy' }]} />

      {/* ============ THE FIRST SCREEN ============ */}
      <section onPointerMove={onRoomMove} className="relative z-10 lg:h-[100svh] flex flex-col">
        <motion.div aria-hidden className="hidden lg:block absolute inset-0 pointer-events-none" style={{ background: light }} />

        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: focus ? 0 : 1, y: focus ? -12 : 0 }}
          transition={{ duration: 0.5, ease: EASE.out }}
          className={`relative pt-24 px-6 text-center ${focus ? 'pointer-events-none' : ''}`}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.32em' }}
            animate={{ opacity: 1, letterSpacing: '0.18em' }}
            transition={{ duration: 1, ease: EASE.out }}
            className={TYPE.label}
          >
            Galaxy
          </motion.p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={way ?? 'all'}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)', transition: { duration: 0.2 } }}
            >
              <RevealText
                as="h1"
                text={way ? TITLE[way] : `${COUNT} real projects`}
                after={<span className="text-accent">.</span>}
                className={`mt-3 ${TYPE.display}`}
                delay={0.1}
              />
            </motion.div>
          </AnimatePresence>
          {/* the same three steps as the Home: a label, a name, the line under it */}
          <p className={`mt-3 max-w-md mx-auto ${TYPE.lead}`}>
            <span className="lg:hidden">Grouped by how you can come in. Tap one to see what you put in and what you take away.</span>
            <span className="hidden lg:inline">Move over the orbit to meet each one.</span>
          </p>

          {/* the directions, in the Home's own verbs */}
          <nav aria-label="How you can come in" className="hidden lg:flex mt-6 justify-center">
            <div className="inline-flex items-center gap-1 rounded-full bg-white/70 backdrop-blur-md ring-1 ring-ink/6 shadow-sm p-1">
              {[{ key: null, label: 'All', n: 0 }, ...ARCS.map((a) => ({ key: a.key, label: a.label, n: PLACED.filter((p) => p.lot.wayIn === a.key).length }))]
                // an empty direction keeps its open seat on the ring; it gets a chip only when it's the one chosen
                .filter((c) => c.key === null || c.n > 0 || c.key === way)
                .map((c) => {
                  const on = way === c.key;
                  return (
                    <button
                      key={c.key ?? 'all'}
                      type="button"
                      aria-pressed={on}
                      onClick={() => (c.key ? pickWay(c.key) : setUrl({ way: null }))}
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-[13px] font-medium cursor-pointer border-0 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        on ? 'bg-ink text-white' : 'bg-transparent text-ink-soft hover:bg-paper hover:text-ink'
                      }`}
                    >
                      {c.label}
                      {c.key && <span className={`font-mono text-[11px] ${on ? 'text-white/60' : 'text-ink-mute'}`}>{c.n}</span>}
                    </button>
                  );
                })}
            </div>
          </nav>
        </motion.header>

        {/* ---- desktop: the orbit ---- */}
        <div className="hidden lg:flex flex-1 min-h-0 items-center justify-center px-6 pt-2 pb-24 [container-type:size]">
          <div
            ref={stageRef}
            onPointerMove={(e) => {
              if (e.pointerType === 'mouse') setPresent(true);
              onDragMove(e);
            }}
            onPointerLeave={() => {
              setPresent(false);
              onDragEnd();
            }}
            onPointerDown={onDragStart}
            onPointerUp={onDragEnd}
            className={`relative [container-type:inline-size] select-none touch-pan-y ${focus ? '' : 'cursor-grab active:cursor-grabbing'}`}
            style={{ width: `min(1240px, 100cqw, ${((100 * FIELD.w) / FIELD.h).toFixed(2)}cqh)`, aspectRatio: `${FIELD.w} / ${FIELD.h}` }}
          >
            <motion.div
              className="absolute inset-0"
              initial={reduced ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1, x: shift }}
              transition={{ opacity: { duration: 0.6 }, default: SPRING.camera }}
            >
              {/* the field itself — with a lot open, a click on it steps back out */}
              {focus && (
                <button type="button" aria-label="Back to the orbit" onClick={closeLot} className="absolute -inset-[20%] z-0 cursor-zoom-out bg-transparent border-0" />
              )}

              {/* the ring on the floor, and the light at its heart */}
              <motion.div
                aria-hidden
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46%] aspect-[2/1] rounded-[50%] pointer-events-none"
                style={{ top: `${RING_SHAPE.cy}%`, background: 'radial-gradient(closest-side, rgba(5,150,105,0.14), rgba(5,150,105,0.03) 60%, transparent)' }}
                animate={reduced ? undefined : { opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full overflow-visible pointer-events-none text-accent"
                aria-hidden
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: focus ? 0.4 : 1 }}
                transition={{ duration: 1.2, ease: EASE.out }}
              >
                <ellipse
                  cx={50} cy={RING_SHAPE.cy} rx={RING_SHAPE.rx} ry={RING_SHAPE.ry}
                  fill="currentColor" fillOpacity={0.03}
                  stroke="currentColor" strokeOpacity={0.3} strokeWidth={1} vectorEffect="non-scaling-stroke"
                />
              </motion.svg>

              {/* central gem — the door to the museum shop, behind the front half */}
              <motion.div
                initial={reduced ? false : { opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: focus ? 0.25 : 1, scale: 1, rotate: 0 }}
                transition={{ ...SPRING.glide, delay: reduced ? 0 : 0.2 }}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(36px,4.4cqw,56px)] aspect-square"
                style={{ top: `${RING_SHAPE.cy}%`, zIndex: 50 }}
              >
                <GemLink />
              </motion.div>

              {ITEMS.map((it, i) => (
                <RingNode
                  key={itemId(it)}
                  item={it}
                  index={i}
                  pos={pos}
                  isFront={i === front}
                  state={nodeState(it)}
                  onPick={() => pick(i)}
                />
              ))}

              {/* the glance unfolds beside the front sphere */}
              <div
                className="absolute -translate-y-1/2 pointer-events-none"
                style={{ left: `calc(50% + ${FRONT} / 2 + 36px)`, top: `${RING_SHAPE.cy + RING_SHAPE.ry}%`, zIndex: 200 }}
              >
                <AnimatePresence mode="wait">
                  {present && !focus && (
                    <Glance
                      key={itemId(ITEMS[front])}
                      item={ITEMS[front]}
                      onOpen={() => {
                        const it = ITEMS[front];
                        if (it.kind === 'lot') openLot(it.lot.id);
                      }}
                      onSeat={() => setDialog({})}
                    />
                  )}
                </AnimatePresence>
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
              <motion.section
                key={a.key}
                aria-label={a.label}
                initial={reduced ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: EASE.out }}
              >
                <h2 className={`px-2 mb-2.5 font-mono font-bold uppercase text-[11px] tracking-[0.18em] ${way === a.key ? 'text-accent-deep' : 'text-ink-mute'}`}>
                  {a.label} <span className="opacity-60">· {lots.length}</span>
                </h2>
                <ul className="rounded-[24px] bg-white/75 backdrop-blur-sm ring-1 ring-[#1A1C1A]/5 shadow-sm divide-y divide-[#1A1C1A]/6 overflow-hidden">
                  {lots.map(({ lot }) => (
                    <li key={lot.id}>
                      <button
                        type="button"
                        onClick={() => openLot(lot.id)}
                        className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left bg-transparent border-0 cursor-pointer transition-colors active:bg-paper focus:outline-none focus-visible:bg-paper"
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
              </motion.section>
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
          sheetFromBelow={!box || box.vw < 1024}
        />
      )}
    </AnimatePresence>

    {/* the guide — says where you are and what you can do here */}
    <Guide
      path={focus ? ['Pyadra', 'Galaxy', focus.lot.name] : ['Pyadra', 'Galaxy']}
      line={narrate({
        way,
        focus: focus?.lot ?? null,
        present,
        phone: !!box && box.vw < 1024,
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
