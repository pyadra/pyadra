import { describe, expect, it } from 'vitest';
import { LOTS } from '@/app/exhibitions/galaxy/lots';
import { CARRY, CARRY_OFFERS, CARRY_STEPS, CARRY_SUITS, FAQ, HOME, LEDGER, OCCASIONS, PIECES, PLAIN, ROOM, SETS, SPLIT, STEPS, WORKSHOP_DOOR, aud, pieceById, priceFor } from '../house';
import { daysUntil, fromRow, isOpen, longDate, sampleExhibition, seal, type Exhibition } from '../exhibition';
import { cleanVia, withVia } from '../via';

/* The house's copy makes promises and its numbers are money. These keep
   both honest with the house rules every time the file is edited. */
const everyString = [
  ...Object.values(HOME),
  ...Object.values(ROOM),
  ...Object.values(CARRY),
  ...PIECES.flatMap((p) => [p.name, p.time, p.line, p.made, p.send, p.fine ?? '']),
  ...SETS.flatMap((s) => [s.name, s.line]),
  ...STEPS.flatMap((s) => [s.title, s.text]),
  ...CARRY_STEPS.flatMap((s) => [s.title, s.text]),
  ...CARRY_SUITS.flatMap((s) => [s.title, s.text]),
  ...CARRY_OFFERS.flatMap((o) => [o.what, o.share]),
  ...PLAIN.flatMap((p) => [p.title, p.text]),
  ...FAQ.flatMap((f) => [f.q, f.a]),
  ...OCCASIONS,
  ...[LEDGER.label, LEDGER.headline, LEDGER.lead, LEDGER.rooms.one, LEDGER.rooms.many, LEDGER.roomsNote, LEDGER.splitTitle, LEDGER.splitNote],
  ...[WORKSHOP_DOOR.label, WORKSHOP_DOOR.title, WORKSHOP_DOOR.text, WORKSHOP_DOOR.cta, ...Object.values(WORKSHOP_DOOR.dialog)],
];

describe('the house offer', () => {
  it('never uses generic e-commerce language (rule #4)', () => {
    for (const s of everyString) expect(s).not.toMatch(/buy now|add to cart|checkout|\bshop\b/i);
  });

  it('writes no dashes into the copy', () => {
    for (const s of everyString) expect(s).not.toMatch(/[—–]/);
  });

  it('claims no reviews, ratings or popularity it cannot have yet', () => {
    for (const s of everyString) expect(s).not.toMatch(/★|best[- ]seller|most (chosen|popular|loved)|loved by|\d+\s*(reviews|customers)/i);
  });

  it('splits every piece into exactly one hundred', () => {
    expect(SPLIT.workshop + SPLIT.carrier + SPLIT.house).toBe(100);
  });

  it('makes every piece in a workshop that exists in Galaxy', () => {
    for (const p of PIECES) expect(LOTS.some((l) => l.id === p.workshop)).toBe(true);
    for (const o of CARRY_OFFERS) expect(LOTS.some((l) => l.id === o.lot)).toBe(true);
  });

  it('prices a single piece at its own price', () => {
    expect(priceFor(['letter'])).toEqual({ total: pieceById('letter')!.price, set: null });
  });

  it('prices a set below the sum of its pieces', () => {
    for (const s of SETS) {
      const sum = s.pieces.reduce((t, id) => t + pieceById(id)!.price, 0);
      expect(s.price).toBeLessThan(sum);
      expect(priceFor(s.pieces).total).toBe(s.price);
      expect(priceFor([...s.pieces].reverse()).set?.id).toBe(s.id);
    }
  });

  it('sums pieces that are not a set, and ignores unknown or repeated ones', () => {
    const song = pieceById('song')!.price;
    const fig = pieceById('figurine')!.price;
    expect(priceFor(['song', 'figurine']).total).toBe(song + fig);
    expect(priceFor(['song', 'song', 'nope']).total).toBe(song);
    expect(priceFor([]).total).toBe(0);
  });

  it('formats money as Australian dollars', () => {
    expect(aud(9)).toBe('A$9');
    expect(aud(1200)).toBe('A$1,200');
    expect(aud(7.8)).toBe('A$7.80');
    expect(aud(21.45)).toBe('A$21.45');
  });
});

