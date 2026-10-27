'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TYPE } from '@/app/components/ui/type';
import { EASE, SPRING } from '@/app/components/ui/motion';
import CountUp from '@/app/components/ui/CountUp';
import { Sphere } from './Sphere';
import { ROOMS } from './rooms';
import type { Lot, LotNumber } from './lots';

/* ------------------------------------------------------------------ */
/*  The second look at a project — what a click on a sphere opens.     */
/*                                                                     */
/*  Three steps, each saying something new:                            */
/*   hover  → what it is: kind, name, hook, "From $…" (on the sphere)  */
/*   click  → how you'd come in (this panel): the proof in numbers,    */
/*            who it suits, the ways in with their prices, who keeps   */
/*            what — and the door to the project                       */
/*   open   → everything (the project's dashboard)                     */
/* ------------------------------------------------------------------ */

const rise = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE.out } },
};

/** At most this many ways in here; the rest wait on the dashboard. */
const WAYS_SHOWN = 3;

export default function FocusPanel({
  lot, numbers, position, total, onClose, onStep, onEnter, sheetFromBelow,
}: {
  lot: Lot;
  numbers: LotNumber[];
  position: number;
  total: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
  onEnter: (from: Element | null) => void;
  /** Phones: the panel is a sheet and rises from the bottom edge. */
  sheetFromBelow: boolean;
}) {
  const room = ROOMS[lot.id];
  const sheet = lot.sheet ?? {};
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const ways = room?.ways;
  const shown = ways?.options.slice(0, WAYS_SHOWN) ?? [];
  const more = (ways?.options.length ?? 0) - shown.length;
  const wayLabel = ways ? { acquire: 'Ways in', operate: 'Ways in', support: 'Ways to back it', forming: 'How to follow it' }[ways.kind] : 'Ways in';

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
  }, []);

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
          aria-labelledby="focus-title"
          initial={sheetFromBelow ? { opacity: 0, y: 80 } : { opacity: 0, x: 56, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          exit={sheetFromBelow ? { opacity: 0, y: 60, transition: { duration: 0.25, ease: EASE.inOut } } : { opacity: 0, x: 40, scale: 0.97, transition: { duration: 0.25, ease: EASE.inOut } }}
          transition={SPRING.glide}
          className="relative pointer-events-auto w-full max-h-full overflow-hidden rounded-[28px] bg-white/92 backdrop-blur-2xl ring-1 ring-ink/6 shadow-[0_40px_100px_-30px_rgba(26,28,26,0.35)] flex flex-col"
        >
          {/* the project's colour, as light from the top corner */}
          <AnimatePresence initial={false}>
            <motion.span
              key={lot.id}
              aria-hidden
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.7, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: EASE.out }}
              className={`pointer-events-none absolute -top-28 -right-20 w-80 h-80 rounded-full blur-3xl ${lot.glow}`}
            />
          </AnimatePresence>

          {/* walk the orbit */}
          <div className="relative flex items-center justify-between px-5 pt-4 shrink-0">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => onStep(-1)} aria-label="Previous project" className="w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer text-ink-soft hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">←</button>
              <button type="button" onClick={() => onStep(1)} aria-label="Next project" className="w-8 h-8 rounded-full bg-transparent border-0 cursor-pointer text-ink-soft hover:bg-paper focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">→</button>
              <span className={`ml-1 ${TYPE.label}`}>{String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
            </div>
            <button ref={closeRef} type="button" onClick={onClose} aria-label="Back to the orbit" className="w-8 h-8 rounded-full bg-paper border-0 cursor-pointer text-ink-soft hover:bg-[#E2E6E2] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">×</button>
          </div>

          <div className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 lg:px-7 pb-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={lot.id}
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.04 } } }}
              >
                {/* who — short: the hover already said what it is */}
                <motion.div variants={rise} className="flex items-center gap-3 pt-3">
                  <Sphere lot={lot} className="lg:hidden w-12 h-12 shrink-0 shadow-[-6px_6px_14px_rgba(0,0,0,0.12)]" />
                  <div className="min-w-0">
                    <h2 id="focus-title" className={TYPE.title}>{lot.name}</h2>
                    <p className="mt-1 inline-flex items-center gap-1.5 font-mono font-bold text-[11px] uppercase tracking-[0.14em] text-accent-deep">
                      <span aria-hidden className={`w-1.5 h-1.5 rounded-full ${lot.stage === 'ready' ? 'bg-accent' : 'border border-accent'}`} />
                      {room?.status ?? lot.opportunity}
                    </p>
                  </div>
                </motion.div>

                {/* the proof */}
                {numbers.length > 0 && (
                  <motion.div variants={rise} className="mt-5 grid grid-cols-3 gap-2">
                    {numbers.slice(0, 3).map((n, i) => (
                      <div key={`${n.label}-${i}`} className="rounded-2xl ring-1 ring-ink/8 bg-white/70 px-3 py-2.5 min-w-0">
                        <p className="font-serif font-semibold text-xl leading-none text-ink tabular-nums"><CountUp value={n.value} /></p>
                        <p className="mt-1 font-sans text-xs leading-snug text-ink-soft">{n.label}</p>
                        {n.evidence && <p className="mt-1.5 font-mono font-bold text-[10px] uppercase tracking-[0.1em] text-ink-mute">{n.evidence}</p>}
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* who it suits */}
                {sheet.idealFor?.length ? (
                  <motion.div variants={rise} className="mt-5">
                    <p className={TYPE.label}>Ideal for</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {sheet.idealFor.map((x) => (
                        <span key={x} className="rounded-full bg-paper px-3 py-1 font-sans text-[13px] font-medium text-ink-soft">{x}</span>
                      ))}
                    </div>
                  </motion.div>
                ) : null}

                {/* how you'd come in */}
                {shown.length > 0 && (
                  <motion.div variants={rise} className="mt-5">
                    <p className={TYPE.label}>{wayLabel}</p>
                    <ul className="mt-2 flex flex-col gap-1.5 list-none p-0 m-0">
                      {shown.map((o) => (
                        <li key={o.name} className="grid grid-cols-[1fr_auto] items-center gap-x-3 rounded-2xl bg-paper/80 px-3.5 py-2.5">
                          <span className="min-w-0">
                            <span className="block font-sans text-sm font-semibold text-ink">{o.name}</span>
                            <span className="block font-sans text-xs leading-snug text-ink-soft">{o.terms}</span>
                          </span>
                          <span className="font-mono font-bold text-[13px] text-accent-deep whitespace-nowrap">{o.price}</span>
                        </li>
                      ))}
                    </ul>
                    {more > 0 && <p className={`mt-1.5 ${TYPE.small}`}>+{more} more on its page.</p>}
                  </motion.div>
                )}

                {/* who keeps what */}
                {ways?.after.length ? (
                  <motion.div variants={rise} className="mt-5">
                    <p className={TYPE.label}>After the deal</p>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {ways.after.map((a) => (
                        <div key={a.who} className="grid grid-cols-[64px_1fr] gap-2">
                          <span className="font-sans text-[13px] font-semibold text-ink">{a.who}</span>
                          <span className={TYPE.small}>{a.what}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* the door */}
          <div className="relative shrink-0 border-t border-ink/6 bg-white/80 px-6 lg:px-7 pt-3.5 pb-4 grid gap-1">
            <button
              type="button"
              onClick={() => onEnter(panelRef.current)}
              className="py-sheen group/cta w-full inline-flex items-center justify-center gap-2 rounded-full bg-ink text-white px-7 py-3.5 font-sans text-sm font-semibold border-0 cursor-pointer shadow-[0_14px_30px_-12px_rgba(26,28,26,0.55)] hover:bg-accent-deep transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Open the project
              <span aria-hidden className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
            </button>
            {sheet.live ? (
              <a
                href={sheet.live.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-full px-7 py-2 font-sans text-[13px] font-semibold text-accent-deep no-underline hover:bg-accent/8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                Visit {sheet.live.label} <span aria-hidden>↗</span>
              </a>
            ) : null}
          </div>
        </motion.aside>
      </div>
    </>
  );
}
