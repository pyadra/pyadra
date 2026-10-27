'use client';

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useSyncExternalStore } from 'react';
import { TYPE } from '@/app/components/ui/type';

/* ------------------------------------------------------------------ */
/*  PYADRA · Guide — the museum's audio guide, in one line.            */
/*                                                                     */
/*  Fixed at the bottom of every room. Left: "You are here" and the    */
/*  path walked so far. Below it, one sentence that tells the visitor  */
/*  what they're looking at and what they can do next — written for    */
/*  the intent they chose on the Home. It speaks word by word when the */
/*  sentence changes, so it reads as someone talking, not a caption.   */
/*  It folds into a dot for visitors who'd rather walk alone.          */
/* ------------------------------------------------------------------ */

const FOLD_KEY = 'pyadra_guide_folded';
const FOLD_EVENT = 'pyadra:guide';

function readFolded() {
  try {
    return window.sessionStorage.getItem(FOLD_KEY) === '1';
  } catch {
    return false;
  }
}

function subscribeFolded(onChange: () => void) {
  window.addEventListener(FOLD_EVENT, onChange);
  return () => window.removeEventListener(FOLD_EVENT, onChange);
}

function setFolded(v: boolean) {
  try {
    window.sessionStorage.setItem(FOLD_KEY, v ? '1' : '0');
  } catch {}
  window.dispatchEvent(new Event(FOLD_EVENT));
}

const Headphones = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
    <rect x="3" y="14" width="4" height="6" rx="1.5" />
    <rect x="17" y="14" width="4" height="6" rx="1.5" />
  </svg>
);

export default function Guide({
  path,
  line,
  offsetRight = 0,
  hidden = false,
  desktopOnly = false,
}: {
  /** Where the visitor is, from the threshold in — e.g. ['Pyadra', 'Galaxy']. */
  path: string[];
  /** What the guide says here. */
  line: string;
  /** Room to leave on the right (a side panel), in px — the guide recentres. */
  offsetRight?: number;
  hidden?: boolean;
  /** Phones get the guide only where it doesn't cover the page's own choices. */
  desktopOnly?: boolean;
}) {
  const folded = useSyncExternalStore(subscribeFolded, readFolded, () => false);
  const reduced = useReducedMotion() ?? false;
  const words = line.split(' ');

  return (
    <div
      className={`fixed inset-x-0 bottom-4 md:bottom-5 z-40 ${desktopOnly ? 'hidden md:flex' : 'flex'} justify-center px-3 pointer-events-none transition-[right] duration-500`}
      style={{ right: offsetRight }}
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {!hidden && (folded ? (
          <motion.button
            key="dot"
            type="button"
            onClick={() => setFolded(false)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur-xl ring-1 ring-ink/8 shadow-lg shadow-ink/8 pl-3 pr-4 py-2 font-sans text-[13px] font-semibold text-ink-soft cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="Open the guide"
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-50" />
              <span className="relative w-2 h-2 rounded-full bg-accent" />
            </span>
            Guide
          </motion.button>
        ) : (
          <motion.div
            key="bar"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 170, damping: 22, delay: 0.1 }}
            className="pointer-events-auto w-full max-w-[600px] flex items-start gap-3 rounded-[22px] bg-white/85 backdrop-blur-xl ring-1 ring-ink/8 shadow-xl shadow-ink/10 pl-4 pr-2 py-3"
          >
            <span className="relative mt-[5px] flex w-2 h-2 shrink-0" aria-hidden>
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-40" />
              <span className="relative w-2 h-2 rounded-full bg-accent" />
            </span>

            <div className="min-w-0 flex-1">
              <p className={`truncate ${TYPE.label}`}>
                You are here ·{' '}
                {path.map((p, i) => (
                  <span key={`${p}-${i}`} className={i === path.length - 1 ? 'text-accent-deep' : ''}>
                    {i > 0 && <span className="opacity-50"> › </span>}
                    {p}
                  </span>
                ))}
              </p>
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={line}
                  className="mt-1 font-sans text-sm font-medium leading-snug text-ink"
                  exit={{ opacity: 0, transition: { duration: 0.12 } }}
                >
                  {reduced
                    ? line
                    : words.map((w, i) => (
                        <motion.span
                          key={`${w}-${i}`}
                          className="inline-block whitespace-pre"
                          initial={{ opacity: 0, y: 3, filter: 'blur(3px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ duration: 0.28, delay: 0.15 + i * 0.028, ease: 'easeOut' }}
                        >
                          {w}{i < words.length - 1 ? ' ' : ''}
                        </motion.span>
                      ))}
                </motion.p>
              </AnimatePresence>
            </div>

            <span className="mt-0.5 text-ink-mute" aria-hidden><Headphones /></span>
            <button
              type="button"
              onClick={() => setFolded(true)}
              aria-label="Fold the guide"
              className="w-7 h-7 shrink-0 rounded-full text-ink-mute hover:bg-paper font-sans text-base leading-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              –
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
