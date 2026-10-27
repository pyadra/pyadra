'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LOTS, type Lot } from '@/app/exhibitions/galaxy/lots';
import { GemIcon, Sphere } from '@/app/exhibitions/galaxy/Sphere';
import { EASE } from '@/app/components/ui/motion';
import { FLY_S, STAGGER_S, touchDown, useFlight, type FlightSpot, type Landing } from './flight';

/* The spheres in flight between the Home and Galaxy (see flight.ts).
   Mounted once in the root layout, so it survives the page change. */

const travel = (i: number) => ({ duration: FLY_S, ease: EASE.inOut, delay: i * STAGGER_S });

/** Where the spheres drift while Galaxy is still loading: a third of the way
 *  toward the middle of the screen, where the ring will be — so the move
 *  starts at the click, never as a pause. */
const drift = (from: FlightSpot) => {
  const cx = typeof window === 'undefined' ? from.x : window.innerWidth / 2;
  const cy = typeof window === 'undefined' ? from.y : window.innerHeight * 0.56;
  return { left: from.x + (cx - from.x) * 0.3, top: from.y + (cy - from.y) * 0.3 };
};

function FlyingSphere({ lot, index, from, to }: { lot: Lot; index: number; from: FlightSpot; to: Landing | null }) {
  const t = travel(index);
  return (
    <motion.div
      className="absolute"
      style={{ x: '-50%', y: '-50%' }}
      initial={{ left: from.x, top: from.y, width: from.size, height: from.size }}
      // while the page changes underneath they are already on their way;
      // once Galaxy says where, they carry on from wherever they are
      animate={to ? { left: to.x, top: to.y, width: to.size, height: to.size, opacity: to.opacity, scale: 1 } : { ...drift(from), scale: 1.3 }}
      transition={to ? t : { duration: 1.2, ease: EASE.out }}
    >
      {/* a little arc on the way, not a straight slide */}
      <motion.div
        className="relative w-full h-full"
        animate={to ? { y: [0, index % 2 ? -42 : -64, 0] } : undefined}
        transition={t}
      >
        {/* the Home's small glow… */}
        <motion.span
          className={`absolute inset-0 rounded-full shadow-[-2px_3px_6px_rgba(26,28,26,0.18)] ${lot.glow}`}
          animate={to ? { opacity: 0 } : undefined}
          transition={{ ...t, duration: FLY_S * 0.6, delay: index * STAGGER_S + FLY_S * 0.25 }}
        >
          <span className="py-glass" />
        </motion.span>
        {/* …becomes Galaxy's sphere, with its mark */}
        <motion.span
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={to ? { opacity: 1, filter: `saturate(${to.saturate})` } : undefined}
          transition={{ ...t, duration: FLY_S * 0.6, delay: index * STAGGER_S + FLY_S * 0.25 }}
        >
          <Sphere lot={lot} className="w-full h-full shadow-[-10px_14px_24px_rgba(26,28,26,0.16)]" />
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/** The symbol's gem comes down to the heart of the ring and becomes the shop's gem. */
function FlyingGem({ from, to }: { from: FlightSpot; to: FlightSpot | null }) {
  const t = { duration: FLY_S, ease: EASE.inOut, delay: 0.1 };
  return (
    <motion.div
      className="absolute"
      style={{ x: '-50%', y: '-50%' }}
      initial={{ left: from.x, top: from.y, width: from.size, height: from.size, rotate: 0 }}
      animate={to ? { left: to.x, top: to.y, width: to.size, height: to.size, rotate: [0, -24, 0] } : { top: from.y + 40 }}
      transition={t}
    >
      <motion.svg viewBox="88 18 64 74" className="absolute inset-0 w-full h-full overflow-visible" animate={to ? { opacity: 0 } : undefined} transition={{ ...t, duration: FLY_S * 0.5, delay: 0.1 + FLY_S * 0.35 }}>
        <path d="M106,20 L134,20 L150,38 L150,72 L134,90 L106,90 L90,72 L90,38 Z" fill="none" stroke="#059669" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
      <motion.div className="absolute inset-0" initial={{ opacity: 0 }} animate={to ? { opacity: 1 } : undefined} transition={{ ...t, duration: FLY_S * 0.5, delay: 0.1 + FLY_S * 0.4 }}>
        <GemIcon />
      </motion.div>
    </motion.div>
  );
}

export default function FlightLayer() {
  const flight = useFlight();

  // they're all down once the last one has travelled
  const flying = flight?.phase === 'fly';
  const count = flight ? Object.keys(flight.from).length : 0;
  useEffect(() => {
    if (!flying) return;
    const t = setTimeout(touchDown, (FLY_S + STAGGER_S * Math.max(0, count - 1)) * 1000 + 40);
    return () => clearTimeout(t);
  }, [flying, count]);

  return (
    <AnimatePresence>
      {flight && (
        <motion.div
          key="flight"
          aria-hidden
          className="fixed inset-0 z-[95] pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: flight.phase === 'land' ? 0 : 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.25 }}
        >
          {flight.gemFrom && <FlyingGem from={flight.gemFrom} to={flight.gemTo} />}
          {LOTS.filter((l) => flight.from[l.id]).map((lot, i) => (
            <FlyingSphere key={lot.id} lot={lot} index={i} from={flight.from[lot.id]} to={flight.to?.[lot.id] ?? null} />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
