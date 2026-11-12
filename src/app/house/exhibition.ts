/* ------------------------------------------------------------------ */
/*  PYADRA · An exhibition of one — the shape of a room and the one    */
/*  rule it keeps: a sealed letter never leaves the server before its  */
/*  day.                                                               */
/*                                                                     */
/*  Pure functions only, so the rule can be tested without a database. */
/*  `store.ts` reads a room; `seal()` decides what a visitor may see.  */
/* ------------------------------------------------------------------ */

export type SongPiece = {
  kind: 'song';
  /** As it reads on the wall label. */
  title: string;
  /** One line under the title. */
  note: string;
  /** The audio file. */
  src: string;
  /** "2:43" */
  duration: string;
};

export type LetterPiece = {
  kind: 'letter';
  /** Who left it, as it reads: "Her son". */
  from: string;
  /** The day it opens, ISO date (YYYY-MM-DD). */
  opensAt: string;
  /** The words. null while sealed: the server never sends them early. */
  body: string | null;
  sealed: boolean;
  /** Sample rooms only: lets a visitor watch a seal break. Never set
   *  from the database. */
  preview?: string;
};

export type FigurinePiece = {
  kind: 'figurine';
  image: string;
  /** What the picture is, said honestly (a render is called a render). */
  caption: string;
};

export type Piece = SongPiece | LetterPiece | FigurinePiece;

export type Exhibition = {
  slug: string;
  /** The name on the wall. */
  forName: string;
  /** One line under the name. */
  dedication: string;
  /** Who commissioned it, as it reads. */
  from: string;
  /** The day the room opened, ISO date. */
  openedOn: string;
  /** The admission number on the ticket. */
  number: number;
  pieces: Piece[];
  /** The carrier whose code brought it, if any. */
  carriedBy: string | null;
  /** True for the house's own example: labelled on every screen. */
  sample: boolean;
};

const DAY = 86_400_000;
const isoDay = (d: Date) => d.toISOString().slice(0, 10);

/** Whole days from `now` until the start of `iso` (UTC). Never negative. */
export function daysUntil(iso: string, now: Date): number {
  const target = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(target)) return 0;
  const today = Date.parse(`${isoDay(now)}T00:00:00Z`);
  return Math.max(0, Math.round((target - today) / DAY));
}

/** A letter is open from the first moment of its day (UTC). An
 *  unreadable date keeps it shut: failing closed is the safe side. */
export function isOpen(iso: string, now: Date): boolean {
  const target = Date.parse(`${iso}T00:00:00Z`);
  return !Number.isNaN(target) && now.getTime() >= target;
}

/** What a visitor may see today. Letters whose day has not come lose
 *  their words here, on the server, before anything is sent. */
export function seal(exhibition: Exhibition, now: Date): Exhibition {
  return {
    ...exhibition,
    pieces: exhibition.pieces.map((p) => {
      if (p.kind !== 'letter') return p;
      const open = isOpen(p.opensAt, now);
      return { ...p, sealed: !open, body: open ? p.body : null };
    }),
  };
}

/** "9 May 2027" */
export function longDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

/** "12 Nov" — for the ticket stub. */
export function shortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/* ------------------------------------------------------------------ */
/*  The sample room                                                    */
/*                                                                     */
/*  Built from the workshops' own examples, and labelled as a sample   */
/*  on every screen: the song is one of Momentos Eternos' published    */
/*  samples (its own description: a vallenato for a doctor on her      */
/*  birthday), the figure is Figuitoon's reference model "Doctor".     */
/*  The letter and the people are written for the example.             */
/*                                                                     */
/*  TODO (owner) before `main`: host the song in the house's own       */
/*  storage. It is played from the instrument provider's address, the  */
/*  same one momentoseternos uses for its samples.                     */
/* ------------------------------------------------------------------ */

export const SAMPLE_SLUG = 'la-doctora';

