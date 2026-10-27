import { describe, it, expect } from 'vitest';
import { layoutOrbit, RING } from '../orbit';
import { LOTS, type Lot } from '../lots';

const lot = (id: string, wayIn: Lot['wayIn'], stage: Lot['stage'] = 'ready'): Lot => ({
  ...LOTS[0],
  id,
  wayIn,
  stage,
});

describe('layoutOrbit', () => {
  it('places every lot exactly once', () => {
    const { placed } = layoutOrbit(LOTS);
    expect(placed.map((p) => p.lot.id).sort()).toEqual(LOTS.map((l) => l.id).sort());
  });

  it('closes the circle with the sectors', () => {
    const { arcs } = layoutOrbit(LOTS);
    expect(arcs[0].start).toBe(0);
    expect(arcs[arcs.length - 1].end).toBeCloseTo(360);
  });

  it('keeps each lot inside its own sector', () => {
    const { arcs, placed } = layoutOrbit(LOTS);
    for (const p of placed) {
      const arc = arcs.find((a) => a.key === p.lot.wayIn)!;
      expect(p.angle).toBeGreaterThan(arc.start);
      expect(p.angle).toBeLessThan(arc.end);
    }
  });

  it('puts ready lots on the inner ring and forming ones outside', () => {
    const { placed } = layoutOrbit([lot('a', 'acquire'), lot('b', 'forming', 'forming')]);
    const dist = (p: { x: number; y: number }) => Math.hypot(p.x - 50, p.y - 50) / 50;
    expect(dist(placed[0])).toBeCloseTo(RING.ready);
    expect(dist(placed[1])).toBeCloseTo(RING.forming);
  });

  it('drops the pending sector once nothing is waiting in it', () => {
    const { arcs } = layoutOrbit([lot('a', 'acquire')]);
    expect(arcs.some((a) => a.key === 'pending')).toBe(false);
    expect(arcs.some((a) => a.key === 'build')).toBe(true);
  });

  it('adding a lot never needs a layout change', () => {
    const before = layoutOrbit(LOTS).placed.length;
    const after = layoutOrbit([...LOTS, lot('new', 'operate')]).placed.length;
    expect(after).toBe(before + 1);
  });
});

describe('the featured lot', () => {
  it('is at most one, and always a lot with a room to enter', () => {
    const featured = LOTS.filter((l) => l.featured);
    expect(featured.length).toBeLessThanOrEqual(1);
    for (const l of featured) expect(l.enter_url).toBeTruthy();
  });
});
