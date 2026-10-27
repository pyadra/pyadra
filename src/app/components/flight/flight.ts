'use client';

import { useSyncExternalStore } from 'react';

/* ------------------------------------------------------------------ */
/*  The flight — the Home's orbit becoming Galaxy's ring.              */
/*                                                                     */
/*  The nine spheres circling the symbol on the Home are the same      */
/*  projects as the ring in Galaxy, so they don't disappear between    */
/*  the two: the Home hands their places to a layer that outlives the  */
/*  page change (FlightLayer, in the root layout) and steps back;      */
/*  Galaxy, once laid out, says where each one lands; the spheres fly  */
/*  there, and Galaxy takes over the moment they touch down.           */
/*                                                                     */
/*  lift → the Home measured its spheres; they hold still while the    */
/*         page changes underneath.                                    */
/*  fly  → Galaxy measured its ring; they travel.                      */
/*  land → they're there; Galaxy shows its own and the layer fades.    */
/* ------------------------------------------------------------------ */

/** A sphere's centre and diameter, in viewport pixels. */
export type FlightSpot = { x: number; y: number; size: number };
/** Where a sphere lands — and how it looks there, so it arrives already
 *  looking like Galaxy's own (dimmed, muted) and nothing jumps. */
export type Landing = FlightSpot & { opacity: number; saturate: number };

export type Flight = {
  phase: 'lift' | 'fly' | 'land';
  from: Record<string, FlightSpot>;
  gemFrom: FlightSpot | null;
  to: Record<string, Landing> | null;
  gemTo: FlightSpot | null;
};

/** How long the trip reads — the path itself is a spring (FlightLayer) —
 *  and the small offset between spheres changing size and colour. */
export const FLY_S = 0.75;
export const STAGGER_S = 0.02;
/** If Galaxy never says where to land, the layer lets go after this. */
const GIVE_UP_MS = 3500;

let current: Flight | null = null;
let giveUp: ReturnType<typeof setTimeout> | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** The Home: these are my spheres, right now. */
export function liftOff(from: Record<string, FlightSpot>, gemFrom: FlightSpot | null) {
  current = { phase: 'lift', from, gemFrom, to: null, gemTo: null };
  if (giveUp) clearTimeout(giveUp);
  giveUp = setTimeout(endFlight, GIVE_UP_MS);
  emit();
}

/** Galaxy: this is where each one goes. */
export function landAt(to: Record<string, Landing>, gemTo: FlightSpot | null) {
  if (current?.phase !== 'lift') return;
  current = { ...current, phase: 'fly', to, gemTo };
  emit();
}

/** The layer: they're all there. */
export function touchDown() {
  if (current?.phase !== 'fly') return;
  current = { ...current, phase: 'land' };
  emit();
  setTimeout(endFlight, 320);
}

export function endFlight() {
  if (giveUp) clearTimeout(giveUp);
  giveUp = null;
  current = null;
  emit();
}

export const getFlight = () => current;

export function useFlight(): Flight | null {
  return useSyncExternalStore(subscribe, getFlight, () => null);
}
