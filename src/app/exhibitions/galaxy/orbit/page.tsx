'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PyadraLogo from '@/app/components/brand/PyadraLogo';

/* ------------------------------------------------------------------ */
/*  PYADRA — Project № 02 · Orbit 77                                   */
/*  Design language: family.co — same skeleton as Kangaroo Cleanup.    */
/*                                                                     */
/*  The supporter credential flow is kept FUNCTIONAL:                  */
/*  POST /api/donate (same payload as before) + live funding from      */
/*  /api/stats/orbit-fund. Copy is a working skeleton from             */
/*  Orbit77.md — adjust freely.                                        */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'eadiaz96@gmail.com';
const YOUTUBE_URL = 'https://www.youtube.com/@Orbit77Podcast';
const SHOP_URL = 'https://orbit77.shop/';
const FUNDING_GOAL = 1000; // AUD — Season 2 production budget

const ENTER = 0.75;
const SPRING = { type: 'spring' as const, stiffness: 130, damping: 18, mass: 0.9 };
const pop = {
  initial: { opacity: 0, y: 28, scale: 0.98 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: true, margin: '-70px' },
  transition: SPRING,
};

const TIERS = [
  { amount: 10, name: 'Signal Carrier' },
  { amount: 20, name: 'Archive Node' },
  { amount: 50, name: 'Transmission Keeper' },
];

const TAKEOVER = [
  { num: '01', title: 'A real archive', body: '10 episodes of Season 1, live on YouTube. Raw conversations about life, creation and identity — no script, no filters.' },
  { num: '02', title: 'A working credential system', body: 'Supporters receive a permanent credential (O77-S1-XXXXXX) engraved in the archive. Stripe live, email delivery, all operational.' },
  { num: '03', title: 'A brand with a world', body: 'The orbital concept, the transmission aesthetic, the ritual copy voice — plus orbit77.shop, the external merch store.' },
  { num: '04', title: 'Everything that runs it', body: 'Full source code, database, funding tracker, crew application system, and the independence roadmap (10–12 hours).' },
];

const STORY = [
  { year: '2025', text: 'Pablo & Eduardo start recording from Australia — two friends asking the questions most podcasts avoid.' },
  { year: 'Season 1', text: '10 episodes published. No script, no sponsors, no algorithm games. Built for permanence, not virality.' },
  { year: 'The archive', text: 'The credential system goes live: supporters become part of the permanent record, not just an audience.' },
  { year: 'Today', text: 'Season 2 is being funded by the people who believe in it. Every credential moves the needle.' },
];

const INCLUDED = [
  '10 published episodes (YouTube channel)',
  'Credential system — Stripe live + email delivery',
  'Brand identity and ritual copy guidelines',
  'orbit77.shop — external merch store',
  'Crew application system',
  'Full source code and database schema',
];

const THE_DEAL = [
  { item: 'Founders retain', note: '51% — Pablo & Eduardo keep creative direction' },
  { item: 'Available', note: '49% · indicative valuation $12,000 AUD' },
  { item: 'Pyadra keeps', note: '9% per credential, 3% of merchandise sales' },
];

const RISKS = [
  { t: 'The audience is small', b: '12 supporters and an early YouTube channel. You’d be entering before the proof, not after it — that’s the point, and the risk.' },
  { t: 'Monetization isn’t active', b: 'No AdSense, no Spotify revenue, no sponsors yet. Today the only revenue is credentials and merch.' },
  { t: 'Production is real work', b: 'A podcast doesn’t run itself. Episodes need recording, editing and publishing — actively, every season.' },
  { t: 'Shared infrastructure', b: 'Stripe webhook and database are shared with Pyadra today. Independence is documented and takes 10–12 hours.' },
];

const FAQ = [
  { q: 'Is this real?', a: '10 episodes are public on YouTube and the credential system processes real payments through Stripe. Watch first, decide later.' },
  { q: 'What do supporters get?', a: 'A permanent credential engraved in the archive (O77-S1-XXXXXX), founding member status, early Season 2 access, and direct founder updates.' },
  { q: 'What can I own?', a: 'Up to 49% of the project — the founders keep 51% and creative direction. Revenue is shared proportionally to your stake.' },
  { q: 'Where does the money go?', a: 'Straight into Season 2 production. The goal is $1,000 AUD for 10 new episodes — the progress bar on this page is live.' },
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

/* The artifact — Orbit's sphere, grabbable. */
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
          <div className="relative w-full h-full rounded-full bg-[radial-gradient(circle_at_30%_30%,#FFFFFF,#E8E9E8,#C8C9C8)] shadow-[-14px_18px_38px_rgba(10,18,14,0.3)] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img src="/orbit-logo.png" alt="Orbit 77" className="w-3/5 h-3/5 object-contain opacity-75 pointer-events-none select-none" draggable={false} />
            </div>
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
        Season 1 complete · Season 2 in orbit
      </p>
    </div>
  );
}

