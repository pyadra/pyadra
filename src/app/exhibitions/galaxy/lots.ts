/* ------------------------------------------------------------------ */
/*  PYADRA — GALAXY · the lots                                         */
/*                                                                     */
/*  One row per project. This is the only place a project is declared  */
/*  for Galaxy: the orbit reads its position from `wayIn` and `stage`, */
/*  so adding a project is adding a row — never re-tuning a layout.    */
/*                                                                     */
/*  The copy fields are the "WHAT THE USER SEES BEFORE ENTERING" block */
/*  of each project's Project Standard doc. Copy is written there      */
/*  first, then here (Company_Master #13).                             */
/* ------------------------------------------------------------------ */

/** How a visitor comes in. The angle of the orbit. */
export type WayIn = 'acquire' | 'operate' | 'support' | 'build' | 'forming' | 'pending';

/** How close it is to being handed over. The radius of the orbit:
 *  ready sits on the inner ring, forming on the outer one. */
export type Stage = 'ready' | 'forming';

export type LogoRef = { kind: 'image'; src: string } | { kind: 'inline-capsule' } | { kind: 'pending' };

export type Lot = {
  id: string;
  name: string;
  type: string;
  kind: string;
  logo: LogoRef;
  subtitle: string;
  proof: string;
  opportunity: string;
  wayIn: WayIn;
  stage: Stage;
  /** What a visitor puts in and takes away, in plain words — from the
   *  project's own doc (participation section). Never a valuation figure:
   *  numbers live on the dossier (Company_Master §7). null = not set yet. */
  offer: { give: string; get: string } | null;
  /** The lot sheet — the same fields for every project, shown in its panel
   *  before the dossier, so a visitor knows what they'd be taking. */
  sheet?: LotSheet;
  /** null until the project has a page — the sphere shows, it just isn't a door yet. */
  enter_url: string | null;
  /** The piece the room leads with — larger, in full colour, where a first
   *  visit starts. One at most, and only a lot with a room to enter. */
  featured?: boolean;
  sphereClass: string;
  glow: string;
};

/** Filled from the owner's lot sheet (04_Projects/Lot_Sheet_Template.md).
 *  Every field is optional: a missing one is hidden on the live site and
 *  shown as a marked, empty slot in development — so the page always
 *  shows what is still to be written, and never invents it. */
export type LotSheet = {
  /** The hook — one line that makes someone want to look closer. Shown on
   *  hover, said by the guide, and first on the panel. ≤ 80 characters. */
  hook?: string;
  /** What it is, in two sentences a stranger understands. */
  summary?: string;
  /** What you'd be buying, as formats — e.g. "Mobile app", "Website". */
  formats?: string[];
  /** The asking price as it should read — or leave it out for "on request". */
  price?: string;
  /** One line under the price — e.g. "Negotiable", "Plus revenue share". */
  priceNote?: string;
  /** What transfers to whoever takes it — 3 to 6 short items. */
  includes?: string[];
  /** Who it suits — 2 or 3 short profiles. */
  idealFor?: string[];
  /** Verifiable numbers — 2 or 3. */
  numbers?: { label: string; value: string }[];
  /** How the takeover works, in one line — e.g. "Two weeks, guided". */
  handover?: string;
  /** Where to see it working today. */
  live?: { label: string; href: string };
};

/** The sectors, clockwise from the top — labelled with the Home's own
 *  verbs ("I want to own one" lands on Own), so the words don't change
 *  between rooms. `pending` holds projects whose way
 *  in the owner hasn't set yet — it disappears once it's empty. */
export const SECTORS: { key: WayIn; label: string }[] = [
  { key: 'acquire', label: 'Own' },
  { key: 'operate', label: 'Run' },
  { key: 'support', label: 'Back' },
  { key: 'build', label: 'Build' },
  { key: 'forming', label: 'Forming' },
  { key: 'pending', label: 'To confirm' },
];

