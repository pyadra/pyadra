/* ------------------------------------------------------------------ */
/*  PYADRA · The house — the one place its offer is written.           */
/*                                                                     */
/*  The idea (branch `rethink/exhibition-of-one`, November 2026):      */
/*  Pyadra stops offering its projects to people who would have to     */
/*  pay to run them, and sells what the projects make. Three of them   */
/*  become workshops; what they make hangs together in a small museum  */
/*  room made for one person, "an exhibition of one". People who       */
/*  bring it to others ("carriers") keep a share and pay nothing to    */
/*  come in. The projects stay with Pyadra.                            */
/*                                                                     */
/*  ⚠ PROPOSAL, NOT AN OWNER DECISION. Every price, share, day count   */
/*  and promise below was proposed to make the idea concrete. None is  */
/*  agreed. Company_Master §10 says the Pyadra/creator split must not  */
/*  be designed without a real case and legal review: the figures in   */
/*  SPLIT and CARRY are a starting point for that conversation, not    */
/*  terms. Confirm or replace each one, here and in                    */
/*  02_Strategy/Exhibition_Of_One.md, before this reaches `main`.      */
/*                                                                     */
/*  One canonical number: prices and shares are numbers here and every */
/*  page formats them from here. Copy is written here first and pages  */
/*  render it verbatim (the copy deck rule).                           */
/* ------------------------------------------------------------------ */

export type PieceId = 'song' | 'letter' | 'figurine';

export type PieceOffer = {
  id: PieceId;
  numeral: string;
  name: string;
  /** The lot (galaxy/lots.ts) whose team makes it. */
  workshop: string;
  /** AUD. */
  price: number;
  /** How long it takes, as it reads. */
  time: string;
  /** What it is. */
  line: string;
  /** How it is made, said plainly (non-negotiable #13). */
  made: string;
  /** What the giver sends us. */
  send: string;
  /** Anything that costs extra or has a limit. */
  fine?: string;
};

