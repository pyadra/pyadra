/* ==================================================================
   PYADRA · THE TEAM ROSTER
   ------------------------------------------------------------------
   This is the ONLY file you edit to add, remove or reorder a person.
   The page and the vCard route both read from here.

   ┌─ TO ADD SOMEONE ───────────────────────────────────────────────┐
   │  1. Copy a block below and fill it in.                        │
   │  2. Drop a square photo (1000×1000+) at                       │
   │     public/images/team/<slug>.jpg — or leave `photo: null`    │
   │     and the frame shows an unhung plaque instead of a break.  │
   │  3. That is all. Their card, their swipe position, their      │
   │     vCard and their QR link all follow automatically.         │
   └───────────────────────────────────────────────────────────────┘

   Their QR points at:  pyadra.io/team/<slug>
   Bare /team opens on the first person in this list.
   Legacy /eduardo redirects to /team/edu — a sample card was printed
   against it, so that redirect is permanent.

   Two Cristians, so the slugs go by what each is called rather than a
   first name that would collide.

   PENDING (Sept 2026): cristian@pyadra.io and cris@pyadra.io are not
   created yet, so mail to them bounces — and they are already inside the
   vCards people save. Owner accepted that, to be fixed when the mailboxes
   exist. Until then pyadra@pyadra.io is the only inbox that receives.

   HONESTY RULE (non-negotiable #13, Company_Master §0): never invent a
   person's story, role, location or handle. Anything unconfirmed stays
   `null` — the card renders correctly without it and says nothing
   untrue. Every word below is the person's own, translated only.
   ================================================================== */

export type Person = {
  /** url slug — /team/<slug>; also the .vcf filename */
  slug: string;
  name: string;
  /** what they are called — shown under their face in the team strip */
  shortName: string;
  /** split for the vCard's N: field, which is structured */
  firstName: string;
  lastName: string;
  /** shown under the name; keep it plain, no invented seniority */
  role: string;
  /** null when it has not been confirmed — the line simply omits it */
  location: string | null;
  email: string;
  linkedin: string | null;
  instagram: string | null;
  /** path under public/, or null for the unhung-plaque state */
  photo: string | null;
  /** a tall photo in a circular frame shows its middle ~56%; pull the
      window up so the face is not against the rim. '50% 50%' if square */
  photoPosition: string;
  /** one line, first person, in their own voice */
  statement: string;
  /** short paragraphs in their own voice. [] hides the block */
  bio: string[];
};

export const PEOPLE: Person[] = [
  {
    slug: 'edu',
    name: 'Eduardo Díaz',
    shortName: 'Edu',
    firstName: 'Eduardo',
    lastName: 'Díaz',
    role: 'Founder',
    location: 'Perth, Australia',
    email: 'pyadra@pyadra.io',
    linkedin: 'https://www.linkedin.com/in/eduardo-diaz-41a44559/',
    instagram: 'https://instagram.com/alfonsodcarretero',
    photo: '/images/eduardo/eduardo.jpg',
    photoPosition: '50% 34%',
    statement: 'Get to know me first — you won’t regret it.',
    bio: [
      'I arrived in Australia with a suitcase and not much English, and the first years were night shifts. I try to finish what I start. It is easy to watch from the sidelines, and I would rather be in it — thinking about what we are building, and finding ways to help people.',
      'I overthink things, so I analyse everything before I move. I keep in shape, I am always learning something new, and I like reggaeton at full volume.',
    ],
  },

  {
    slug: 'cris',
    name: 'Cristian Ruiz',
    shortName: 'Cris',
    firstName: 'Cristian',
    lastName: 'Ruiz',
    role: 'Co-founder',
    location: null,
    email: 'cristian@pyadra.io',
    linkedin: null,
    instagram: 'https://instagram.com/christian_c_ruiz',
    photo: '/images/team/cris.jpg',
    photoPosition: '50% 50%',
    statement: 'It is always better to keep going than to give up.',
    bio: [
      'I like staying focused. I keep going, and I pull strength from places where there is none left.',
      'I train, and I am starting to build my own personal brand in content — that is something you could help me with. Pyadra has been an inspiration and a personal challenge.',
    ],
  },

  {
    slug: 'nino',
    name: 'Cristian Niño',
    shortName: 'Niño',
    firstName: 'Cristian',
    lastName: 'Niño',
    role: 'CTO',
    location: null,
    email: 'cris@pyadra.io',
    linkedin: null,
    instagram: 'https://www.instagram.com/cenm1997/',
    photo: null,
    photoPosition: '50% 50%',
    statement: 'I like making things that did not exist before.',
    bio: [
      'I am always learning something new and looking for a way to innovate. I like helping people, and showing up cheerful and ready.',
      'Mostly I like building new things, and getting better at how I build them.',
    ],
  },
];

/** Bare /team opens here; /eduardo redirects to it. */
export const DEFAULT_PERSON = 'edu';

/** -1 when the slug is unknown, so a bad URL falls back instead of 404ing. */
export const personIndex = (slug: string | null | undefined) =>
  PEOPLE.findIndex((p) => p.slug === slug);
