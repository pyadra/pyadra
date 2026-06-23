'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import PyadraLogo from '@/app/components/brand/PyadraLogo';

/* ------------------------------------------------------------------ */
/*  PYADRA — Project № 03 · Figuitoon                                  */
/*  Design language: family.co — same skeleton as Kangaroo Cleanup.    */
/*                                                                     */
/*  Status per Figuitoon.md: FORMING — concept validated, two          */
/*  prototypes, no store yet. This page is honest about that.          */
/*  Copy is a working skeleton — adjust freely.                       */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'eadiaz96@gmail.com';

const ENTER = 0.75;
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };
const pop = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-70px' },
  transition: SPRING,
};

const STATS = [
  { value: '2', label: 'physical prototypes made' },
  { value: '$99', label: 'per figurine · AUD' },
  { value: 'Real', label: 'validated with strangers' },
  { value: '100%', label: 'available to own' },
];

const TAKEOVER = [
  { num: '01', title: 'A working pipeline', body: 'Photo → AI stylization → 3D model → Blender cleanup → color print. The whole workflow exists and has produced real figurines.' },
  { num: '02', title: 'A validated emotion', body: 'Two prototypes tested in the real world. Strangers picked them up, asked questions, wanted one. That reaction is the product.' },
  { num: '03', title: 'The physical gateway', body: 'Every figurine carries a QR code that leads to Pyadra — a physical object that pulls real people into a digital ecosystem.' },
  { num: '04', title: 'Concepts ready to launch', body: 'Profession collections, event editions (World Cup), B2B gifts — product lines documented and waiting for an operator.' },
];

const STORY = [
  { year: 'The idea', text: 'Digital projects are invisible in the physical world. A miniature of yourself is not — it sits on a desk, travels in a bag, starts conversations.' },
  { year: 'Prototypes', text: 'Two figurines produced with the AI-to-3D pipeline. Imperfect, real, and in people’s hands.' },
  { year: 'The test', text: 'Uber passengers noticed them, picked them up, asked where to get one. Curiosity confirmed — before any marketing.' },
  { year: 'Today', text: 'Forming. No store yet, no first sale yet. What exists is the pipeline, the prototypes and the demand signal.' },
];

const INCLUDED = [
  'AI-to-3D production workflow, documented',
  'Two physical prototypes',
  'Product line concepts (professions, events, B2B)',
  'QR-to-Pyadra gateway concept',
  'Pricing and margin analysis ($99 / unit)',
  'Supplier and printer research',
];

const THE_DEAL = [
  { item: 'Looking for', note: 'an operational partner — printing, fulfillment, store operations' },
  { item: 'Indicative valuation', note: '$5,000 AUD · 100% available' },
  { item: 'Pyadra keeps', note: 'ecosystem display fee — exact % defined at closing' },
];

const DEALS = [
  {
    name: 'First customers',
    price: '$99',
    sub: 'AUD · when the store opens',
    desc: 'A miniature version of you, crafted from a photo. Join the waitlist and be first in line.',
    chip: null,
    featured: false,
    cta: 'Join the waitlist',
    href: `mailto:${CONTACT_EMAIL}?subject=Figuitoon%20%E2%80%94%20Waitlist`,
  },
  {
    name: 'Operational partner',
    price: 'Let’s talk',
    sub: 'run production, own a stake',
    desc: 'You take printing, fulfillment and the store. Eduardo keeps creative direction. The margin is yours to build.',
    chip: 'Most needed',
    featured: true,
    cta: 'Start a conversation',
    href: `mailto:${CONTACT_EMAIL}?subject=Figuitoon%20%E2%80%94%20Operational%20Partner`,
  },
  {
    name: 'Take it completely',
    price: 'Let’s talk',
    sub: '100% · operate it anywhere',
    desc: 'Full acquisition of the concept, pipeline and product lines. Creator retains a royalty and advisory role.',
    chip: null,
    featured: false,
    cta: 'Start a conversation',
    href: `mailto:${CONTACT_EMAIL}?subject=Figuitoon%20%E2%80%94%20Full%20Acquisition`,
  },
];

