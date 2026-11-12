import { describe, expect, it } from 'vitest';
import { FAQ, LIMITS, PLANS, STEPS, TIMELINE, planById } from '../offer';

/* The offer is copy that makes promises. These keep it honest with the
   house rules (Company_Master §15) every time it is edited. */
const everyString = [
  ...PLANS.flatMap((p) => [p.name, p.price, p.priceNote, p.time, p.line, ...p.gets]),
  ...STEPS.flatMap((s) => [s.title, s.text]),
  ...LIMITS.flatMap((l) => [l.title, l.text]),
  ...FAQ.flatMap((f) => [f.q, f.a]),
  ...TIMELINE.flatMap((t) => [t.day, t.what]),
];

describe('the studio offer', () => {
  it('has exactly one recommended plan', () => {
    expect(PLANS.filter((p) => p.pick)).toHaveLength(1);
  });

  it('prices every plan in Australian dollars', () => {
    for (const p of PLANS) expect(p.price).toMatch(/^A\$[\d,]+$/);
  });

  it('never uses generic e-commerce language (rule #4)', () => {
    for (const s of everyString) expect(s).not.toMatch(/buy now|add to cart|checkout|\bshop\b/i);
  });

  it('writes no dashes into the copy', () => {
    for (const s of everyString) expect(s).not.toMatch(/[—–]/);
  });

  it('ends the timeline on the day the launch plan promises', () => {
    const launch = planById('launch')!;
    expect(TIMELINE[TIMELINE.length - 1].day).toBe(`Day ${parseInt(launch.time, 10)}`);
  });

  it('resolves a plan from a query value and ignores junk', () => {
    expect(planById('prototype')?.name).toBe('Prototype');
    expect(planById('nope')).toBeUndefined();
    expect(planById(undefined)).toBeUndefined();
  });
});
