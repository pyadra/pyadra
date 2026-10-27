'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import Link from 'next/link';
import MuseumAtmosphere from '@/app/components/ui/MuseumAtmosphere';
import SiteNav from '@/app/components/nav/SiteNav';
import SiteFooter from '@/app/components/nav/SiteFooter';
import { useZoomDoor } from '@/app/components/ui/useZoomDoor';
import { TYPE } from '@/app/components/ui/type';
import { EASE, SPRING } from '@/app/components/ui/motion';
import RevealText from '@/app/components/ui/RevealText';
import BringIdeaDialog, { type DialogCopy } from '@/app/components/nav/BringIdeaDialog';
import Guide from '@/app/components/guide/Guide';
import { LOTS, type Lot, type LotSheet, type WayIn } from './lots';
import { GemIcon, Sphere } from './Sphere';
import { useLiveLots } from './live';
import FocusPanel from './FocusPanel';
import { getFlight, landAt, useFlight, type Landing } from '@/app/components/flight/flight';
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
/*           room — "Open the project" — zooms into its dashboard.  */
/* ------------------------------------------------------------------ */

const { arcs: ARCS, placed: PLACED } = layoutOrbit(LOTS);



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
      case 'acquire': return `${focus.name} can be bought whole. Open the project to see everything that comes with it.`;
      case 'operate': return `No capital needed to start. ${focus.name} needs someone who wants to run it.`;
      case 'support': return `Backing ${focus.name} isn't investing: you help it keep going, and it gives back.`;
      case 'forming': return `${focus.name} is still forming. Follow it to hear when it opens.`;
      default: return `Every deal here starts as a conversation. Open ${focus.name} to begin one.`;
    }
  }
  // a hand on the orbit learns how to move it
  if (present) return 'Hover a sphere to meet it, click it for the ways in. Drag or use ← → to turn the orbit.';
  const lit = way ? LOTS.filter((l) => l.wayIn === way) : [];
  switch (way) {
    case 'acquire':
      return lit.length > 3
        ? `${say(lit.length)} projects are for sale today, each one whole. ${phone ? 'Tap one' : 'Move over the orbit'} to see what you'd take.`
        : `${lit.length === 1 ? 'One project is' : `${say(lit.length)} projects are`} for sale today: ${names(lit)}. Each one can be yours, whole.`;
    case 'operate': return `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} looking for someone to run ${lit.length === 1 ? 'it' : 'them'}. Here, your work is your capital.`;
    case 'support': return `${names(lit)} ${lit.length === 1 ? 'lives' : 'live'} on ${lit.length === 1 ? 'its' : 'their'} supporters. Backing isn't buying: see what it gives back.`;
    case 'build': return lit.length ? `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} looking for builders.` : 'Nothing to build here yet, and that seat is open. Your idea could be the next project in this orbit.';
    case 'forming': return `${names(lit)} ${lit.length === 1 ? 'is' : 'are'} still forming, close enough to follow.`;
    case 'pending': return `${names(lit)} haven't set how you come in yet. Ask Pyadra about any of them.`;
  }
  if (phone) return `This is Galaxy: ${say(LOTS.length).toLowerCase()} real projects, grouped by how you can come in. Tap one to meet it.`;
  return `${say(LOTS.length)} real projects, turning slowly. Move over the orbit to stop it and look closer.`;
}
const COUNT_WORDS = ['No', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
const COUNT = COUNT_WORDS[LOTS.length] ?? String(LOTS.length);

/* ---------- pieces ---------- */

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
/** The lots in ring order — what ← → walk through with a project open. */
const RING_LOTS = ITEMS.flatMap((it) => (it.kind === 'lot' ? [it.lot] : []));
/** Desktop panel width + its gap from the edge — the ring steps aside for it. */
const PANEL_SPACE = 456;
const itemId = (it: Item) => (it.kind === 'lot' ? it.lot.id : `seat-${it.way}`);
/** The featured lot starts at the front. */
const START = Math.max(0, ITEMS.findIndex((it) => it.kind === 'lot' && it.lot.featured));

const mod = (n: number, m: number) => ((n % m) + m) % m;
/** The short way round: an offset in [-N/2, N/2). */
const wrap = (o: number) => mod(o + RING_N / 2, RING_N) - RING_N / 2;

/** The ring lies on the floor: a wide ellipse whose bottom edge is nearest
 *  the visitor. Percent of the stage. */
const RING_SHAPE = { rx: 44, ry: 19, cy: 34 };
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
  item, index, pos, isFront, back, preview, state, hidden, onPick,
}: {
  item: Item;
  index: number;
  /** The ring's turn, in steps — a spring, so every node moves with it. */
  pos: MotionValue<number>;
  isFront: boolean;
  state: 'idle' | 'active' | 'dim';
  /** On the far half of the ring — its card opens below it, not above. */
  back: boolean;
  /** Hover cards are on (off while a project is open in the panel). */
  preview: boolean;
  /** Its sphere is still flying in from the Home (components/flight). */
  hidden: boolean;
  onPick: (from: Element) => void;
}) {
  const reduced = useReducedMotion() ?? false;
  const offset = useTransform(pos, (p) => wrap(index - p));
  const left = useTransform(offset, (o) => `${onRing(o).x}%`);
  const top = useTransform(offset, (o) => `${onRing(o).y}%`);
  // under the hand a sphere comes fully forward, so its card sits on top
  const hov = useMotionValue(0);
  const zIndex = useTransform([offset, hov], ([o, h]) => ((h as number) ? 300 : Math.round(onRing(o as number).depth * 100)));
  const k = useTransform(offset, (o) => 0.3 + 0.7 * onRing(o).depth ** 2);
  const size = useTransform(k, (v) => `calc(${v.toFixed(3)} * ${FRONT})`);
  // the sphere's centre, not the button's, sits on the ring
  const lift = useTransform(k, (v) => `calc(${(-v / 2).toFixed(3)} * ${FRONT})`);
  const opacity = useTransform([offset, hov], ([o, h]) => ((h as number) ? 1 : 0.45 + 0.55 * onRing(o as number).depth));
  // the colour arrives only near the front
  const filter = useTransform(offset, (o) => `saturate(${(0.3 + 0.7 * onRing(o).depth ** 6).toFixed(2)})`);
  const glow = useTransform(offset, (o) => 0.6 * onRing(o).depth ** 6);
  const nameOpacity = useTransform(offset, (o) => Math.min(1, Math.max(0, onRing(o).depth * 1.5 - 0.35)));
  const name = item.kind === 'lot' ? item.lot.name : 'Open seat';

  return (
    <motion.div className="absolute pointer-events-auto" style={{ left, top, zIndex, marginTop: lift, opacity, x: '-50%' }}>
      <motion.button
        type="button"
        onClick={(e) => onPick(e.currentTarget)}
        onMouseEnter={() => hov.set(1)}
        onMouseLeave={() => hov.set(0)}
        onFocus={() => hov.set(1)}
        onBlur={() => hov.set(0)}
        aria-label={isFront ? (item.kind === 'lot' ? `${name}: ${item.lot.opportunity}` : 'Open seat: bring your idea') : `Turn the orbit to ${name}`}
        animate={{ opacity: hidden ? 0 : state === 'dim' ? 0.22 : 1 }}
        transition={{ duration: hidden ? 0 : 0.4 }}
        className="group relative flex flex-col items-center bg-transparent border-0 p-0 cursor-pointer rounded-2xl focus:outline-none"
      >
        <motion.span data-orb={item.kind === 'lot' ? item.lot.id : undefined} className="relative block aspect-square" style={{ width: size }}>
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
        {/* the featured lot says where to begin — under its name, clear of the gem */}
        {item.kind === 'lot' && item.lot.featured && isFront && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 whitespace-nowrap font-mono font-bold text-[11px] uppercase tracking-[0.18em] text-accent-deep"
          >
            Start here
          </motion.span>
        )}

        {/* the first look — what it is, on whichever sphere the hand is on.
            No price here: what it costs belongs to the second look
            (FocusPanel), with what it has. */}
        {preview && !hidden && item.kind === 'lot' && state !== 'active' && (
          <span
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 ${back ? 'top-full mt-2 origin-top' : 'bottom-full mb-3 origin-bottom'} w-[260px] overflow-hidden rounded-[18px] bg-white/95 backdrop-blur-xl text-left shadow-[0_20px_50px_-18px_rgba(26,28,26,0.35)] ring-1 ring-ink/6 opacity-0 scale-95 ${back ? '-translate-y-1' : 'translate-y-1'} transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:scale-100 group-focus-visible:translate-y-0`}
          >
            <span aria-hidden className={`absolute -top-12 -right-10 w-32 h-32 rounded-full blur-3xl opacity-50 ${item.lot.glow}`} />
            <span className="relative block p-3.5">
              <span className={`block ${TYPE.label}`}>{item.lot.type} · {item.lot.kind}</span>
              <span className="mt-1 block font-sans text-sm font-semibold text-ink">{item.lot.name}</span>
              <span className="mt-1 block font-serif font-semibold text-[15px] leading-snug text-ink line-clamp-3">{hookOf(item.lot)}</span>
              <span className="mt-2.5 pt-2 block border-t border-ink/6 font-sans text-xs font-semibold text-accent-deep">Click to see what it has</span>
            </span>
          </span>
        )}
      </motion.button>
    </motion.div>
  );
}

/** The line that makes a visitor lean in — the sheet's hook, or the
 *  subtitle until the owner writes one. */
const hookOf = (lot: Lot, sheet: LotSheet = lot.sheet ?? {}) => sheet.hook ?? lot.subtitle;

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

  // The URL is the state: ?way= lights a direction (the Home's verbs land
  // here), ?lot= is the project open in the panel — both survive a reload
  // or a share.
  const search = useSyncExternalStore(subscribeUrl, () => window.location.search, () => '');
  const q = new URLSearchParams(search);
  const way = ARCS.find((a) => a.key === q.get('way'))?.key ?? null;
  const focusAt = RING_LOTS.findIndex((l) => l.id === q.get('lot'));
  const focus = focusAt >= 0 ? RING_LOTS[focusAt] : null;

  // every lot's numbers, read live once for the whole room (live.ts)
  const liveNumbers = useLiveLots(LOTS);

  // one dialog, two doors: an open seat asks for an idea, a lot for a question
  const [dialog, setDialog] = useState<{ copy?: DialogCopy } | null>(null);
  // hover says what it is; a click opens the panel (how you'd come in);
  // the panel — or a second click on the chosen sphere — opens the project
  const openLot = (id: string) => setUrl({ lot: id });
  const closeLot = useCallback(() => setUrl({ lot: null }), []);
  const walk = useCallback((dir: 1 | -1) => {
    if (focusAt < 0) return;
    setUrl({ lot: RING_LOTS[(focusAt + dir + RING_LOTS.length) % RING_LOTS.length].id });
  }, [focusAt]);
  const enterLot = (lot: Lot, from: Element | null) => {
    if (lot.enter_url) zoomTo(from, lot.enter_url);
  };
  const pickWay = (w: WayIn) => setUrl({ way: way === w ? null : w });

  // Arriving from the Home by the flight: the spheres are on their way, so
  // the ring's own stay hidden until they touch down, and nothing here plays
  // an entrance of its own.
  const flight = useFlight();
  const arriving = !!flight && flight.phase !== 'land';
  const [cameByFlight] = useState(() => getFlight() !== null);

  // The ring turns in whole steps. `turn` keeps counting past a full circle
  // so the spring always takes the short way round; the front is turn mod N.
  const [turn, setTurn] = useState(START);
  const front = mod(turn, RING_N);
  const target = useMotionValue(START);
  const spun = useSpring(target, { stiffness: 70, damping: 18, mass: 1 });
  const pos = reduced ? target : spun;
  useEffect(() => {
    // while the spheres fly in, the ring is placed, not turned
    if (getFlight()) {
      target.jump(turn);
      spun.jump(turn);
    } else target.set(turn);
  }, [turn, target, spun]);
  const turnTo = useCallback((i: number) => setTurn((t) => t + wrap(i - mod(t, RING_N))), []);

  // a direction chosen (here, or on the Home) brings its first project round
  useEffect(() => {
    if (!way) return;
    const i = ITEMS.findIndex((it) => it.way === way);
    if (i >= 0) turnTo(i);
  }, [way, turnTo]);

  // an open project turns to the front — a shared ?lot= link arrives with it there
  const focusId = focus?.id ?? null;
  useEffect(() => {
    if (focusId) turnTo(ITEMS.findIndex((it) => itemId(it) === focusId));
  }, [focusId, turnTo]);

  // A hand over the orbit: the glance shows the front project while it's
  // there and folds away when it leaves.
  const [present, setPresent] = useState(false);

  // Nobody there: the orbit turns on its own, one project at a time — within
  // the chosen direction if there is one — and each lights as it arrives.
  const touring = !reduced && !present && !focus && !dialog && !arriving;
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
      if (focusAt >= 0) {
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
  }, [dialog, focusAt, closeLot, walk]);

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

  const pick = (i: number, from: Element) => {
    if (dragged.current) {
      dragged.current = false;
      return;
    }
    const it = ITEMS[i];
    if (it.kind === 'lot') return focus?.id === it.lot.id ? enterLot(it.lot, from) : openLot(it.lot.id);
    if (i !== front) return turnTo(i);
    setDialog({});
  };

  const stageRef = useRef<HTMLDivElement>(null);
  const box = useStageBox(stageRef);

  // with a project open, the ring steps left to leave room for its panel
  const shift = focus && box && box.vw >= 1024 ? -PANEL_SPACE / 2 : 0;

  const nodeState = (it: Item) =>
    focus ? (it.kind === 'lot' && focus.id === it.lot.id ? 'active' : 'dim') : way && it.way !== way ? 'dim' : 'idle';

  // the flight asks where to land: measured from the ring as laid out, with
  // the look each sphere has there, so it arrives already looking like it
  const lifting = flight?.phase === 'lift';
  useEffect(() => {
    if (!lifting || !box || box.vw < 1024) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => {
        const stage = stageRef.current;
        if (!stage) return;
        const to: Record<string, Landing> = {};
        stage.querySelectorAll<HTMLElement>('[data-orb]').forEach((el) => {
          const i = ITEMS.findIndex((it) => itemId(it) === el.dataset.orb);
          if (i < 0) return;
          const r = el.getBoundingClientRect();
          const d = onRing(wrap(i - turn)).depth;
          to[itemId(ITEMS[i])] = {
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
            size: r.width,
            opacity: (0.45 + 0.55 * d) * (way && ITEMS[i].way !== way ? 0.22 : 1),
            saturate: 0.3 + 0.7 * d ** 6,
          };
        });
        const g = stage.querySelector('[data-flight-gem]')?.getBoundingClientRect();
        landAt(to, g ? { x: g.left + g.width / 2, y: g.top + g.height / 2, size: g.width } : null);
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [lifting, box, turn, way]);

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
          animate={{ opacity: focus || arriving ? 0 : 1, y: focus ? -12 : arriving ? -10 : 0 }}
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
              initial={reduced || cameByFlight ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1, x: shift }}
              transition={{ opacity: { duration: 0.6 }, default: SPRING.camera }}
            >
              {/* the field itself — with a project open, a click on it steps back out */}
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
                animate={{ opacity: 1 }}
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
                data-flight-gem
                initial={reduced || cameByFlight ? false : { opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: arriving ? 0 : 1, scale: 1, rotate: 0 }}
                transition={arriving || cameByFlight ? { duration: 0.2 } : { ...SPRING.glide, delay: reduced ? 0 : 0.2 }}
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
                  back={Math.cos((wrap(i - front) / RING_N) * Math.PI * 2) < 0}
                  preview={!focus}
                  state={nodeState(it)}
                  hidden={arriving && it.kind === 'lot'}
                  onPick={(from) => pick(i, from)}
                />
              ))}

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

    {/* the guide — says where you are and what you can do here */}
    {/* ============ the second look ============ */}
    <AnimatePresence>
      {focus && (
        <FocusPanel
          lot={focus}
          numbers={liveNumbers[focus.id] ?? []}
          position={focusAt + 1}
          total={RING_LOTS.length}
          onClose={closeLot}
          onStep={walk}
          onEnter={(from) => enterLot(focus, from)}
          sheetFromBelow={!box || box.vw < 1024}
        />
      )}
    </AnimatePresence>

    {/* the guide — says where you are and what you can do here */}
    <Guide
      path={focus ? ['Pyadra', 'Galaxy', focus.name] : ['Pyadra', 'Galaxy']}
      line={narrate({ way, focus, present, phone: !!box && box.vw < 1024 })}
      offsetRight={focus && box && box.vw >= 1024 ? PANEL_SPACE : 0}
      hidden={!!focus && (!box || box.vw < 1024)}
    />

    <BringIdeaDialog open={dialog !== null} onClose={() => setDialog(null)} copy={dialog?.copy} />

    {/* ============ into the project ============ */}
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
