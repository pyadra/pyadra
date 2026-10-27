/* ------------------------------------------------------------------ */
/*  PYADRA · Motion — one way of moving across the museum.             */
/*                                                                     */
/*  Like type.ts for words: pages compose these instead of inventing   */
/*  their own curves, so every room settles the same way.              */
/*                                                                     */
/*  out      things arriving — fast start, long soft landing           */
/*  inOut    doors and cameras — a deliberate push                     */
/*  snap     small things answering a hand (hover, press)              */
/*  glide    big things moving into place (panels, the orbit)          */
/*  camera   the Galaxy camera — heavy, never bouncy                   */
/* ------------------------------------------------------------------ */

export const EASE = {
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
};

export const SPRING = {
  snap: { type: 'spring' as const, stiffness: 420, damping: 30, mass: 0.6 },
  glide: { type: 'spring' as const, stiffness: 170, damping: 24, mass: 0.9 },
  camera: { type: 'spring' as const, stiffness: 70, damping: 20, mass: 1 },
};

/** A child of a staggered list rising into place — opacity, a short lift
 *  and a blur that clears, the museum's one entrance. */
export const RISE = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE.out } },
};
