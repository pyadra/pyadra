'use client';

import { useEffect, useState } from 'react';
import type { LiveKey, LotNumber } from './lots';

/* Numbers that read live (non-negotiable #7). A number in lots.ts names
   its source with `live`; until the source answers — or if it can't —
   the number shows its written `value`, which is the last known figure. */

type Source = 'airtasker' | 'orbit';
const SOURCE: Record<LiveKey, Source> = {
  'airtasker.tasks': 'airtasker',
  'orbit.episodes': 'orbit',
  'orbit.raised': 'orbit',
  'orbit.goal': 'orbit',
};

const aud = (n: number) => `$${n.toLocaleString('en-AU')}`;

async function read(source: Source): Promise<Partial<Record<LiveKey, string>>> {
  if (source === 'airtasker') {
    const r = await fetch('/api/airtasker-stats');
    if (!r.ok) throw new Error(`airtasker-stats ${r.status}`);
    const d: { tasks?: number } = await r.json();
    return typeof d.tasks === 'number' ? { 'airtasker.tasks': String(d.tasks) } : {};
  }
  const r = await fetch('/api/stats/orbit-fund');
  if (!r.ok) throw new Error(`orbit-fund ${r.status}`);
  const d: { total?: number; goal?: number; episodes_live?: number } = await r.json();
  const out: Partial<Record<LiveKey, string>> = {};
  if (typeof d.episodes_live === 'number') out['orbit.episodes'] = String(d.episodes_live);
  if (typeof d.total === 'number') out['orbit.raised'] = aud(d.total);
  if (typeof d.goal === 'number') out['orbit.goal'] = aud(d.goal);
  return out;
}

/** The numbers with their live values filled in, once they arrive. */
export function useLiveNumbers(numbers: LotNumber[] | undefined): LotNumber[] {
  const [live, setLive] = useState<Partial<Record<LiveKey, string>>>({});
  const sources = [...new Set((numbers ?? []).flatMap((n) => (n.live ? [SOURCE[n.live]] : [])))].sort().join(',');

  useEffect(() => {
    if (!sources) return;
    let cancelled = false;
    for (const s of sources.split(',') as Source[]) {
      read(s)
        .then((v) => !cancelled && setLive((prev) => ({ ...prev, ...v })))
        .catch((err) => console.warn('[galaxy] live numbers unavailable, showing the last known', err));
    }
    return () => {
      cancelled = true;
    };
  }, [sources]);

  return (numbers ?? []).map((n) => (n.live && live[n.live] ? { ...n, value: live[n.live]! } : n));
}

/** Orbit's Season 2 progress, 0–1, when both figures are known. */
export function progressOf(numbers: LotNumber[]): number | null {
  const num = (k: LiveKey) => {
    const v = numbers.find((n) => n.live === k)?.value;
    return v ? Number(v.replace(/[^\d.]/g, '')) : NaN;
  };
  const raised = num('orbit.raised');
  const goal = num('orbit.goal');
  return goal > 0 && raised >= 0 ? Math.min(raised / goal, 1) : null;
}

/** Every lot's numbers, live — one read per source for the whole room. */
export function useLiveLots(lots: { id: string; sheet?: { numbers?: LotNumber[] } }[]): Record<string, LotNumber[]> {
  const flat = lots.flatMap((l) => l.sheet?.numbers ?? []);
  const live = useLiveNumbers(flat);
  const out: Record<string, LotNumber[]> = {};
  let at = 0;
  for (const l of lots) {
    const n = l.sheet?.numbers?.length ?? 0;
    out[l.id] = live.slice(at, at + n);
    at += n;
  }
  return out;
}