const SAMPLE_LETTER =
  'Mamá:\n\n' +
  'When you read this it will be your birthday again, and I will probably be far away again. ' +
  'So I am leaving this here, where the distance cannot touch it.\n\n' +
  'You studied at night so that we could sleep without worrying. I did not understand it then. I do now.\n\n' +
  'Play the song once more today. I asked them to put the accordion first, the way you like it.\n\n' +
  'Your son.';

/** The sample's letter always opens a few months from the day you look,
 *  so the seal and the countdown are always there to see. */
export function sampleExhibition(now: Date): Exhibition {
  const opens = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 6, 9));
  return {
    slug: SAMPLE_SLUG,
    forName: 'La doctora',
    dedication: 'A birthday, kept.',
    from: 'Her son, in Perth',
    openedOn: isoDay(now),
    number: 1,
    carriedBy: null,
    sample: true,
    pieces: [
      {
        kind: 'song',
        title: 'A vallenato for her birthday',
        note: 'Written for a doctor, on her birthday. In Spanish.',
        src: 'https://cdn.musicgpt.com/conversions/web/standard/f73b3b59-e61c-44c0-927e-642cdfff296c/f73b3b59-e61c-44c0-927e-642cdfff296c.mp3',
        duration: '2:43',
      },
      {
        kind: 'letter',
        from: 'Her son',
        opensAt: isoDay(opens),
        body: SAMPLE_LETTER,
        sealed: true,
        preview: SAMPLE_LETTER,
      },
      {
        kind: 'figurine',
        image: '/images/house/figurine-doctor.jpg',
        caption: 'The workshop’s reference model, “Doctor”. Hers is printed in four colours with a head made from her photo.',
      },
    ],
  };
}

/* ------------------------------------------------------------------ */
/*  From the database                                                  */
/* ------------------------------------------------------------------ */

/** A row of `pyadra_exhibitions` (migration 0009). `pieces` is JSON
 *  written by hand in the Table Editor, so nothing in it is trusted. */
export type ExhibitionRow = {
  slug: string;
  for_name: string;
  dedication: string | null;
  from_name: string | null;
  opened_on: string;
  number: number;
  carried_by: string | null;
  pieces: unknown;
};

const str = (v: unknown, max = 4000): string => (typeof v === 'string' ? v.slice(0, max) : '');
const isIsoDay = (v: unknown): v is string => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
const safeUrl = (v: unknown): string => {
  const s = str(v, 600);
  // https, or a file of this site. "//host/…" is another site in disguise.
  return /^https:\/\//.test(s) || /^\/(?!\/)/.test(s) ? s : '';
};

/** A stored row as a room. Pieces that are not well formed are left out
 *  rather than half shown. */
export function fromRow(row: ExhibitionRow): Exhibition {
  const raw = Array.isArray(row.pieces) ? row.pieces : [];
  const pieces: Piece[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const p = item as Record<string, unknown>;
    if (p.kind === 'song' && safeUrl(p.src)) {
      pieces.push({ kind: 'song', title: str(p.title, 120) || 'The song', note: str(p.note, 200), src: safeUrl(p.src), duration: str(p.duration, 8) });
    } else if (p.kind === 'letter' && isIsoDay(p.opensAt) && str(p.body)) {
      pieces.push({ kind: 'letter', from: str(p.from, 80), opensAt: p.opensAt, body: str(p.body), sealed: true });
    } else if (p.kind === 'figurine' && safeUrl(p.image)) {
      pieces.push({ kind: 'figurine', image: safeUrl(p.image), caption: str(p.caption, 240) });
    }
  }
  return {
    slug: row.slug,
    forName: str(row.for_name, 80),
    dedication: str(row.dedication, 160),
    from: str(row.from_name, 80),
    openedOn: isIsoDay(row.opened_on) ? row.opened_on : str(row.opened_on, 10),
    number: Number.isInteger(row.number) ? row.number : 0,
    carriedBy: row.carried_by ? str(row.carried_by, 80) : null,
    sample: false,
    pieces,
  };
}
