import { SECTORS, type Lot, type Stage, type WayIn } from './lots';

/* ------------------------------------------------------------------ */
/*  The orbit as an instrument.                                        */
/*                                                                     */
/*  angle  = how you come in (the sector of the lot's `wayIn`)         */
/*  radius = how ready it is (ready on the inner ring, forming outer)  */
/*                                                                     */
/*  Sectors are sized by how many lots they hold, so a crowded way in  */
/*  gets a wider slice instead of stacking spheres. An empty sector    */
/*  keeps one seat's slice — the door exists, nobody is behind it yet — */
/*  except `pending`, which only shows while something is in it.      */
/* ------------------------------------------------------------------ */

/** Ring radii as a fraction of the field's half-width / half-height. */
export const RING: Record<Stage, number> = { ready: 0.74, forming: 1 };

/** Width / height of the field the spheres are placed in — a landscape
 *  canvas sized to fit one screen (page.tsx, the orbit stage). */
export const FIELD = { w: 1000, h: 600 };

/** The footprint of one node — sphere and name — in field units. */
const CARD = { w: 140, h: 110 };

const EMPTY_WEIGHT = 1;

export type Arc = { key: WayIn; label: string; start: number; end: number };
export type Placed = { lot: Lot; angle: number; x: number; y: number };

/* Equal angles would crowd the spheres wherever the ring runs along a
   card's long side. Angles are read as a share of the ring's length,
   measured in card sizes instead: the order and the sectors stay the
   same, and neighbours sit about the same number of cards apart. */
const SAMPLES = 720;
const ARC_LENGTH = (() => {
  const a = (FIELD.w / CARD.w) / (FIELD.h / CARD.h);
  const out = [0];
  for (let i = 1; i <= SAMPLES; i++) {
    const t0 = (2 * Math.PI * (i - 1)) / SAMPLES;
    const t1 = (2 * Math.PI * i) / SAMPLES;
    out.push(out[i - 1] + Math.hypot(a * (Math.sin(t1) - Math.sin(t0)), Math.cos(t1) - Math.cos(t0)));
  }
  return out;
})();

/** Degrees clockwise from twelve o'clock → % of the field. */
export function toPoint(angle: number, ring: number) {
  const target = (angle / 360) * ARC_LENGTH[SAMPLES];
  let i = 1;
  while (i < SAMPLES && ARC_LENGTH[i] < target) i++;
  const f = (target - ARC_LENGTH[i - 1]) / (ARC_LENGTH[i] - ARC_LENGTH[i - 1] || 1);
  const t = (2 * Math.PI * (i - 1 + f)) / SAMPLES;
  // rounded so the server and the browser print the same style string
  const round = (v: number) => Math.round(v * 1000) / 1000;
  return { x: round(50 + 50 * ring * Math.sin(t)), y: round(50 - 50 * ring * Math.cos(t)) };
}

export function layoutOrbit(lots: Lot[]): { arcs: Arc[]; placed: Placed[] } {
  const sectors = SECTORS.map((s) => ({ ...s, lots: lots.filter((l) => l.wayIn === s.key) })).filter(
    (s) => s.lots.length > 0 || s.key !== 'pending',
  );
  const weights = sectors.map((s) => (s.lots.length > 0 ? s.lots.length : EMPTY_WEIGHT));
  const total = weights.reduce((a, b) => a + b, 0);

  const arcs: Arc[] = [];
  const placed: Placed[] = [];
  let start = 0;
  sectors.forEach((s, i) => {
    const span = (weights[i] / total) * 360;
    arcs.push({ key: s.key, label: s.label, start, end: start + span });
    s.lots.forEach((lot, j) => {
      const angle = start + (span * (j + 0.5)) / s.lots.length;
      placed.push({ lot, angle, ...toPoint(angle, RING[lot.stage]) });
    });
    start += span;
  });
  return { arcs, placed };
}