const RISKS = [
  { t: 'There is no store yet', b: 'Shopify isn’t live and there are no paying customers. You’d be entering at the forming stage — the earliest and riskiest point.' },
  { t: 'Margins are tight today', b: 'External printing costs ~$75 per figure against a $99 price. An own printer drops that to ~$30 — that purchase is the unlock.' },
  { t: 'Production is manual', b: 'Blender cleanup is a real bottleneck. Scaling needs either skills, automation, or a partner who owns this step.' },
  { t: 'The brand is unfinished', b: 'Name recently settled, logo and identity still forming. Whoever enters now shapes what Figuitoon becomes.' },
];

const FAQ = [
  { q: 'Can I buy a figurine today?', a: 'Not yet — the store is in development. Join the waitlist and you’ll be first when it opens.' },
  { q: 'What exactly exists right now?', a: 'A working AI-to-3D pipeline, two physical prototypes, validated curiosity from real strangers, and documented product lines. No store, no sales — said plainly.' },
  { q: 'What kind of partner is needed?', a: 'Someone operational: 3D printing, fulfillment, store management. The creative direction exists; the production engine needs an owner.' },
  { q: 'Why $99?', a: 'It covers external production today with a thin margin. With an own printer the cost drops to ~$30, making roughly $69 per figure.' },
];

/* ---------- pieces ---------- */

function PillButton({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 350, damping: 17 }}
      className={`inline-block rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight ${
        primary
          ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/25'
          : 'bg-white text-[#1A1C1A] ring-1 ring-[#1A1C1A]/10 shadow-sm'
      }`}
    >
      {children}
    </motion.a>
  );
}

/* The artifact — Figuitoon's dark sphere, grabbable. */
function PhysicalSphere() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <div aria-hidden className="absolute -inset-16 pointer-events-none" style={{ background: 'radial-gradient(50% 50% at 50% 45%, rgba(5,150,105,0.12), transparent 70%)' }} />
      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}>
        <motion.div
          drag
          dragSnapToOrigin
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 300, bounceDamping: 18 }}
          whileHover={{ scale: 1.04 }}
          whileDrag={{ scale: 1.08, rotate: 3 }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="relative cursor-grab active:cursor-grabbing touch-none w-56 h-56 md:w-72 md:h-72"
        >
          <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#3A4A3E,#1A1C1A,#050A07)] shadow-[-14px_18px_38px_rgba(10,18,14,0.4)] overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.25)_270deg,transparent_360deg)]"
            />
          </div>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: ENTER + 1.6, ...SPRING }}
            className="absolute -top-2 -right-2 rounded-full bg-white px-3.5 py-1.5 text-[11px] font-semibold text-[#1A1C1A] shadow-md ring-1 ring-[#1A1C1A]/10 rotate-3"
          >
            grab me ✦
          </motion.span>
        </motion.div>
      </motion.div>
      <p className="mt-6 text-center text-xs text-[#6B8070] font-medium">
        Forming — the next sphere to come alive in Galaxy
      </p>
    </div>
  );
}

/* ---------- the page ---------- */

