import type { WayIn } from './lots';

/* ------------------------------------------------------------------ */
/*  PYADRA — the project dashboards                                    */
/*                                                                     */
/*  One template (room/ProjectDashboard.tsx), one row per project.     */
/*  This file holds what the dashboard adds to the lot in `lots.ts`:   */
/*  the lot gives the name, hook, summary, numbers, "ideal for" and    */
/*  the link to the project's own site — the same row Galaxy reads, so */
/*  a figure is never written twice. Here: what changes hands, the     */
/*  ways in and their prices, what happens after the deal, the risks,  */
/*  the person, the questions.                                         */
/*                                                                     */
/*  Strings come from each project's doc in 04_Projects (its copy      */
/*  deck, asset value, risks and founder block). An empty field hides  */
/*  its block — nothing is ever filled in to look complete.            */
/*                                                                     */
/*  PRICES (owner, October 27, 2026): every price below is an          */
/*  ESTIMATE set low on purpose — Pyadra wants allies who help it      */
/*  grow, not only buyers. The owner will send the real figures; until */
/*  then the dashboard says they are introductory. AUD throughout.     */
/* ------------------------------------------------------------------ */

export type Option = {
  name: string;
  /** As it reads on the card — '$1,500', "Let's talk", '$10'. */
  price: string;
  /** One line under the name: what the price comes with. */
  terms: string;
  /** Shown when the option is chosen. */
  detail: string;
  pick?: boolean;
  /** Support only: a real checkout for this amount (AUD), or a conversation. */
  checkout?: number;
};

export type Room = {
  /** The URL segment under /exhibitions/galaxy. Existing links are kept. */
  slug: string;
  /** The status chip and the nav badge — e.g. 'For sale', 'For support'. */
  status: string;
  /** Acquire and operate end in a conversation; support can end in a
   *  checkout; forming only asks for an email. */
  ways: {
    kind: Extract<WayIn, 'acquire' | 'operate' | 'support' | 'forming'>;
    /** A reference point that is not a valuation — e.g. what it cost to build. */
    anchor?: { label: string; value: string; note: string };
    options: Option[];
    /** Who keeps what once it's signed. */
    after: { who: string; what: string }[];
  };
  take: { title: string; detail: string }[];
  /** What does NOT change hands — the honest edge of `take`. */
  notIncluded?: { item: string; note: string }[];
  /** A line under what you'd take, about the numbers. */
  proofNote?: string;
  /** Places anyone can check before they write. */
  verify?: { label: string; href: string }[];
  /** How the handover works, in one or two lines. */
  handover?: string;
  risks: { title: string; detail: string }[];
  person?: { name: string; role: string; quote: string; photo: string };
  faq?: { q: string; a: string }[];
};

/** The same four steps for every deal (Company_Master non-negotiable #9). */
export const DEAL_STEPS = [
  { title: 'A conversation', detail: 'You ask; the person behind it answers you directly.' },
  { title: 'Due diligence', detail: 'Numbers, assets and accounts are checked with you, in private.' },
  { title: 'Legal review', detail: 'Every agreement is reviewed before anyone signs.' },
  { title: 'Signed, then handed over', detail: 'Any revenue share comes with reporting and a right to verify.' },
];

const CRIS_RUIZ = '/images/team/cris.jpg';

