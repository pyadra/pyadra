/* ------------------------------------------------------------------ */
/*  PYADRA · The studio offer — the one place it is written.           */
/*                                                                     */
/*  The Home, /start and the brief email all read from here, so a      */
/*  price or a day count is never typed twice (CLAUDE.md, "one         */
/*  canonical number").                                                */
/*                                                                     */
/*  ⚠ PROPOSAL, NOT AN OWNER DECISION. Every price, day count and      */
/*  promise below was proposed on the `rethink/studio` branch          */
/*  (November 12, 2026) to make the idea concrete. Nothing here has    */
/*  been agreed by the owners. Before this branch goes anywhere near   */
/*  `main`, each figure is confirmed or replaced, here and in          */
/*  docs/pyadra_obsidian/Pyadra/02_Strategy/Studio_Rethink.md.         */
/* ------------------------------------------------------------------ */

export type PlanId = 'prototype' | 'launch' | 'care';

export type Plan = {
  id: PlanId;
  name: string;
  /** As it reads on the page. AUD. */
  price: string;
  /** What the price is for: "fixed", "per month". */
  priceNote: string;
  /** How long it takes, as it reads. */
  time: string;
  /** One line: what it is for. */
  line: string;
  /** What you hold at the end. */
  gets: string[];
  pick?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'prototype',
    name: 'Prototype',
    price: 'A$1,900',
    priceNote: 'fixed',
    time: '7 days',
    line: 'A working first version on a real link, to put in front of the people you think will pay.',
    gets: [
      'The core of your idea, working, on a link you can share',
      'Real screens on a phone and a laptop, not a slide deck',
      'A one page plan of what a full launch would take',
    ],
  },
  {
    id: 'launch',
    name: 'Launch',
    price: 'A$6,900',
    priceNote: 'fixed',
    time: '30 days',
    line: 'Your product live on your own domain, taking payments, with every account in your name.',
    gets: [
      'The finished product on your domain',
      'Payments, sign in and emails, wired and tested',
      'The code, the domain and every account, in your name',
      'A handover call and a written guide to run it',
    ],
    pick: true,
  },
  {
    id: 'care',
    name: 'Care',
    price: 'A$490',
    priceNote: 'per month',
    time: 'Cancel any time',
    line: 'After launch, we keep it running, fix what breaks and ship small improvements.',
    gets: [
      'Fixes and security updates',
      'A few small changes every month',
      'One inbox, answered by the people who built it',
    ],
  },
];

export const planById = (id: string | undefined): Plan | undefined => PLANS.find((p) => p.id === id);

/** How long until someone reads a brief and answers it. */
export const REPLY_WINDOW = 'two working days';

/** The Launch build, day by day — the Home's opening card. */
export const TIMELINE: { day: string; what: string }[] = [
  { day: 'Day 1', what: 'You send the idea. A paragraph is enough.' },
  { day: 'Day 3', what: 'Scope and a fixed price, in writing.' },
  { day: 'Day 10', what: 'A first version on a real link.' },
  { day: 'Day 30', what: 'Live on your domain, taking payments.' },
];

/** How it goes, in four steps. */
export const STEPS: { n: string; title: string; text: string }[] = [
  {
    n: '01',
    title: 'Send the idea',
    text: `A paragraph is enough. We read every brief ourselves and answer within ${REPLY_WINDOW}.`,
  },
  {
    n: '02',
    title: 'Agree the scope',
    text: 'One page: what gets built, what does not, the date and the price. Nothing starts until you say yes.',
  },
  {
    n: '03',
    title: 'Watch it get built',
    text: 'It lives on a private link from the first week. You open it whenever you like and tell us what is wrong.',
  },
  {
    n: '04',
    title: 'Take the keys',
    text: 'The code, the domain and the accounts move to your name. You can keep us on, or never talk to us again.',
  },
];

/** What Pyadra does not do. Said out loud, because our own projects taught it. */
export const LIMITS: { title: string; text: string }[] = [
  {
    title: 'We do not find your customers',
    text: 'We have built our own products and we know that building is the short part. We give you something real to show, quickly. Selling it is yours.',
  },
  {
    title: 'We do not take a share',
    text: 'No equity, no royalty, no percentage of what you earn. You pay once and the product is yours.',
  },
  {
    title: 'We do not start without a price',
    text: 'If we cannot say what it costs and when it lands, we are not ready to build it, and we will tell you so.',
  },
];

export const FAQ: { q: string; a: string }[] = [
  {
    q: 'What can you build in 30 days?',
    a: 'One product that does one thing well: a web app, a booking or ordering tool, a paid membership, a store with something custom behind it. If your idea is bigger than that, we will say which part to build first.',
  },
  {
    q: 'Who owns what you build?',
    a: 'You do. The code, the domain, the payment account and the data are set up in your name or moved to it at handover.',
  },
  {
    q: 'I am not technical. Is that a problem?',
    a: 'No. You bring the idea and the people it is for. We handle the building and explain every choice in plain words.',
  },
  {
    q: 'Can I take over one of your own projects instead?',
    a: 'Yes. Each one has its own page with what transfers and a starting price. That offer has not changed.',
  },
];

/** Where the idea is today — asked on /start so the first reply is useful. */
export const STAGES = ['Just the idea', 'Notes or sketches', 'A prototype', 'A live product that needs work'] as const;
