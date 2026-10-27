import { describe, it, expect } from 'vitest';
import { INTENTS, galaxyHref } from '../intent';
import { SECTORS } from '@/app/exhibitions/galaxy/lots';

describe('intents', () => {
  it('every intent with a way lands on a real sector of the orbit', () => {
    for (const i of INTENTS) {
      if (i.way) expect(SECTORS.some((s) => s.key === i.way)).toBe(true);
    }
  });

  it('lights the sector the visitor chose, and the whole orbit for "just looking"', () => {
    expect(galaxyHref('own')).toBe('/exhibitions/galaxy?way=acquire');
    expect(galaxyHref('idea')).toBe('/exhibitions/galaxy?way=build');
    expect(galaxyHref('look')).toBe('/exhibitions/galaxy');
  });
});