export default function FiguitoonShowcase() {
  return (
    <div className="bg-[#EDEFED] text-[#1A1C1A] font-sans overflow-x-clip antialiased selection:bg-[#059669] selection:text-white min-h-screen">

      {/* floating pill nav */}
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: ENTER, ...SPRING }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center px-4"
      >
        <div className="flex items-center gap-1 rounded-full bg-white/80 backdrop-blur-md shadow-lg shadow-[#1A1C1A]/5 ring-1 ring-[#1A1C1A]/5 pl-5 pr-1.5 py-1.5">
          <Link href="/" aria-label="Pyadra · Home" className="flex items-center gap-2 mr-2 group">
            <PyadraLogo size={22} />
            <span className="text-sm font-bold tracking-tight transition-colors group-hover:text-[#059669]">
              Pyadra
            </span>
          </Link>
          <Link href="/exhibitions/galaxy" className="hidden sm:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#3A4A3E] hover:bg-[#EDEFED] transition-colors">
            ← Galaxy
          </Link>
          <span className="hidden md:block rounded-full px-3.5 py-2 text-[13px] font-medium text-[#6B8070]">
            Project № 03
          </span>
          <motion.a
            href={`mailto:${CONTACT_EMAIL}?subject=Figuitoon%20%E2%80%94%20Contact`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 17 }}
            className="rounded-full bg-[#1A1C1A] text-white px-5 py-2 text-[13px] font-semibold"
          >
            Contact
          </motion.a>
        </div>
      </motion.nav>

      {/* ============ HERO ============ */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.10), transparent 65%)' }} />
          <div className="absolute -bottom-56 -right-32 w-[720px] h-[720px] rounded-full opacity-60" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.10), transparent 65%)' }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 w-full grid md:grid-cols-[7fr_5fr] gap-14 md:gap-10 items-center pt-28 pb-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: ENTER + 0.1, ...SPRING }}
              className="inline-flex items-center gap-2 rounded-full bg-[#059669]/10 text-[#047857] px-4 py-2 text-[12px] font-semibold mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              Forming · store in development
            </motion.span>

            <h1 className="text-4xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.08] md:leading-[1.02] mb-7">
              {['A miniature you,', 'made real and', 'shipped home.'].map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ delay: ENTER + 0.2 + i * 0.09, type: 'spring', stiffness: 110, damping: 20 }}
                  >
                    {i === 2 ? <span className="text-[#059669]">{line}</span> : line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ENTER + 0.55, ...SPRING }}
              className="text-lg md:text-xl text-[#3A4A3E] leading-relaxed max-w-md mb-10"
            >
              A physical collectible of yourself — transformed by AI, printed
              in 3D, delivered to your door. Personal, artistic, permanent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ENTER + 0.7, ...SPRING }}
              className="flex items-center gap-3 flex-wrap"
            >
              <PillButton href={`mailto:${CONTACT_EMAIL}?subject=Figuitoon%20%E2%80%94%20Waitlist`} primary>
                Join the waitlist →
              </PillButton>
              <PillButton href="#own">Become the operator</PillButton>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: ENTER + 0.5, type: 'spring', stiffness: 90, damping: 16 }}
            className="mx-auto"
          >
            <PhysicalSphere />
          </motion.div>
        </div>
      </section>

      {/* ============ PROOF STRIP ============ */}
      <section className="max-w-6xl mx-auto px-6 pb-24 md:pb-32 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...pop}
              transition={{ ...SPRING, delay: i * 0.07 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-[#1A1C1A]/5"
            >
              <div className="text-3xl md:text-4xl font-bold tracking-tight mb-1">{stat.value}</div>
              <div className="text-[13px] font-medium text-[#6B8070]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ WHAT YOU TAKE OVER ============ */}
      <section id="own" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 max-w-2xl">
          The idea works.
          <span className="text-[#059669]"> It needs an operator.</span>
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] max-w-md mb-14">
          Four things already exist — the fifth, the engine, could be you.
        </motion.p>

        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {TAKEOVER.map((item, i) => (
            <motion.div
              key={item.num}
              {...pop}
              transition={{ ...SPRING, delay: i * 0.06 }}
              whileHover={{ y: -5 }}
              className="group rounded-[28px] bg-white p-8 md:p-10 shadow-sm ring-1 ring-[#1A1C1A]/5 hover:shadow-xl hover:shadow-[#059669]/5 transition-shadow duration-300"
            >
              <span className="inline-flex w-10 h-10 items-center justify-center rounded-2xl bg-[#059669]/10 text-[#047857] text-[13px] font-bold mb-6 group-hover:bg-[#059669] group-hover:text-white transition-colors duration-300">
                {item.num}
              </span>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2.5">{item.title}</h3>
              <p className="text-[15px] text-[#3A4A3E] leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ THE STORY ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="rounded-[36px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-8 md:p-16 overflow-hidden relative">
          <div aria-hidden className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(5,150,105,0.07), transparent 65%)' }} />
          <motion.h2 {...pop} className="text-3xl md:text-5xl font-bold tracking-[-0.03em] mb-3 relative">
            Where it comes from.
          </motion.h2>
          <motion.p {...pop} className="text-lg text-[#3A4A3E] max-w-md mb-12 relative">
            The whole story — including the parts that aren&rsquo;t finished.
          </motion.p>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {STORY.map((step, i) => (
              <motion.div key={step.year} {...pop} transition={{ ...SPRING, delay: i * 0.08 }}>
                <span className={`inline-block rounded-full px-3.5 py-1.5 text-[12px] font-bold mb-4 ${
                  i === STORY.length - 1 ? 'bg-[#059669] text-white' : 'bg-[#EDEFED] text-[#3A4A3E]'
                }`}>
                  {step.year}
                </span>
                <p className="text-[15px] text-[#3A4A3E] leading-relaxed">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INCLUDED / THE DEAL ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-14 max-w-2xl">
          Everything on the table.
          <span className="text-[#059669]"> Nothing under it.</span>
        </motion.h2>

        <div className="grid md:grid-cols-[3fr_2fr] gap-4 md:gap-5">
          <motion.div {...pop} className="rounded-[28px] bg-white p-8 md:p-10 shadow-sm ring-1 ring-[#1A1C1A]/5">
            <h3 className="text-lg font-bold tracking-tight mb-6">Comes with it</h3>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
              {INCLUDED.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ ...SPRING, delay: i * 0.05 }}
                  className="flex items-start gap-3 text-[15px] text-[#1A1C1A]"
                >
                  <span className="mt-1 flex w-5 h-5 shrink-0 items-center justify-center rounded-full bg-[#059669]/10 text-[#059669] text-[11px] font-bold">✓</span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div {...pop} transition={{ ...SPRING, delay: 0.1 }} className="rounded-[28px] bg-[#1A1C1A] text-white p-8 md:p-10 shadow-sm">
            <h3 className="text-lg font-bold tracking-tight mb-6">The deal, plainly</h3>
            <ul className="space-y-5">
              {THE_DEAL.map((entry) => (
                <li key={entry.item} className="text-[15px] leading-relaxed">
                  <span className="font-semibold">{entry.item}</span>
                  <span className="text-white/55"> — {entry.note}</span>
                </li>
              ))}
            </ul>
            <p className="text-[13px] text-white/45 mt-8 leading-relaxed">
              Final terms are agreed in conversation and reviewed legally before anything closes.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ FOUNDER NOTE ============ */}
      <section className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <motion.div {...pop} className="rounded-[36px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-8 md:p-14 text-center">
          <p className="font-serif italic text-2xl md:text-[1.85rem] font-normal leading-snug text-[#1A1C1A] mb-8">
            &ldquo;A website gets closed. A figurine sits on a desk, travels in a bag,
            and starts conversations.
            <span className="text-[#059669]"> The physical object is the door into everything we build.</span>&rdquo;
          </p>
          <p className="text-[15px] font-bold tracking-tight">Eduardo Díaz</p>
          <p className="text-[13px] text-[#6B8070] font-medium mb-8">Creator · Figuitoon, 2026</p>
          <PillButton href={`mailto:${CONTACT_EMAIL}?subject=Figuitoon%20%E2%80%94%20To%20Eduardo`}>
            Write to Eduardo
          </PillButton>
        </motion.div>
      </section>

      {/* ============ WAYS IN ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 text-center">
          Three ways in.
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] text-center max-w-md mx-auto mb-14">
          Acquisitions happen in conversation — never through a checkout.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-4 md:gap-5 items-stretch">
          {DEALS.map((deal, i) => (
            <motion.div
              key={deal.name}
              {...pop}
              transition={{ ...SPRING, delay: i * 0.08 }}
              whileHover={{ y: -6 }}
              className={`relative rounded-[28px] p-8 md:p-10 flex flex-col ${
                deal.featured
                  ? 'bg-[#1A1C1A] text-white shadow-xl shadow-[#1A1C1A]/15'
                  : 'bg-white shadow-sm ring-1 ring-[#1A1C1A]/5'
              }`}
            >
              {deal.chip && (
                <span className="absolute -top-3 left-8 rounded-full bg-[#059669] text-white px-3.5 py-1.5 text-[11px] font-bold shadow-md">
                  {deal.chip}
                </span>
              )}
              <h3 className="text-lg font-bold tracking-tight mb-6">{deal.name}</h3>
              <div className="text-4xl md:text-5xl font-bold tracking-tight mb-1">{deal.price}</div>
              <div className={`text-[13px] font-medium mb-6 ${deal.featured ? 'text-white/50' : 'text-[#6B8070]'}`}>{deal.sub}</div>
              <p className={`text-[15px] leading-relaxed mb-8 flex-1 ${deal.featured ? 'text-white/70' : 'text-[#3A4A3E]'}`}>{deal.desc}</p>
              <motion.a
                href={deal.href}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 350, damping: 17 }}
                className={`block text-center rounded-full px-6 py-3.5 text-sm font-semibold ${
                  deal.featured
                    ? 'bg-[#059669] text-white shadow-lg shadow-[#059669]/30'
                    : 'bg-[#EDEFED] text-[#1A1C1A] hover:bg-[#059669]/10'
                }`}
              >
                {deal.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ THE HONEST PART ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 max-w-2xl">
          The honest part.
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] max-w-md mb-14">
          This project is forming — and we say exactly what that means.
        </motion.p>

        <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
          {RISKS.map((risk, i) => (
            <motion.div
              key={risk.t}
              {...pop}
              transition={{ ...SPRING, delay: i * 0.06 }}
              className="rounded-[28px] bg-white p-7 md:p-8 shadow-sm ring-1 ring-[#1A1C1A]/5"
            >
              <h3 className="text-lg font-bold tracking-tight mb-2">{risk.t}</h3>
              <p className="text-[15px] text-[#3A4A3E] leading-relaxed">{risk.b}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-5xl font-bold tracking-[-0.03em] text-center mb-12">
          Quick answers.
        </motion.h2>
        <div className="space-y-3">
          {FAQ.map((entry, i) => (
            <motion.details
              key={entry.q}
              {...pop}
              transition={{ ...SPRING, delay: i * 0.05 }}
              className="group rounded-[22px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 px-7 py-5 open:pb-7"
            >
              <summary className="flex items-center justify-between gap-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <h3 className="text-base md:text-lg font-bold tracking-tight">{entry.q}</h3>
                <span className="flex w-7 h-7 shrink-0 items-center justify-center rounded-full bg-[#EDEFED] text-[#3A4A3E] text-sm font-bold transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="text-[15px] text-[#3A4A3E] leading-relaxed mt-4 max-w-xl">{entry.a}</p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* ============ FINAL ============ */}
      <section className="relative max-w-6xl mx-auto px-6 py-28 md:py-40 text-center overflow-hidden">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[420px] pointer-events-none" style={{ background: 'radial-gradient(60% 100% at 50% 100%, rgba(5,150,105,0.10), transparent 70%)' }} />
        <motion.h2 {...pop} className="relative text-5xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.02] mb-7">
          Someone will build this.
        </motion.h2>
        <motion.p {...pop} className="relative text-lg md:text-xl text-[#3A4A3E] max-w-md mx-auto mb-10">
          The pipeline works, the demand signal is real, and 100% is on the table.
        </motion.p>
        <motion.div {...pop} className="relative flex items-center justify-center gap-3 flex-wrap">
          <PillButton href={`mailto:${CONTACT_EMAIL}?subject=Figuitoon%20%E2%80%94%20Operational%20Partner`} primary>
            Become the operator →
          </PillButton>
          <PillButton href={`mailto:${CONTACT_EMAIL}?subject=Figuitoon%20%E2%80%94%20Waitlist`}>Join the waitlist</PillButton>
        </motion.div>
      </section>

      {/* footer */}
      <footer className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex items-center justify-between flex-wrap gap-4 border-t border-[#1A1C1A]/8 pt-7">
          <span className="text-[12px] font-medium text-[#6B8070]">© 2026 Pyadra · We document. We verify. You decide.</span>
          <div className="flex gap-5">
            <Link href="/exhibitions/galaxy" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">Galaxy</Link>
            <Link href="/" className="text-[12px] font-medium text-[#6B8070] hover:text-[#059669] transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