/** Whole dollars read plain (A$39); cents always read as two digits (A$7.80). */
export const aud = (n: number) =>
  `A$${n.toLocaleString('en-AU', Number.isInteger(n) ? undefined : { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const PIECES: PieceOffer[] = [
  {
    id: 'song',
    numeral: 'I',
    name: 'The song',
    workshop: 'momentos-eternos',
    price: 39,
    time: 'Ready in 48 hours',
    line: 'Their story, sung. Written from what you tell us, in the genre and the language they love.',
    made: 'Composed with AI instruments, and listened to by a person before it leaves the workshop.',
    send: 'A few lines about them: names, a memory, the joke only you two get.',
  },
  {
    id: 'letter',
    numeral: 'II',
    name: 'The letter',
    workshop: 'ethernicapsule',
    price: 9,
    time: 'Sealed the same day',
    line: 'Your words, shut until the date you choose. The room counts the days.',
    made: 'Kept by the house and shown only when its day arrives. Ask us and we delete it.',
    send: 'The letter itself, and the day it opens.',
  },
  {
    id: 'figurine',
    numeral: 'III',
    name: 'The figurine',
    workshop: 'figuitoon',
    price: 49,
    time: 'Made to order. Allow three weeks.',
    line: 'A 15 cm mini of them, printed in Perth and posted to their door.',
    made: 'A stylized figure in four colours with a head made from their photo. A likeness with character, never a replica.',
    send: 'One clear photo, facing the camera.',
    fine: 'Posted within Australia. Postage is added. A few are made each month.',
  },
];

export const pieceById = (id: string | undefined): PieceOffer | undefined => PIECES.find((p) => p.id === id);

/** Pieces that cost less together. The first match wins. */
export const SETS: { id: string; name: string; pieces: PieceId[]; price: number; line: string }[] = [
  {
    id: 'all',
    name: 'All three',
    pieces: ['song', 'letter', 'figurine'],
    price: 89,
    line: 'The whole exhibition: something to hear, something to open later, something to hold.',
  },
  {
    id: 'pair',
    name: 'Song and letter',
    pieces: ['song', 'letter'],
    price: 45,
    line: 'Something to hear today and something to open later.',
  },
];

/** What a choice of pieces costs: the set price when the choice is a set,
 *  otherwise the sum. Unknown ids are ignored. */
export function priceFor(ids: string[]): { total: number; set: (typeof SETS)[number] | null } {
  const chosen = [...new Set(ids)].filter((id): id is PieceId => !!pieceById(id));
  const set = SETS.find((s) => s.pieces.length === chosen.length && s.pieces.every((p) => chosen.includes(p))) ?? null;
  const sum = chosen.reduce((t, id) => t + pieceById(id)!.price, 0);
  return { total: set ? set.price : sum, set };
}

/** The room every piece hangs in. */
export const ROOM = {
  price: 'On the house',
  line: 'Every piece hangs in a room of their own: their name on the wall, an admission ticket to print or send, and a link that stays open.',
  keep: 'The room stays open as long as Pyadra does, and every piece is yours to download.',
};

/** How long until a person answers a commission or a carrier. */
export const REPLY_WINDOW = 'one working day';

export const HOME = {
  label: 'Pyadra · Made for one person',
  headline: 'An exhibition of one',
  lead: 'We make a small museum room for one person you love: a song written from your story, a letter sealed until the day you choose, a figurine of them. They get a ticket. They walk in.',
  cta: 'Make one for someone',
  sample: 'Walk through a sample',
  note: `From ${aud(Math.min(...PIECES.map((p) => p.price)))}. The room is on the house.`,
};

/** How it goes, in four steps. The second is said plainly because the
 *  first rooms are made by hand: no payment is taken on this site. */
export const STEPS: { n: string; title: string; text: string }[] = [
  {
    n: '01',
    title: 'Tell us about them',
    text: 'Five minutes: who they are, the day that matters, and what you want to say. A paragraph is enough.',
  },
  {
    n: '02',
    title: 'A person replies',
    text: `We read every commission ourselves and answer within ${REPLY_WINDOW} with the price and a secure payment link. Nothing is charged before that.`,
  },
  {
    n: '03',
    title: 'The workshops make it',
    text: 'The song in 48 hours. The letter is sealed the day you send it. The figurine takes about three weeks.',
  },
  {
    n: '04',
    title: 'They walk in',
    text: 'You get their ticket to print or send. The song plays, the letter counts down to its day, and the room stays open.',
  },
];

export const OCCASIONS = [
  'A birthday',
  'An anniversary',
  'Mother’s Day',
  'Father’s Day',
  'A wedding',
  'A new baby',
  'A goodbye',
  'Christmas',
  'No reason at all',
] as const;

/** Said plainly — what a careful buyer would want to know first. */
export const PLAIN: { title: string; text: string }[] = [
  {
    title: 'The songs are made with AI',
    text: 'A person turns your story into the brief, an AI instrument composes it, and a person listens before anything is sent. We say so because you should know what you are giving.',
  },
  {
    title: 'This house is new',
    text: 'There are no reviews yet, and we will not invent any. The sample room is the proof: every piece in it came from our own workshops.',
  },
  {
    title: 'If it is not right, we fix it',
    text: 'We remake a piece once at no cost. If it is still not right, we refund it.',
  },
];

/* ------------------------------------------------------------------ */
/*  Carriers                                                           */
/* ------------------------------------------------------------------ */

/** Of every piece's price, after payment fees. The carrier's share goes
 *  to the house when a piece arrives without a code, and pays for the
 *  work of finding people. PROPOSAL (see the header). */
export const SPLIT = { workshop: 55, carrier: 20, house: 25 } as const;

export const CARRY = {
  label: 'Pyadra · Carry it',
  headline: 'Carry it',
  lead: 'Our projects do not need a buyer. They need people who bring them to the people they know. There is nothing to pay to come in, and you keep a share of everything you bring.',
  cta: 'Ask for your code',
  note: `Free to ask. We answer within ${REPLY_WINDOW}.`,
};

export const CARRY_STEPS: { n: string; title: string; text: string }[] = [
  { n: '01', title: 'Ask for your code', text: `Tell us who you would bring it to. We answer within ${REPLY_WINDOW} with a code and a link of your own.` },
  { n: '02', title: 'Put it where your people are', text: 'A card on the counter, a message in your group, a line in your bio. The link opens the house with your code already on it.' },
  { n: '03', title: 'We make and deliver', text: 'You never touch the making. The workshops do it, and the person who gives the room deals with us.' },
  { n: '04', title: 'You are paid every month', text: `${SPLIT.carrier}% of every piece ordered with your code, with a statement of each one.` },
];

export const CARRY_SUITS: { title: string; text: string }[] = [
  { title: 'A florist, or anyone who sells gifts', text: 'A song or a sealed letter next to the bouquet. A card on the counter does the asking.' },
  { title: 'A celebrant, a planner, a photographer', text: 'You already know who has a date coming, and you are in the room when it matters.' },
  { title: 'The one people ask for ideas', text: 'Every family and every group chat has someone who always knows what to give.' },
  { title: 'A creator', text: 'A code in your bio. Your audience gives, and you keep a share of each piece.' },
];

/** What carrying each project means today. `earning: false` says so
 *  out loud: nothing to share until the project charges someone. */
export const CARRY_OFFERS: { lot: string; what: string; share: string; earning: boolean }[] = [
  {
    lot: 'momentos-eternos',
    what: 'Bring someone who wants to give a song.',
    share: `${SPLIT.carrier}% of every song`,
    earning: true,
  },
  {
    lot: 'ethernicapsule',
    what: 'Bring someone with words that should wait for a day.',
    share: `${SPLIT.carrier}% of every letter`,
    earning: true,
  },
  {
    lot: 'figuitoon',
    what: 'Bring someone who wants a mini of a person they love.',
    share: `${SPLIT.carrier}% of every figurine`,
    earning: true,
  },
  {
    lot: 'kangaroo-cleanup',
    what: 'A crew in Sydney with a vehicle takes the jobs that still come in. No entry price.',
    share: 'You keep 85% of each job',
    earning: true,
  },
  {
    lot: 'wemait',
    what: 'Bring a coach who wants to run their clients in one place.',
    share: 'A share of that coach’s plan for a year, once plans switch on',
    earning: false,
  },
  {
    lot: 'urelit',
    what: 'Free to use today.',
    share: 'Nothing to share yet',
    earning: false,
  },
  {
    lot: 'byndi',
    what: 'Free to use today.',
    share: 'Nothing to share yet',
    earning: false,
  },
];

/** The door for someone who makes something that belongs in a room.
 *  New projects come into the house as workshops (BringIdeaDialog). */
export const WORKSHOP_DOOR = {
  label: 'Open a workshop',
  title: 'You make something that belongs in a room?',
  text: `A portrait, a poem, a recorded conversation, a book of their stories. Bring it as a workshop: the house brings the people, you make the piece, and you keep ${SPLIT.workshop}% of each one.`,
  cta: 'Tell us what you make',
  dialog: {
    eyebrow: 'Pyadra · Open a workshop',
    title: 'Show us what you make.',
    intro: 'Tell us what the piece is and how you make it. It goes straight to the people who run the house.',
    messageLabel: 'Your piece',
    messagePlaceholder: 'What is it, how long does one take, and what would someone pay for it?',
    submitLabel: 'Send it to the house',
    model: 'Open a workshop',
  },
};

/* ------------------------------------------------------------------ */
/*  The open book                                                      */
/* ------------------------------------------------------------------ */

export const LEDGER = {
  label: 'Pyadra · The open book',
  headline: 'The open book',
  lead: 'Everything Pyadra has made and what it has done so far, with where each number comes from. Small numbers are still numbers.',
  rooms: { one: 'room made for someone', many: 'rooms made for someone' },
  roomsNote: 'Counted from the house’s own records. The sample room does not count.',
  splitTitle: 'Where the money of a piece goes',
  splitNote: 'A proposal, shown before the first piece is paid for, so nobody finds out afterwards. When a piece arrives without a carrier, that share stays with the house and pays for finding people.',
};

/* ------------------------------------------------------------------ */
/*  Questions                                                          */
/* ------------------------------------------------------------------ */

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'How do I pay?',
    a: 'Not on this page. You tell us about the person, we reply with the price and a secure Stripe link, and the workshops start when it is paid.',
  },
  {
    q: 'Can other people add something to the room?',
    a: `Yes. Anyone you choose can leave a sealed letter of their own for ${aud(pieceById('letter')!.price)} each. Tell us how many when you commission the room.`,
  },
  {
    q: 'Who can read the sealed letter?',
    a: 'The room will not show a letter before its day. The house keeps the words to be able to show them then, so treat a letter as private, not as secret from us.',
  },
  {
    q: 'What does the person receive?',
    a: 'A ticket with the link to their room, to print or send. If there is a figurine, it arrives by post.',
  },
];