/* ---------- the working support flow ---------- */

function SupportCard() {
  const [tier, setTier] = useState(TIERS[1]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const lockIn = async () => {
    setError('');
    if (!email.includes('@')) {
      setError('Please enter a valid email — your credential is delivered there.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intent: 'orbit-support',
          amount: tier.amount * 100,
          project_id: 'orbit-77',
          currency: 'AUD',
          supporter_name: name.trim() || 'Anonymous',
          supporter_email: email.trim(),
          is_anonymous: !name.trim(),
          support_message: '',
        }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data?.error || 'Unable to start checkout');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong — please try again.');
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-2xl bg-[#EDEFED] px-5 py-3.5 text-sm font-medium placeholder:text-[#6B8070]/70 focus:outline-none focus:ring-2 focus:ring-[#059669] transition-shadow';

  return (
    <motion.div {...pop} className="rounded-[32px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-8 md:p-10 max-w-xl mx-auto">
      <h3 className="text-2xl font-bold tracking-tight mb-1.5">Lock in your credential</h3>
      <p className="text-[14px] text-[#3A4A3E] mb-7">
        A permanent place in the archive — O77-S1-XXXXXX, engraved with your support.
      </p>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {TIERS.map((t) => (
          <button
            key={t.amount}
            onClick={() => setTier(t)}
            className={`rounded-2xl px-3 py-4 text-center transition-all ${
              tier.amount === t.amount
                ? 'bg-[#059669]/10 ring-2 ring-[#059669]'
                : 'bg-[#EDEFED] ring-1 ring-transparent hover:ring-[#1A1C1A]/10'
            }`}
          >
            <span className="block text-xl font-bold tracking-tight">${t.amount}</span>
            <span className="block text-[11px] font-semibold text-[#6B8070] mt-0.5">{t.name}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <input type="text" placeholder="Display name (optional — or stay anonymous)" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        <input type="email" placeholder="Your email — the credential arrives here *" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        {error && <p className="text-[13px] font-semibold text-red-600 px-1">{error}</p>}
        <motion.button
          onClick={lockIn}
          disabled={loading}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 350, damping: 17 }}
          className="w-full rounded-full bg-[#059669] text-white px-7 py-4 text-sm font-semibold shadow-lg shadow-[#059669]/25 disabled:opacity-50"
        >
          {loading ? 'Opening checkout…' : `Lock in — $${tier.amount} AUD →`}
        </motion.button>
        <p className="text-[12px] text-[#6B8070] text-center font-medium">
          Secure payment via Stripe · your credential is permanent
        </p>
      </div>
    </motion.div>
  );
}

/* ---------- the page ---------- */

export default function OrbitShowcase() {
  const [raised, setRaised] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/stats/orbit-fund')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.total === 'number') setRaised(data.total);
      })
      .catch(() => setRaised(null));
  }, []);

  const pct = raised !== null ? Math.min((raised / FUNDING_GOAL) * 100, 100) : 0;

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
            Project № 02
          </span>
          <motion.a
            href="#support"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 17 }}
            className="rounded-full bg-[#1A1C1A] text-white px-5 py-2 text-[13px] font-semibold"
          >
            Support
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
              10 episodes live · funding Season 2
            </motion.span>

            <h1 className="text-4xl md:text-7xl font-bold tracking-[-0.035em] leading-[1.08] md:leading-[1.02] mb-7">
              {['Real conversations.', 'No script.', 'No filters.'].map((line, i) => (
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
              A podcast recorded from Australia exploring life, creation, identity
              — and what we leave behind. Built for permanence, not virality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ENTER + 0.7, ...SPRING }}
              className="flex items-center gap-3 flex-wrap"
            >
              <PillButton href={YOUTUBE_URL} primary>Watch Season 1 →</PillButton>
              <PillButton href="#support">Support Season 2</PillButton>
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

      {/* ============ PROOF STRIP + LIVE FUNDING ============ */}
      <section className="max-w-6xl mx-auto px-6 pb-24 md:pb-32 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { value: '10', label: 'episodes live on YouTube' },
            { value: 'From $10', label: 'supporter credential' },
            { value: '49%', label: 'available to own' },
            { value: '$12,000', label: 'indicative valuation · AUD' },
          ].map((stat, i) => (
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

        {/* live Season 2 funding bar */}
        <motion.div {...pop} className="rounded-3xl bg-white p-6 md:p-8 shadow-sm ring-1 ring-[#1A1C1A]/5">
          <div className="flex items-baseline justify-between flex-wrap gap-2 mb-4">
            <span className="text-[15px] font-bold tracking-tight">Season 2 production fund</span>
            <span className="text-[13px] font-semibold text-[#059669]">
              {raised !== null ? `$${raised.toLocaleString()} of $${FUNDING_GOAL.toLocaleString()} AUD` : 'loading…'}
            </span>
          </div>
          <div className="h-3 rounded-full bg-[#EDEFED] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 60, damping: 20, delay: 0.3 }}
              className="h-full rounded-full bg-[#059669]"
            />
          </div>
          <p className="text-[12px] font-medium text-[#6B8070] mt-3">
            Live from the archive — every credential moves this bar.
          </p>
        </motion.div>

        <motion.div {...pop} className="flex items-center justify-center gap-2 flex-wrap mt-6">
          <span className="text-[13px] font-medium text-[#6B8070] mr-1">All public — verify it yourself:</span>
          {[
            { label: 'YouTube', href: YOUTUBE_URL },
            { label: 'orbit77.shop', href: SHOP_URL },
          ].map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener"
              whileHover={{ scale: 1.06, y: -1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 350, damping: 17 }}
              className="rounded-full bg-white px-4 py-2 text-[13px] font-semibold ring-1 ring-[#1A1C1A]/8 shadow-sm hover:text-[#059669] transition-colors"
            >
              {link.label} ↗
            </motion.a>
          ))}
        </motion.div>
      </section>

      {/* ============ WHAT YOU TAKE OVER ============ */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 max-w-2xl">
          Not just a podcast.
          <span className="text-[#059669]"> A permanent archive.</span>
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] max-w-md mb-14">
          Four things transfer with a participation — all of them already exist.
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
            Two friends, a microphone, and the questions that don&rsquo;t fit anywhere else.
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

      {/* ============ SUPPORT — the working flow ============ */}
      <section id="support" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.h2 {...pop} className="text-4xl md:text-6xl font-bold tracking-[-0.03em] leading-[1.05] mb-4 text-center">
          Hold the signal.
        </motion.h2>
        <motion.p {...pop} className="text-lg text-[#3A4A3E] text-center max-w-md mx-auto mb-14">
          Season 2 is funded by people, not algorithms. Your credential is permanent.
        </motion.p>
        <SupportCard />
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
              Acquisitions happen in conversation, with legal review — never through a checkout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ FOUNDERS NOTE ============ */}
      <section className="max-w-3xl mx-auto px-6 py-24 md:py-32">
        <motion.div {...pop} className="rounded-[36px] bg-white shadow-sm ring-1 ring-[#1A1C1A]/5 p-8 md:p-14 text-center">
          <p className="font-serif italic text-2xl md:text-[1.85rem] font-normal leading-snug text-[#1A1C1A] mb-8">
            &ldquo;We didn&rsquo;t want an audience. We wanted an archive — conversations
            that still matter in twenty years.
            <span className="text-[#059669]"> Every supporter is engraved in it, permanently.</span>&rdquo;
          </p>
          <p className="text-[15px] font-bold tracking-tight">Pablo &amp; Eduardo</p>
          <p className="text-[13px] text-[#6B8070] font-medium mb-8">Founders · Orbit 77, Australia</p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <PillButton href={`mailto:${CONTACT_EMAIL}?subject=Orbit%2077%20%E2%80%94%20To%20the%20founders`}>
              Write to the founders
            </PillButton>
            <Link
              href="/exhibitions/galaxy/orbit/join"
              className="text-[13px] font-semibold text-[#6B8070] hover:text-[#059669] transition-colors"
            >
              or join the crew →
            </Link>
          </div>
        </motion.div>
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
          The signal is live.
        </motion.h2>
        <motion.p {...pop} className="relative text-lg md:text-xl text-[#3A4A3E] max-w-md mx-auto mb-10">
          Watch it, hold it, or own a piece of it — the archive remembers all three.
        </motion.p>
        <motion.div {...pop} className="relative flex items-center justify-center gap-3 flex-wrap">
          <PillButton href="#support" primary>Lock in your credential →</PillButton>
          <PillButton href={`mailto:${CONTACT_EMAIL}?subject=Orbit%2077%20%E2%80%94%20Own%20a%20piece`}>Own a piece</PillButton>
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
