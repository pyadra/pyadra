'use client';

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

/* ------------------------------------------------------------------ */
/*  PYADRA · Magnetic — the main move leans toward the hand.           */
/*                                                                     */
/*  Wrap a primary call to action: as the pointer nears, the button    */
/*  drifts a few pixels toward it and springs back when it leaves. One */
/*  per screen — on everything, it stops meaning "this is the move".   */
/* ------------------------------------------------------------------ */

export default function Magnetic({
  children,
  strength = 0.22,
  className = '',
}: {
  children: React.ReactNode;
  /** Share of the pointer's offset from the centre the element follows. */
  strength?: number;
  className?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.5 });

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div onPointerMove={move} onPointerLeave={leave} style={{ x, y }} className={className}>
      {children}
    </motion.div>
  );
}
