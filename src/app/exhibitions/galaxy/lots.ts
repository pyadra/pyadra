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
  /** null until the project has a page — the sphere shows, it just isn't a door yet. */
  enter_url: string | null;
  sphereClass: string;
  glow: string;
};

/** The sectors, clockwise from the top. `pending` holds projects whose way
 *  in the owner hasn't set yet — it disappears once it's empty. */
export const SECTORS: { key: WayIn; label: string }[] = [
  { key: 'acquire', label: 'Acquire' },
  { key: 'operate', label: 'Operate' },
  { key: 'support', label: 'Support' },
  { key: 'build', label: 'Build' },
  { key: 'forming', label: 'Forming' },
  { key: 'pending', label: 'Way in to confirm' },
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
    enter_url: '/exhibitions/galaxy/orbit',
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#F2FBF5,#CDEBD9,#A3CFB6)] shadow-[-10px_10px_20px_rgba(0,0,0,0.12)]',
    glow: 'bg-[#A3CFB6]',
  },
  /* ------------------------------------------------------------------ */
  /*  The new projects.                                                  */
  /*                                                                     */
  /*  ⚠ TODO (owner) — the owner confirmed these are ready (October 26,  */
  /*  2026), but each still needs, from its own Project Standard doc,    */
  /*  before this page is deployed:                                      */
  /*    · wayIn       acquire / operate / support / build                */
  /*    · subtitle    what it is, one line                               */
  /*    · proof       what anyone can verify today                       */
  /*    · opportunity the line under the name                            */
  /*    · enter_url   its Pyadra page, or its own site                   */
  /*  Until then they sit in the "Way in to confirm" sector with no      */
  /*  link — never a claim the code can't keep (Company_Master #13).     */
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
    opportunity: 'Opening soon',
    wayIn: 'pending',
    stage: 'ready',
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
    opportunity: 'Opening soon',
    wayIn: 'pending',
    stage: 'ready',
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
    opportunity: 'Opening soon',
    wayIn: 'pending',
    stage: 'ready',
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
    opportunity: 'Opening soon',
    wayIn: 'pending',
    stage: 'ready',
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
    enter_url: null,
    sphereClass: 'bg-[radial-gradient(circle_at_30%_30%,#F7F8F7,#E3E6E3,#C9CEC9)] shadow-[-10px_10px_20px_rgba(0,0,0,0.1)]',
    glow: 'bg-[#D9DDD9]',
  },
];