export const LOTS: Lot[] = [
  {
    id: 'ethernicapsule',
    name: 'EterniCapsule',
    type: 'Global',
    kind: 'Digital vault',
    /* TODO: no dedicated logo asset for EterniCapsule yet — using an inline
       gold capsule mark as a stand-in. Replace with a real logo when available. */
    logo: { kind: 'inline-capsule' },
    subtitle: 'Encrypted time capsules',
    proof: 'Built & live · Global product · Independently deployed (eternicapsule.com)',
    opportunity: 'Open for acquisition',
    wayIn: 'acquire',
    stage: 'ready',
    offer: {
      give: 'An upfront amount — two ways to take it on, agreed in a conversation.',
      get: 'The product and its operation. Pyadra keeps a small share of each capsule sold.',
    },
    enter_url: '/exhibitions/galaxy/ethernicapsule',
    featured: true,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FDF6EA,#EBD8B9,#D3B58C)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#E4C99F]',
  },
  {
    id: 'figuitoon',
    name: 'Figuitoon',
    type: 'Glocal',
    kind: 'Physical product',
    logo: { kind: 'image', src: '/figuitoon-logo.png' },
    subtitle: 'Custom 3D figurines',
    proof: 'Prototype built · Shopify store · Printer included',
    opportunity: 'Available to acquire',
    wayIn: 'acquire',
    stage: 'ready',
    offer: {
      give: 'The price, agreed in a conversation.',
      get: 'The whole project: the store, 100+ designs, the brand, the 3D printer, the software pipeline and the know-how.',
    },
    enter_url: '/exhibitions/galaxy/figurines',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#FFFFFF,#F2F2F2)] shadow-[-10px_10px_20px_rgba(0,0,0,0.12)]',
    glow: 'bg-white',
  },
  {
    id: 'kangaroo-cleanup',
    name: 'Kangaroo Cleanup',
    type: 'Local',
    kind: 'Cleanup business',
    logo: { kind: 'image', src: '/images/kangaroo/kangaroo_logo.png' },
    subtitle: 'Local cleanup business',
    proof: 'Sydney-based · 500+ jobs done · 5.0 reputation',
    opportunity: 'Looking for a partner',
    wayIn: 'operate',
    stage: 'ready',
    offer: {
      give: 'Your work, a suitable vehicle, and a handover deal agreed in a conversation.',
      get: 'A real Sydney business: the brand, its reputation, the website, email and phone, and a guided handover.',
    },
    enter_url: '/exhibitions/galaxy/kangaroo-cleanup',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFFEF9,#F3EFE2,#DCD5C2)] shadow-[-10px_10px_20px_rgba(0,0,0,0.12)]',
    glow: 'bg-[#EDE8D8]',
  },
  {
    id: 'orbit',
    name: 'Orbit 77',
    type: 'Glocal',
    kind: 'Podcast',
    logo: { kind: 'image', src: '/orbit-logo.png' },
    subtitle: 'Podcast · real conversations',
    proof: '10 episodes live · Season 2 in the works',
    opportunity: 'Open for support',
    wayIn: 'support',
    stage: 'ready',
    offer: {
      give: 'A contribution — any size you choose.',
      get: 'A permanent credential in the archive, founding-member status, early access to Season 2 — never ownership.',
    },
    enter_url: '/exhibitions/galaxy/orbit',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#F2FBF5,#CDEBD9,#A3CFB6)] shadow-[-10px_10px_20px_rgba(0,0,0,0.12)]',
    glow: 'bg-[#A3CFB6]',
  },
  /* ------------------------------------------------------------------ */
  /*  Christian Ruiz's projects (co-founder), from their Project         */
  /*  Standard docs of October 23, 2026 (04_Projects/). Strings are the  */
  /*  docs' own — copy decks, canonical metrics, asset lists — trimmed   */
  /*  to the lot sheet's lengths. No asking price: the docs share the    */
  /*  figure only in due diligence. No Pyadra page yet (enter_url null). */
  /* ------------------------------------------------------------------ */
  {
    id: 'momentos-eternos',
    name: 'Momentos Eternos',
    type: 'Global',
    kind: 'Gift songs',
    logo: { kind: 'pending' },
    subtitle: 'Personalized songs to give as a gift',
    proof: '3 sales, one per package · Paused, ready to reopen',
    opportunity: 'Available to acquire',
    wayIn: 'acquire',
    stage: 'ready',
    offer: {
      give: 'An upfront amount — run it or own it, agreed in a conversation.',
      get: 'The site, code, brand, content and documentation. The creator keeps a royalty, paid through Pyadra.',
    },
    sheet: {
      hook: 'A gift business that already sold every package — waiting to be switched on.',
      summary: 'You tell us a story about someone you love; we turn it into an original song you can give them, with a gift page they open from a QR code.',
      formats: ['Website', 'Studio panel'],
      includes: [
        'The site, with payments and a studio panel',
        'The brand, its characters and ad videos',
        'Three packages, six cover styles, five sample songs',
        'The README, content catalog and production scripts',
      ],
      idealFor: ['An operator to switch it back on', 'An owner to restart and grow it'],
      numbers: [
        { value: '3', label: 'sales, one per package' },
        { value: '3 h', label: 'studio delivery' },
        { value: '2', label: 'languages' },
      ],
      // the site is paused — no live link until it reopens
    },
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFF8F3,#F6D9CB,#E2AA92)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#EDBFAB]',
  },
  {
    id: 'urelit',
    name: 'URELIT',
    type: 'Global',
    kind: 'Gym app',
    logo: { kind: 'pending' },
    subtitle: 'The gym app that tells you what to lift next time',
    proof: 'Live at urelit.app · 5 testers since September',
    opportunity: 'Available to acquire',
    wayIn: 'acquire',
    stage: 'ready',
    offer: {
      give: 'An upfront amount — run it or own it, agreed in a conversation.',
      get: 'The app, code, brand, social accounts and documentation. The creator keeps a royalty, paid through Pyadra.',
    },
    sheet: {
      hook: 'A finished gym app, live and tested, one step from charging.',
      summary: 'A gym app that remembers every set you do and tells you the weight, reps and effort for your next session — in plain gym language, with safety limits built in.',
      formats: ['Installable web app'],
      includes: [
        'The live app and its code',
        'The URELIT brand and its social accounts',
        'Free and Premium plans, ready to charge',
      ],
      idealFor: ['Someone to run it', 'Someone to fund the launch', 'Someone to own it'],
      numbers: [
        { value: '5', label: 'active testers' },
        { value: '$4.99', label: 'Premium/mo · not live yet' },
        { value: '14', label: 'day Premium trial' },
      ],
      live: { label: 'urelit.app', href: 'https://urelit.app' },
    },
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFF6F5,#F6D2CE,#E3A09A)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#EDB5AF]',
  },
  {
    id: 'wemait',
    name: 'WEMAIT',
    type: 'Global',
    kind: 'Coaching app',
    logo: { kind: 'pending' },
    subtitle: 'An app for certified coaches and their clients',
    proof: 'Live demo at wemait.app · 5 coaches in conversation',
    opportunity: 'Available to acquire',
    wayIn: 'acquire',
    stage: 'ready',
    offer: {
      give: 'An upfront amount — run it or own it, agreed in a conversation.',
      get: 'The app, code, brand, domain and documentation. The creator keeps a royalty, paid through Pyadra.',
    },
    sheet: {
      hook: "The coaching platform that proves a coach's system works.",
      summary: "An app for certified coaches and their clients: training, nutrition, habits and check-ins in one place. It shows with data whether a coach's system actually works.",
      formats: ['Mobile app', 'Web app'],
      includes: [
        'Coach, client and admin apps with their code',
        'The WEMAIT brand, domain and 16 tutorial videos',
        'A pricing model by active clients, ready to switch on',
      ],
      idealFor: ['Someone to fund the launch', 'An operator for its coaches'],
      numbers: [
        { value: '5', label: 'coaches in conversation' },
        { value: '750+', label: 'automated tests' },
        { value: '16', label: 'tutorial videos' },
      ],
      live: { label: 'the wemait.app demo', href: 'https://wemait.app/app/' },
    },
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#F3FBFA,#CFEDE8,#93CFC6)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#ABDDD6]',
  },
  /* ------------------------------------------------------------------ */
  /*  ⚠ TODO (owner) — Byndi has no Project Standard doc in the vault    */
  /*  yet: its sheet, offer and destination wait for it.                 */
  /* ------------------------------------------------------------------ */
  {
    id: 'byndi',
    name: 'Byndi',
    type: 'Global',
    kind: 'Mobile app',
    logo: { kind: 'pending' },
    // The in-app tagline, verified in the Byndi repo.
    subtitle: 'Understand her cycle. Care for the relationship.',
    proof: 'Live on Android · App Store next',
    opportunity: 'Available to acquire',
    wayIn: 'acquire',
    stage: 'ready',
    offer: null,
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFF6F8,#F4DAE2,#DFB3C3)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#EFC7D3]',
  },
  {
    id: 'backmate',
    name: 'BackMate',
    type: 'Local',
    kind: 'Mobility service',
    logo: { kind: 'pending' },
    subtitle: 'A designated driver, with an escort',
    proof: 'In formation',
    opportunity: 'Forming',
    wayIn: 'forming',
    stage: 'forming',
    offer: null,
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#F7F8F7,#E3E6E3,#C9CEC9)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#D9DDD9]',
  },
];
