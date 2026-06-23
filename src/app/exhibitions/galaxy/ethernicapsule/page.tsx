'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import PyadraLogo from '@/app/components/brand/PyadraLogo';

/* ------------------------------------------------------------------ */
/*  PYADRA — Project № 01 · EterniCapsule                              */
/*  The showcase page — the product itself lives at ./experience       */
/*  (the ceremonial app: entry ritual, compose, seal, unlock).         */
/*                                                                     */
/*  Design language: family.co — same skeleton as Kangaroo Cleanup.    */
/*  Copy is a working skeleton from EterniCapsule.md — adjust freely.  */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'eadiaz96@gmail.com';
const EXPERIENCE_URL = '/exhibitions/galaxy/ethernicapsule/experience';

const ENTER = 0.75;
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };
const pop = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-70px' },
  transition: SPRING,
};

const STATS = [
  { value: 'Live', label: 'fully operational' },
  { value: '$9', label: 'per capsule · fixed' },
  { value: 'Zero', label: 'knowledge — we can’t read it' },
  { value: '100%', label: 'available to own' },
];

const TAKEOVER = [
  { num: '01', title: 'A working product', body: 'The full flow is built and deployed: compose, seal, pay, deliver, unlock. Stripe live, daily delivery cron, guardian system.' },
  { num: '02', title: 'A ceremonial brand', body: 'The breathing 3D capsule, the entry ritual, the audio engine, the copy voice — an experience no competitor can copy-paste.' },
  { num: '03', title: 'Zero-knowledge engine', body: 'Messages are encrypted in the browser. The server stores only ciphertext and hashed keys. Not even Pyadra can read a capsule.' },
  { num: '04', title: 'Room to grow', body: 'Audio capsules ($25), video capsules ($49) and white-label licensing for memorial, therapy and legal services — all documented, none built yet.' },
];

const STORY = [
  { year: '2026', text: 'Built around one question: where do the words go that can’t be said today?' },
  { year: 'The ritual', text: 'A 30-second entry of darkness and slow text. No skip button. The friction is the product.' },
  { year: 'The vault', text: 'Client-side AES encryption, three keys — sender, recipient, guardian. Sealed means sealed.' },
  { year: 'Today', text: 'Fully functional and deployed. Waiting for its first real sale — that honesty is part of the deal.' },
];

const INCLUDED = [
  'Full source code — Next.js, React, TypeScript',
  '3D capsule interface and entry ritual',
  'Client-side encryption engine (AES + SHA-256)',
  'Stripe checkout, live mode',
  'Scheduled delivery system (daily cron + email)',
  'Guardian emergency-access system',
];

const THE_DEAL = [
  { item: 'Pyadra keeps', note: '$1 of every $9 generated (~11%) — hosting and operation' },
  { item: 'Operational effort', note: 'autonomous system — it runs itself on Pyadra infrastructure' },
  { item: 'Indicative valuation', note: '$4,000 AUD · 100% available' },
];

const DEALS = [
  {
    name: 'Seal a capsule',
    price: '$9',
    sub: 'AUD · the product, today',
    desc: 'Write the words, choose the date, seal it. Only your recipient can ever open it.',
    chip: null,
    featured: false,
    cta: 'Enter the vault →',
    href: EXPERIENCE_URL,
  },
  {
    name: 'Own it, Pyadra runs it',
    price: 'Let’s talk',
    sub: 'hosted ownership',
    desc: 'You own the project; it keeps living on Pyadra infrastructure. The system is autonomous — it runs itself.',
    chip: 'Best fit',
    featured: true,
    cta: 'Start a conversation',
    href: `mailto:${CONTACT_EMAIL}?subject=EterniCapsule%20%E2%80%94%20Hosted%20Ownership`,
  },
  {
    name: 'Take it completely',
    price: 'Let’s talk',
    sub: '100% · operate it anywhere',
    desc: 'Full acquisition with the independence roadmap included. Creator retains a royalty and advisory role.',
    chip: null,
    featured: false,
    cta: 'Start a conversation',
    href: `mailto:${CONTACT_EMAIL}?subject=EterniCapsule%20%E2%80%94%20Full%20Acquisition`,
  },
];

const RISKS = [
  { t: 'No first sale yet', b: 'The product is fully built and deployed, but the first real paying user hasn’t arrived. You’d be buying proof of craft, not proof of demand.' },
  { t: 'The funnel is unmeasured', b: 'Many arrive, few seal — and there are no analytics yet to know where people leave. That data is the next priority.' },
  { t: 'Shared infrastructure', b: 'Stripe webhook and database are shared with Pyadra today. Full independence is documented and takes 15–25 hours.' },
  { t: 'Intentional friction', b: 'The 30-second ritual filters out impatient users by design. That limits volume — and creates the value.' },
];

