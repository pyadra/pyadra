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
  sphereClass: string;
  glow: string;
};

/** Filled from the owner's lot sheet (04_Projects/Lot_Sheet_Template.md).
 *  Every field is optional: a missing one is hidden on the live site and
 *  shown as a marked, empty slot in development — so the page always
 *  shows what is still to be written, and never invents it. */
export type LotSheet = {
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

/** The sectors, clockwise from the top. `pending` holds projects whose way
 *  in the owner hasn't set yet — it disappears once it's empty. */
export const SECTORS: { key: WayIn; label: string }[] = [
  { key: 'acquire', label: 'Acquire' },
  { key: 'operate', label: 'Operate' },
  { key: 'support', label: 'Support' },
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
  /*  The new projects.                                                  */
  /*                                                                     */
  /*  ⚠ TODO (owner) — ready and for sale (owner, October 27, 2026).    */
  /*  Each still needs, from its own lot sheet (Lot_Sheet_Template.md),  */
  /*  before this page is deployed: subtitle, proof, offer, the `sheet`  */
  /*  fields, and enter_url — its Pyadra page or its own site. Until     */
  /*  then they show "Details to confirm" and no link — never a claim    */
  /*  the code can't keep (Company_Master #13).                          */
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
    id: 'momentos-inolvidables',
    name: 'Momentos Inolvidables',
    type: 'Glocal',
    kind: 'Custom songs',
    logo: { kind: 'pending' },
    subtitle: 'Songs made for one moment',
    proof: 'Details to confirm',
    opportunity: 'Available to acquire',
    wayIn: 'acquire',
    stage: 'ready',
    offer: null,
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FAF8FF,#E4DCF7,#C5B8E8)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#D6CBF0]',
  },
  {
    id: 'gym',
    name: 'Gym routines',
    type: 'Global',
    kind: 'Fitness app',
    logo: { kind: 'pending' },
    subtitle: 'Training routines, guided',
    proof: 'Details to confirm',
    opportunity: 'Available to acquire',
    wayIn: 'acquire',
    stage: 'ready',
    offer: null,
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#F6FBFF,#D9E8F4,#B4CADE)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#CBDDEB]',
  },
  {
    id: 'we-made-it',
    name: 'We Made It',
    type: 'Details to confirm',
    kind: 'Project',
    logo: { kind: 'pending' },
    subtitle: 'Details to confirm',
    proof: 'Details to confirm',
    opportunity: 'Available to acquire',
    wayIn: 'acquire',
    stage: 'ready',
    offer: null,
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#FFFBF2,#F6E7C8,#E6CB98)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#F0DDB4]',
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