export const ROOMS: Record<string, Room> = {
  ethernicapsule: {
    slug: 'ethernicapsule',
    status: 'For sale',
    ways: {
      kind: 'acquire',
      anchor: { label: 'What it cost to build', value: '$12,000 AUD', note: 'not the price' },
      options: [
        { name: 'Operator, hosted', price: '$1,500', terms: 'Pyadra keeps 15% per capsule', detail: 'Run it on Pyadra’s servers and keep 85% of each capsule. You cover the running costs.', pick: true },
        { name: 'Owner, hosted', price: '$3,000', terms: 'Pyadra keeps 5% per capsule', detail: 'More up front; almost everything each capsule earns is yours.' },
        { name: 'Make an offer', price: 'Let’s talk', terms: 'A different structure', detail: 'Including taking the whole thing to your own servers.' },
      ],
      after: [
        { who: 'You', what: 'The product, its operation and 85–95% of each capsule’s net.' },
        { who: 'Pyadra', what: '5–15% per capsule, by option, plus 5% at closing.' },
      ],
    },
    take: [
      { title: 'The finished app', detail: 'Frontend, backend and database, built, live and working today. Write, seal, pay, deliver, unlock.' },
      { title: 'The brand & the design', detail: 'The name, the logo, the gold identity and the ceremonial vault design.' },
      { title: 'Sealed until its day', detail: 'A capsule opens only with its key, and keys are never stored, only their fingerprints.' },
      { title: 'Payments already flowing', detail: 'Stripe checkout is live and takes $9 the moment someone seals.' },
      { title: 'Email & delivery that run themselves', detail: 'Keys go out by email; time-vault capsules unlock for the guardian on the chosen date.' },
      { title: 'A safety net for emergencies', detail: 'A guardian can unlock a capsule if something happens to the sender.' },
    ],
    proofNote: 'The live count of sealed capsules returns once its fix is deployed. Until then it is not shown, because a zero there would not mean zero sales.',
    verify: [{ label: 'Try the live product', href: 'https://eternicapsule.com' }],
    handover: 'Already independent: its own domain, code and deploy. Moving the shared database and payment account to yours is a documented job.',
    risks: [
      { title: 'No one has bought one yet', detail: 'The app is finished and working, but the first paying customer hasn’t arrived. You’d be buying a finished product, not a proven market.' },
      { title: 'We can’t see where visitors give up', detail: 'There are no analytics installed. Installing them and finding out is the new owner’s first job.' },
      { title: 'It still shares a database and payment account with Pyadra', detail: 'The app runs on its own domain and hosting; the database and Stripe account are still shared.' },
      { title: 'It’s slow on purpose', detail: 'Sealing takes a deliberate 30-second ritual. It will never be a fast, impulse-buy product.' },
      { title: '$9 is a small ticket', detail: 'Payment fees take about 6% of each capsule. Real income needs volume, or the planned $25 audio and $49 video capsules.' },
    ],
    person: { name: 'Cristian Niño', role: 'Founder · EterniCapsule, 2025', quote: 'I came to Australia as an IT student with a suitcase and a head full of ideas. I like building things that feel different, and EterniCapsule is the one I couldn’t let go: a place where sealed means sealed, until the day you chose.', photo: '/images/ethernicapsule/cristian_founder.jpg' },
    faq: [
      { q: 'Does it actually work?', a: 'Yes. The complete flow is live: compose, seal, pay $9, scheduled delivery, unlock with a key. Try it yourself in the vault.' },
      { q: 'How is a capsule protected?', a: 'Every capsule opens only with its unique 128-bit key. Keys are never stored, only cryptographic hashes, so a lost key is truly unrecoverable. Messages rest on encrypted infrastructure, and full in-browser encryption is on the roadmap.' },
      { q: 'Why is there no revenue yet?', a: 'It launched recently and the first sale is still pending. We say it plainly because everything on Pyadra is said plainly.' },
    ],
  },

  figuitoon: {
    slug: 'figurines',
    status: 'For sale',
    ways: {
      kind: 'acquire',
      options: [
        { name: 'Take it all', price: '$2,500', terms: 'Store, brand, styles, printer, pipeline, know-how', detail: 'The whole project in one step, 3D printer included.', pick: true },
        { name: 'Make an offer', price: 'Let’s talk', terms: 'A different structure', detail: 'A smaller start, a partnership, or something else. Tell us.' },
      ],
      after: [
        { who: 'You', what: 'The store, the brand and everything it earns from then on.' },
        { who: 'Pyadra', what: 'A 1–5% permanent share, set at closing, plus 5% at closing.' },
      ],
    },
    take: [
      { title: 'The store', detail: 'A polished Shopify store where customers order their figuitoons, with products, inventory and deliveries in one place.' },
      { title: '100+ styles', detail: 'More than one hundred designs across teams, sports and professions, ready to sell.' },
      { title: 'The brand', detail: 'Name, logo, visual identity and the Instagram presence.' },
      { title: 'The 3D printer', detail: 'The Bambu printer that produces every figurine comes with the project.' },
      { title: 'The software pipeline', detail: 'Turns a customer’s photo into a stylised render, then into a print-ready 3D file.' },
      { title: 'The know-how', detail: 'Print settings, measurements, filaments, 3D structure, and what we’ve learned about making it profitable.' },
    ],
    verify: [
      { label: 'figuitoon.com', href: 'https://www.figuitoon.com' },
      { label: 'Instagram', href: 'https://www.instagram.com/figuitoon' },
    ],
    handover: 'Built to run without its builder. The operations manual is still being written and comes with the handover.',
    risks: [
      { title: 'No sales yet', detail: 'The store and the product are real and tested, but no one has bought one yet. You’d be validating demand.' },
      { title: 'Costs not yet measured', detail: 'Print times are still high and the true cost per figurine isn’t calculated yet. Margin is unproven.' },
      { title: 'Quality still maturing', detail: 'It prints and assembles, but finish, waste and calibration still need work to reach premium quality.' },
      { title: 'Built to hand over', detail: 'It’s designed to run without the original builder, but the operations manual is still being written.' },
    ],
    person: { name: 'Charina Oan', role: 'Founder · Figuitoon, 2026', quote: 'I’m from the Philippines and helping people is just who I am. Figuitoon caught me because I love new things: innovating, creating something people haven’t seen before.', photo: '/images/figuitoon/charina_founder.jpg' },
    faq: [
      { q: 'Does it really work end to end?', a: 'Yes. The pipeline runs from photo to physical figurine, and the Shopify store is live for orders. The first paying customer is still pending; everything else has been tested.' },
      { q: 'What exactly is for sale here?', a: 'The whole project: brand, store, files, pipeline and know-how. Buying a figurine is a separate thing, on figuitoon.com.' },
      { q: 'Why $49 per figurine?', a: 'It is a launch price set before the true per-figurine cost is fully measured. It may change once production costs are calculated.' },
    ],
  },

  'kangaroo-cleanup': {
    slug: 'kangaroo-cleanup',
    status: 'Handover ready',
    ways: {
      kind: 'operate',
      anchor: { label: 'Starts at', value: '$2,500 AUD', note: 'plus a share of yearly revenue' },
      options: [
        { name: 'Grow Together', price: '$2,500', terms: '8% of yearly revenue, shared', detail: 'The lowest door in. Keep your cash for the van and tools, and grow it together over the years.', pick: true },
        { name: 'Shared Path', price: '$4,000', terms: '5% of yearly revenue, shared', detail: 'Bigger step in, lighter share. Real upside left for both sides.' },
        { name: 'Take the Wheel', price: '$6,000', terms: '3% of yearly revenue, shared', detail: 'Most up front, smallest share. You keep nearly everything you earn.' },
      ],
      after: [
        { who: 'You', what: '100% of the operation, from day one.' },
        { who: 'Eduardo', what: '3–8% of yearly revenue, by option.' },
        { who: 'Pyadra', what: 'A 1–5% permanent stake, set at closing.' },
      ],
    },
    take: [
      { title: 'The brand & its 5.0 reputation', detail: 'The name, logo and visual identity, plus the public Airtasker profile. Sydney already trusts it; you inherit that trust.' },
      { title: 'The customer channels', detail: 'Business phone, WhatsApp, website, Instagram and email, all live, with customers still calling today.' },
      { title: 'Pricing & recycling know-how', detail: 'What to charge for each job, how to quote, and which Sydney disposal and recycling sites to use, with their real costs.' },
      { title: 'Two years of experience', detail: 'Which jobs make money, which to walk away from, and the mistakes already paid for. You start on year two, not year zero.' },
    ],
    notIncluded: [
      { item: 'The ute', note: 'it was sold. You bring your own vehicle.' },
      { item: 'The ABN', note: 'you operate under your own legal structure.' },
      { item: 'A guarantee', note: 'results depend on your execution.' },
    ],
    proofNote: 'Revenue: ~$23k AUD in FY2024 and ~$30k AUD in FY2025, invoiced gross. Founder-recorded, confirmed in due diligence under a signed agreement.',
    verify: [
      { label: 'Airtasker profile', href: 'https://www.airtasker.com/users/a9226792b540-p-29587653/' },
      { label: 'Instagram', href: 'https://www.instagram.com/kangaroocleanup' },
      { label: 'Website', href: 'https://kangaroocleanup.com.au' },
    ],
    risks: [
      { title: 'It’s physical work', detail: 'Lifting, logistics, showing up. No remote version. You have to be in Sydney.' },
      { title: 'Competition is real', detail: 'Other operators work this city. Demand shifts by season and suburb.' },
      { title: 'Reputation is daily', detail: 'The 5.0 rating helps you win. It doesn’t win for you. Keep the standard.' },
      { title: 'Numbers get verified', detail: 'Founder-recorded revenue, confirmed in due diligence. Requires a signed agreement.' },
    ],
    person: { name: 'Eduardo Díaz', role: 'Founder · Sydney 2023 to Perth 2026', quote: 'I showed up to a country where I knew nobody, bought a beat-up ute, and built this with my own hands, one honest job at a time. I’m only letting it go because I had to move, not because I stopped believing in it.', photo: '/images/kangaroo/kangaroo_founder.jpg' },
    faq: [
      { q: 'Is this real?', a: 'Yes, and you don’t have to take my word for it. The Airtasker profile is public; check the reviews, the rating and the completed jobs yourself before you ever message me.' },
      { q: 'Why did it stop?', a: 'The founder relocated to Perth and sold the ute. Not because of lack of demand.' },
      { q: 'If you’re in Perth, what’s really transferable?', a: 'Everything except the physical presence, which was always the operator’s job. The brand, the 5.0 reputation, the playbook, the disposal contacts and the live channels all transfer.' },
      { q: 'What if it doesn’t work?', a: 'The demand is proven and the channels are live. What’s left is execution. Every risk is written down here.' },
    ],
  },

  orbit: {
    slug: 'orbit',
    status: 'For support',
    ways: {
      kind: 'support',
      options: [
        { name: 'Signal Carrier', price: '$10', terms: 'Your name in the archive + a permanent credential', detail: 'A permanent credential (O77-S1-XXXXXX) by email, and your name in the archive.', pick: true, checkout: 10 },
        { name: 'Archive Node', price: '$20', terms: 'Everything above + early access to Season 2', detail: 'Hear Season 2 before anyone else.', checkout: 20 },
        { name: 'Transmission Keeper', price: '$50', terms: 'Everything above + direct updates from Pablo', detail: 'Pablo writes to you as the season is made.', checkout: 50 },
        { name: 'Journey Patron', price: '$100–500', terms: 'Name in S2 credits, behind-the-scenes, merch', detail: 'Your name in the Season 2 credits. The exact amount is set at checkout.', checkout: 100 },
        { name: 'Co-Producer / Sponsor', price: '$1,000+', terms: 'Your brand named in the podcast', detail: 'For a brand or business that wants to be heard in the show.', checkout: 1000 },
        { name: 'Big investor', price: 'Let’s talk', terms: 'A private conversation with Pablo', detail: 'Bigger support or a partnership: a conversation, not a checkout.' },
      ],
      after: [
        { who: 'You', what: 'A permanent credential and the perks of your layer. Never ownership, never a return.' },
        { who: 'Pablo', what: 'The project and full creative control.' },
      ],
    },
    take: [
      { title: 'More listeners', detail: 'Growing the audience on YouTube and Spotify, getting Season 1 in front of the people it was made for.' },
      { title: 'Seasons 2, 3 and 4', detail: 'Recording and releasing the next three seasons: life, art and music, one orbit at a time.' },
      { title: 'The clothing brand', detail: 'orbit77.shop is live today. Support helps refresh the designs and grow the merch that funds the show.' },
      { title: 'A physical home', detail: 'A space in Sydney to record the podcast, paint and sell the clothing: studio, gallery and store in one.' },
      { title: 'Events & parties', detail: 'Live Orbit 77 nights with sponsors and brands: the conversations, in a room full of people.' },
      { title: 'A real community', detail: 'The Orbit 77 community, each member with their own credential, permanently in the archive.' },
    ],
    notIncluded: [
      { item: 'Equity', note: 'no shares, no ownership. Pablo keeps the project.' },
      { item: 'A return', note: 'this is a contribution, not an investment.' },
      { item: 'Creative votes', note: 'no influence on episodes, guests or direction.' },
    ],
    verify: [
      { label: 'YouTube', href: 'https://www.youtube.com/@Orbit77Podcast' },
      { label: 'orbit77.shop', href: 'https://orbit77.shop/' },
    ],
    risks: [
      { title: 'The audience is small', detail: 'Early YouTube channel, supporters still being counted. You’d be backing it before the proof. That’s the point, and the risk.' },
      { title: 'Monetization isn’t active yet', detail: 'No AdSense, no Spotify revenue, no sponsors yet. Today the only revenue is credentials and merch.' },
      { title: 'Production is real work', detail: 'A podcast doesn’t run itself. Episodes need recording, editing and publishing, every season.' },
      { title: 'Draft tiers', detail: 'The goal is set: $10,000 AUD for Season 2. The tiers are v1, still being refined with Pablo; the exact perks may shift.' },
    ],
    person: { name: 'Pablo Ramírez', role: 'Founder · Orbit 77, Sydney 2025', quote: 'I’m a graphic designer who likes to listen, help and build things with other people. Orbit 77 is where all of that lives: art, deep conversations, and orbiting at high frequencies.', photo: '/images/orbit/pablo_founder.jpg' },
    faq: [
      { q: 'What do supporters get?', a: 'A permanent credential engraved in the archive (O77-S1-XXXXXX), founding member status, early Season 2 access, and direct founder updates.' },
      { q: 'Is this an investment? Do I own a piece?', a: 'No. You’re funding the journey, not buying equity. Pablo keeps the project and creative control. Supporters get recognition, perks and a permanent credential. Never ownership, never a return, never a vote on the content.' },
      { q: 'Where does the money go?', a: 'Straight into Season 2 production. The progress on this page is live, and every credential moves it.' },
    ],
  },

  'momentos-eternos': {
    slug: 'momentos-eternos',
    status: 'For sale',
    ways: {
      kind: 'acquire',
      options: [
        { name: 'Operator', price: '$750', terms: 'Lower up front · a larger share per sale', detail: 'Switch it back on and run it; Pyadra and the creator keep a share of each sale.', pick: true },
        { name: 'Owner', price: '$1,500', terms: 'More up front · a smaller share per sale', detail: 'Take it whole; you keep more of every song you sell.' },
        { name: 'Make an offer', price: 'Let’s talk', terms: 'A different structure', detail: 'Including taking it independent.' },
      ],
      after: [
        { who: 'You', what: 'The site, code, brand, content and documentation, and what it earns.' },
        { who: 'Cristian', what: 'A royalty for life, paid through Pyadra (% set in the agreement).' },
        { who: 'Pyadra', what: 'A permanent share by option, plus 5% at closing.' },
      ],
    },
    take: [
      { title: 'The site, with payments', detail: 'A working Next.js site with payments, automatic song generation, a studio panel, bilingual emails and gift pages with a QR code.' },
      { title: 'The brand', detail: 'The Momentos Eternos name, the characters M and E, ad videos and images, and social copy.' },
      { title: 'The product', detail: 'Three packages, six cover styles with examples and five sample songs.' },
      { title: 'The playbook', detail: 'A README with flows and pitfalls, the content catalogue, production scripts and cover prompts per style.' },
    ],
    verify: [
      { label: 'Instagram', href: 'https://www.instagram.com/momentos_eternos_io/' },
      { label: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61593612624515' },
    ],
    handover: 'Before a handover: the site reopens and a test order goes through end to end, and the studio operator gets a written guide to the 3-hour production.',
    risks: [
      { title: 'Very short sales history', detail: 'Only 3 sales; demand at scale is not proven.' },
      { title: 'Paused', detail: 'The site is closed to new orders until an operator restarts it.' },
      { title: 'A human promise', detail: 'Premium and Signature songs are made by hand in 3 hours or refunded; it needs someone available.' },
      { title: 'Supplier dependency', detail: 'Automatic songs depend on MusicGPT: its links expire in about 24 hours and it bans real artist names.' },
      { title: 'AI rights', detail: 'Rights over AI-generated music and covers depend on the providers’ terms; to verify.' },
      { title: 'No version control', detail: 'The code lives in one local folder; a buyer should move it to version control.' },
    ],
    person: { name: 'Cristian Ruiz', role: 'Founder of Momentos Eternos · Co-founder of Pyadra', quote: 'Some stories deserve more than a card. They deserve a song that stays.', photo: CRIS_RUIZ },
  },

  urelit: {
    slug: 'urelit',
    status: 'For sale',
    ways: {
      kind: 'acquire',
      options: [
        { name: 'Operator', price: '$1,000', terms: 'Lower up front · a larger share per sale', detail: 'Launch it and run it; Pyadra and the creator keep a share of each subscription.', pick: true },
        { name: 'Owner', price: '$2,000', terms: 'More up front · a smaller share per sale', detail: 'Take it whole; you keep more of every subscription.' },
        { name: 'Make an offer', price: 'Let’s talk', terms: 'A different structure', detail: 'Fund the launch, run it with us, or something else.' },
      ],
      after: [
        { who: 'You', what: 'The app, code, brand, social accounts and documentation.' },
        { who: 'Cristian', what: 'A royalty for life, paid through Pyadra (% set in the agreement).' },
        { who: 'Pyadra', what: 'A permanent share by option, plus 5% at closing.' },
      ],
    },
    take: [
      { title: 'The live app and its code', detail: 'An installable web app that remembers every set and tells you the weight, reps and effort for next time.' },
      { title: 'The URELIT brand and its social accounts', detail: 'The name, the identity, and the Instagram and Facebook accounts.' },
      { title: 'Free and Premium plans, ready to charge', detail: 'A 14-day Premium trial and a $4.99 monthly plan. Payments run in test mode today.' },
    ],
    verify: [
      { label: 'urelit.app', href: 'https://urelit.app' },
      { label: 'Instagram', href: 'https://www.instagram.com/urelit.app/' },
    ],
    risks: [
      { title: 'No revenue yet', detail: 'Payments run in test mode; nobody has paid yet.' },
      { title: 'Small test group', detail: 'Only 5 friends have used it; retention with strangers is unknown.' },
      { title: 'Legal review pending', detail: 'Terms and privacy were not reviewed by a lawyer; that must happen before charging.' },
      { title: 'No version control', detail: 'The code lives in one local folder with a written changelog; a buyer should move it to version control.' },
      { title: 'Crowded market', detail: 'Competes with Hevy, Strong, Fitbod and Boostcamp.' },
    ],
    person: { name: 'Cristian Ruiz', role: 'Founder of URELIT · Co-founder of Pyadra', quote: 'An hour in the gym should never be wasted. I built URELIT so nobody has to guess what to lift next.', photo: CRIS_RUIZ },
  },

  wemait: {
    slug: 'wemait',
    status: 'For sale',
    ways: {
      kind: 'acquire',
      options: [
        { name: 'Operator', price: '$1,500', terms: 'Lower up front · a larger share per client', detail: 'Bring it to coaches and run it; Pyadra and the creator keep a share of each subscription.', pick: true },
        { name: 'Owner', price: '$3,000', terms: 'More up front · a smaller share per client', detail: 'Take it whole; you keep more of every coach’s plan.' },
        { name: 'Make an offer', price: 'Let’s talk', terms: 'A different structure', detail: 'Fund the launch, run it for its coaches, or something else.' },
      ],
      after: [
        { who: 'You', what: 'The coach, client and admin apps, the brand and the documentation.' },
        { who: 'Cristian', what: 'A royalty for life, paid through Pyadra (% set in the agreement).' },
        { who: 'Pyadra', what: 'A permanent share by option, plus 5% at closing.' },
      ],
    },
    take: [
      { title: 'Coach, client and admin apps with their code', detail: 'A mobile and web platform where coaches run their clients’ training and nutrition, with 750+ automated tests.' },
      { title: 'The WEMAIT brand, domain and 16 tutorial videos', detail: 'The name, wemait.app and a tutorial library that teaches coaches the system.' },
      { title: 'A pricing model by active clients, ready to switch on', detail: 'Plans priced by how many clients a coach has, not charging yet.' },
    ],
    verify: [
      { label: 'wemait.app', href: 'https://wemait.app' },
      { label: 'The full demo', href: 'https://wemait.app/app/' },
    ],
    risks: [
      { title: 'No real users yet', detail: 'Coaches are in conversation, but none uses the app for real yet.' },
      { title: 'Not in the stores', detail: 'There are no signed iPhone or Android apps; store accounts are still to be opened.' },
      { title: 'Payments not built', detail: 'Subscriptions and coach charges (Stripe Connect) don’t exist yet.' },
      { title: 'Capacity unproven', detail: 'The target of 200 clients has not been load-tested; external backups are pending.' },
      { title: 'Health data', detail: 'It stores health and nutrition data; legal review and moderation are pending.' },
    ],
    person: { name: 'Cristian Ruiz', role: 'Founder of WEMAIT · Co-founder of Pyadra', quote: 'Coaches change lives every day. WEMAIT exists so they can prove it, with data, not promises.', photo: CRIS_RUIZ },
  },

  byndi: {
    slug: 'byndi',
    status: 'For sale',
    ways: {
      kind: 'acquire',
      options: [
        { name: 'Operator', price: '$750', terms: 'Lower up front · a larger share per sale', detail: 'Publish it in the stores and run it; Pyadra keeps a share of each subscription.', pick: true },
        { name: 'Owner', price: '$1,500', terms: 'More up front · a smaller share per sale', detail: 'Take it whole; you keep more of every subscription.' },
        { name: 'Make an offer', price: 'Let’s talk', terms: 'A different structure', detail: 'Tell us what you have in mind.' },
      ],
      after: [
        { who: 'You', what: 'The app, its code and the Byndi name.' },
        { who: 'Pyadra', what: 'A permanent share by option, plus 5% at closing.' },
      ],
    },
    take: [
      { title: 'The finished app and its code', detail: 'A cycle calendar with phase predictions, a guide to the five phases, SOS guides, daily missions, a journal and insights.' },
      { title: 'Two languages', detail: 'English and Spanish, chosen at onboarding.' },
      { title: 'Private by design', detail: 'Cycle data stays on the phone; no Pyadra server receives it.' },
      { title: 'A Plus plan, ready to switch on', detail: 'The paywall exists with monthly and yearly prices; purchases are not switched on yet.' },
    ],
    risks: [
      { title: 'Not in the stores yet', detail: 'It is built and in testing; publishing on Google Play and the App Store is still to do.' },
      { title: 'Payments not switched on', detail: 'Plus shows its prices, but nothing can be bought yet.' },
      { title: 'Health data about another person', detail: 'Its privacy policy and store declarations need a legal review before publishing.' },
      { title: 'The name is not confirmed', detail: 'The Byndi domain and trademark are still to be checked.' },
      { title: 'One copy of the code', detail: 'The repository has no remote backup yet.' },
    ],
  },

  backmate: {
    slug: 'backmate',
    status: 'Forming',
    ways: {
      kind: 'forming',
      options: [
        { name: 'Follow it', price: 'Free', terms: 'An email when it opens', detail: 'Leave your email and we’ll write when BackMate is ready to meet.', pick: true },
        { name: 'Help build it', price: 'Let’s talk', terms: 'Bring work or skills', detail: 'If you could help it get going, tell us how.' },
      ],
      after: [],
    },
    take: [],
    risks: [],
  },
};

/** The dashboard of a lot, by its URL segment. */
export const roomBySlug = (slug: string) => Object.entries(ROOMS).find(([, r]) => r.slug === slug) ?? null;

/** The lowest way in, as Galaxy shows it before the dashboard opens —
 *  "From $750". Prices are the owner's estimates (see the note above). */
export function priceFrom(id: string): string | null {
  const room = ROOMS[id];
  if (!room) return null;
  if (room.ways.kind === 'forming') return 'Free to follow';
  const amounts = room.ways.options
    .map((o) => o.price.match(/\$([\d,]+)/)?.[1])
    .filter((v): v is string => !!v)
    .map((v) => Number(v.replace(/,/g, '')));
  return amounts.length ? `From $${Math.min(...amounts).toLocaleString('en-AU')}` : null;
}