const FAQ = [
  { q: 'Does it actually work?', a: 'Yes — the complete flow is live: compose, seal, pay $9, scheduled delivery, unlock with a key. Try it yourself before asking anyone anything.' },
  { q: 'Can Pyadra read the messages?', a: 'No. Messages are encrypted in your browser before they ever reach a server. We store only ciphertext and hashed keys — zero-knowledge by design.' },
  { q: 'What exactly would I own?', a: 'The code, the brand, the ceremonial experience, the encryption engine and the delivery system — plus a documented roadmap to full independence.' },
  { q: 'Why is there no revenue yet?', a: 'It launched recently and the first sale is still pending. We say it plainly because everything on Pyadra is said plainly.' },
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

/* The artifact — the project's sphere, grabbable like a real object. */
function PhysicalSphere() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 150, damping: 15 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 150, damping: 15 });
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - rect.left) / rect.width - 0.5);
        my.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
    >
      <div
        aria-hidden
        className="absolute -inset-16 pointer-events-none"
        style={{ background: 'radial-gradient(50% 50% at 50% 45%, rgba(5,150,105,0.12), transparent 70%)' }}
      />
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
          <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#D4DDD6,#A0A0A0)] shadow-[-14px_18px_38px_rgba(10,18,14,0.35)] overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 opacity-30 bg-[conic-gradient(from_0deg,transparent_0deg,transparent_180deg,rgba(255,255,255,0.3)_270deg,transparent_360deg)]"
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
        The vault — sealed words, opened on the day you choose
      </p>
    </div>
  );
}

/* ---------- the page ---------- */

export default function EterniCapsuleShowcase() {
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
            Project № 01
          </span>
          <motion.a
            href={`mailto:${CONTACT_EMAIL}?subject=EterniCapsule%20%E2%80%94%20Contact`}
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
              Live · Global · Digital vault
            </motion.span>

            <h1 className="text-4xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.08] md:leading-[1.02] mb-7">
              {['A vault for words', 'you can’t', 'say today.'].map((line, i) => (
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
              Write them, seal them in digital metal, and choose the exact day
              they can be opened. Not even Pyadra can read them.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ENTER + 0.7, ...SPRING }}
              className="flex items-center gap-3 flex-wrap"
            >
              <PillButton href={EXPERIENCE_URL} primary>
                Seal a capsule — $9 →
              </PillButton>
              <PillButton href="#own">Own the project</PillButton>
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
        <motion.p {...pop} className="text-[13px] font-medium text-[#6B8070] text-center mt-6">
          Don&rsquo;t take our word for it —{' '}
          <Link href={EXPERIENCE_URL} className="font-semibold text-[#059669] hover:underline underline-offset-4">
            open the vault and see it breathe →
          </Link>
        </motion.p>
      </section>

      {/* ============ WHAT YOU TAKE OVER ============ */}
      <section id="own" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 max-w-2xl">
          Built like a ritual.
          <span className="text-[#059669]"> Engineered like a vault.</span>
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] max-w-md mb-14">
          Four things transfer with the project — and all four already work.
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
            Why does it exist?
          </motion.h2>
          <motion.p {...pop} className="text-lg text-[#3A4A3E] max-w-md mb-12 relative">
            Some words are too early, too fragile, or too dangerous for today.
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
            &ldquo;Everything online can be edited, deleted, taken back. I wanted to build
            the opposite — a place where sealed means sealed.
            <span className="text-[#059669]"> Once a capsule closes, not even I can open it.</span>&rdquo;
          </p>
          <p className="text-[15px] font-bold tracking-tight">Eduardo Díaz</p>
          <p className="text-[13px] text-[#6B8070] font-medium mb-8">Founder · EterniCapsule, 2026</p>
          <PillButton href={`mailto:${CONTACT_EMAIL}?subject=EterniCapsule%20%E2%80%94%20To%20Eduardo`}>
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
          Use it for $9, or own a piece of it. Acquisitions happen in conversation — never through a checkout.
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
          Showing the risks is what makes the rest of this page believable.
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
          Some words can&rsquo;t wait.
          <span className="text-[#059669]"> Some must.</span>
        </motion.h2>
        <motion.p {...pop} className="relative text-lg md:text-xl text-[#3A4A3E] max-w-md mx-auto mb-10">
          Seal one today, or take the whole vault with you.
        </motion.p>
        <motion.div {...pop} className="relative flex items-center justify-center gap-3 flex-wrap">
          <PillButton href={EXPERIENCE_URL} primary>Seal a capsule — $9 →</PillButton>
          <PillButton href={`mailto:${CONTACT_EMAIL}?subject=EterniCapsule%20%E2%80%94%20Private%20Info`}>Request private info</PillButton>
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