describe('a sealed letter', () => {
  const now = new Date('2026-11-12T10:00:00Z');
  const room = (opensAt: string): Exhibition => ({
    slug: 'x',
    forName: 'X',
    dedication: '',
    from: '',
    openedOn: '2026-11-12',
    number: 7,
    carriedBy: null,
    sample: false,
    pieces: [
      { kind: 'song', title: 't', note: '', src: 'https://example.com/a.mp3', duration: '1:00' },
      { kind: 'letter', from: 'A', opensAt, body: 'the words', sealed: true },
    ],
  });
  const letterOf = (e: Exhibition) => e.pieces.find((p) => p.kind === 'letter') as Extract<Exhibition['pieces'][number], { kind: 'letter' }>;

  it('keeps its words on the server before its day', () => {
    const l = letterOf(seal(room('2026-11-13'), now));
    expect(l.sealed).toBe(true);
    expect(l.body).toBeNull();
    expect(JSON.stringify(seal(room('2026-11-13'), now))).not.toContain('the words');
  });

  it('opens on its day and after', () => {
    for (const day of ['2026-11-12', '2025-01-01']) {
      const l = letterOf(seal(room(day), now));
      expect(l.sealed).toBe(false);
      expect(l.body).toBe('the words');
    }
  });

  it('stays shut when its date cannot be read', () => {
    expect(isOpen('not a date', now)).toBe(false);
    expect(letterOf(seal(room('soon'), now)).body).toBeNull();
  });

  it('leaves the other pieces as they are', () => {
    expect(seal(room('2030-01-01'), now).pieces[0]).toEqual(room('2030-01-01').pieces[0]);
  });

  it('counts whole days and never goes below zero', () => {
    expect(daysUntil('2026-11-12', now)).toBe(0);
    expect(daysUntil('2026-11-13', now)).toBe(1);
    expect(daysUntil('2027-11-12', now)).toBe(365);
    expect(daysUntil('2020-01-01', now)).toBe(0);
  });

  it('writes a date the way the wall label reads', () => {
    expect(longDate('2027-05-09')).toBe('9 May 2027');
  });
});

describe('the sample room', () => {
  const now = new Date('2026-11-12T10:00:00Z');

  it('is labelled as a sample and always has a seal to show', () => {
    const s = seal(sampleExhibition(now), now);
    const letter = s.pieces.find((p) => p.kind === 'letter');
    expect(s.sample).toBe(true);
    expect(letter && letter.kind === 'letter' && letter.sealed).toBe(true);
    expect(letter && letter.kind === 'letter' && daysUntil(letter.opensAt, now)).toBeGreaterThan(120);
  });

  it('has one piece from each workshop', () => {
    expect(sampleExhibition(now).pieces.map((p) => p.kind).sort()).toEqual(PIECES.map((p) => p.id).sort());
  });
});

describe('a room from the database', () => {
  const base = { slug: 'elena-x7k2p9q4', for_name: 'Elena', dedication: null, from_name: 'Her daughters', opened_on: '2026-12-01', number: 12, carried_by: null };

  it('keeps well formed pieces and drops the rest', () => {
    const e = fromRow({
      ...base,
      pieces: [
        { kind: 'song', title: 'Hers', src: 'https://files.example/a.mp3', duration: '3:01' },
        { kind: 'song', src: 'javascript:alert(1)' },
        { kind: 'letter', from: 'Ana', opensAt: '2027-05-09', body: 'Hola' },
        { kind: 'letter', from: 'Ana', opensAt: 'May', body: 'Hola' },
        { kind: 'figurine', image: 'http://insecure.example/a.png' },
        { kind: 'figurine', image: '//elsewhere.example/a.png' },
        'nonsense',
        null,
      ],
    });
    expect(e.pieces.map((p) => p.kind)).toEqual(['song', 'letter']);
    expect(e.sample).toBe(false);
    expect(e.forName).toBe('Elena');
  });

  it('never trusts a preview from a stored row', () => {
    const e = fromRow({ ...base, pieces: [{ kind: 'letter', from: 'A', opensAt: '2099-01-01', body: 'secret', preview: 'secret' }] });
    const sealed = seal(e, new Date('2026-11-12T00:00:00Z'));
    expect(JSON.stringify(sealed)).not.toContain('secret');
  });

  it('survives pieces that are not a list', () => {
    expect(fromRow({ ...base, pieces: 'oops' }).pieces).toEqual([]);
  });
});

describe('a carrier code', () => {
  it('accepts the codes the house writes', () => {
    expect(cleanVia('Flores-Perth')).toBe('flores-perth');
    expect(cleanVia(' ana7 ')).toBe('ana7');
  });

  it('refuses anything else', () => {
    for (const bad of ['', 'a', '-ana', 'ana-', 'a b', '<script>', 'x'.repeat(30), null, 7]) expect(cleanVia(bad)).toBeNull();
  });

  it('travels on links inside the house only', () => {
    expect(withVia('/commission', 'ana7')).toBe('/commission?via=ana7');
    expect(withVia('/commission?piece=song', 'ana7')).toBe('/commission?piece=song&via=ana7');
    expect(withVia('/#pieces', 'ana7')).toBe('/?via=ana7#pieces');
    expect(withVia('https://example.com', 'ana7')).toBe('https://example.com');
    expect(withVia('/commission', null)).toBe('/commission');
  });
});
